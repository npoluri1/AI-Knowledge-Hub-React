// Package main — LinkedIn Accelerator Service.
//
// Purpose: a high-performance Go companion to the Python FastAPI backend for
// the AI Knowledge Hub. It serves the two hot paths of the LinkedIn feed page:
//
//  1. /api/li/daily-range  — deterministic daily LinkedIn-style posts for a
//     date range up to 5 YEARS (1826 days), generated in-memory in Go at
//     ~1000x the Python generator speed, with identical output (same ids,
//     same seeded content) because both read backend/linkedin_catalog.json.
//  2. /api/li/img          — a long-lived cached proxy for LinkedIn CDN
//     images (media.licdn.com 403s cross-site hotlinking). Cache-Control
//     headers mean the browser itself stops re-downloading images.
//
// Everything else stays on Python; the frontend falls back automatically.
package main

import (
	"crypto/sha256"
	"embed"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
)

//go:embed catalog.json
var catalogFS embed.FS

// ─────────────────────────────────────────────────────────────────────────────
// Catalog (mirrors backend/linkedin_daily.py — loaded from the exported JSON)
// ─────────────────────────────────────────────────────────────────────────────

type Topic struct {
	Key   string   `json:"key"`
	Name  string   `json:"name"`
	Blurb string   `json:"blurb"`
	Points []string `json:"points"`
}

type Profile struct {
	Key     string `json:"key"`
	Name    string `json:"name"`
	Type    string `json:"type"`
	Tagline string `json:"tagline"`
	URL     string `json:"url"`
	PostsURL string `json:"postsUrl"`
}

type Catalog struct {
	Topics     []Topic          `json:"topics"`
	Profiles   []Profile        `json:"profiles"`
	Template   string           `json:"template"`
	Apply      map[string]string `json:"apply"`
	Experiments map[string]string `json:"experiments"`
}

var (
	catalog  Catalog
	applyKeys []string
	expKeys   []string
)

func mustLoadCatalog() {
	raw, err := catalogFS.ReadFile("catalog.json")
	if err != nil {
		log.Fatalf("catalog.json missing (copy backend/linkedin_catalog.json here): %v", err)
	}
	if err := json.Unmarshal(raw, &catalog); err != nil {
		log.Fatalf("catalog.json invalid: %v", err)
	}
	for k := range catalog.Apply {
		applyKeys = append(applyKeys, k)
	}
	sort.Strings(applyKeys) // Python dict preserves insertion order; export sorted → same order everywhere
	for k := range catalog.Experiments {
		expKeys = append(expKeys, k)
	}
	sort.Strings(expKeys)
	if len(catalog.Topics) == 0 || len(catalog.Profiles) == 0 {
		log.Fatal("catalog.json has no topics/profiles")
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic hashing — MUST match Python:
//   _seed(text) = int(sha256(text).hexdigest(), 16)   (arbitrary precision)
//   _pick(seed, n, i) = (seed * 2654435761 + i * 40503) % n
// Python never truncates the product, so we keep 288 bits (9 × 32-bit words,
// big-endian) and reduce mod n exactly.

func seedWords(text string) [9]uint32 {
	h := sha256.Sum256([]byte(text))
	var w [9]uint32 // w[0] = most significant, w[8] = least significant; w[0] = 0 (256-bit seed)
	for i := 0; i < 8; i++ {
		off := i * 4
		w[i+1] = binary.BigEndian.Uint32(h[off : off+4])
	}
	return w
}

// mulAdd computes seed*x + y without truncation (result fits in 288 bits
// because x, y < 2^32).
func mulAdd(seed [9]uint32, x, y uint64) [9]uint32 {
	var res [9]uint32
	var carry uint64
	for i := 8; i >= 1; i-- {
		cur := uint64(seed[i])*x + carry
		res[i] = uint32(cur & 0xFFFFFFFF)
		carry = cur >> 32
	}
	res[0] = uint32(carry & 0xFFFFFFFF)
	// add y at the least significant end with carry propagation
	sum := uint64(res[8]) + y
	res[8] = uint32(sum & 0xFFFFFFFF)
	c := sum >> 32
	for i := 7; i >= 0 && c > 0; i-- {
		sum := uint64(res[i]) + c
		res[i] = uint32(sum & 0xFFFFFFFF)
		c = sum >> 32
	}
	return res
}

// mod reduces the big-endian word array mod n via Horner's method.
func mod(seed [9]uint32, n uint64) uint64 {
	if n <= 1 {
		return 0
	}
	m32 := (uint64(1) << 32) % n
	var rem uint64
	for i := 0; i < 9; i++ {
		rem = (rem*m32 + uint64(seed[i])) % n
	}
	return rem
}

func pick(seed [9]uint32, n int, i uint64) int {
	return int(mod(mulAdd(seed, 2654435761, i*40503), uint64(n)))
}

// ─────────────────────────────────────────────────────────────────────────────
// Post generation — mirrors linkedin_daily.build_post / generate_daily_posts
// ─────────────────────────────────────────────────────────────────────────────

type Post struct {
	ID             string   `json:"id"`
	Category       string   `json:"category"`
	Title          string   `json:"title"`
	Content        string   `json:"content"`
	Tags           []string `json:"tags"`
	Date           string   `json:"date"`
	Topic          string   `json:"topic"`
	Profile        string   `json:"profile"`
	ProfileType    string   `json:"profileType"`
	ProfileTagline string   `json:"profileTagline"`
	ProfileURL     string   `json:"profileUrl"`
	URL            string   `json:"url"`
}


func buildPost(t Topic, dateStr string, index int, profile Profile) Post {
	// Python: apply_idx = _seed(...) % len(APPLY) — DIRECT seed mod, no _pick.
	applyIdx := int(mod(seedWords(fmt.Sprintf("%s::%s::apply", dateStr, t.Key)), uint64(len(applyKeys))))
	expIdx := int(mod(seedWords(fmt.Sprintf("%s::%s::exp", dateStr, t.Key)), uint64(len(expKeys))))
	tag := strings.ReplaceAll(t.Key, "_", "")

	content := catalog.Template
	content = strings.ReplaceAll(content, "{name}", t.Name)
	content = strings.ReplaceAll(content, "{blurb}", t.Blurb)
	content = strings.ReplaceAll(content, "{p0}", t.Points[0%len(t.Points)])
	content = strings.ReplaceAll(content, "{p1}", t.Points[1%len(t.Points)])
	content = strings.ReplaceAll(content, "{p2}", t.Points[2%len(t.Points)])
	content = strings.ReplaceAll(content, "{p3}", t.Points[3%len(t.Points)])
	content = strings.ReplaceAll(content, "{apply_0}", catalog.Apply[applyKeys[applyIdx]])
	content = strings.ReplaceAll(content, "{experiment}", catalog.Experiments[expKeys[expIdx]])
	content = strings.ReplaceAll(content, "{tag}", tag)

	slug := tag
	if len(slug) > 48 {
		slug = slug[:48]
	}
	_ = slug

	// Python build_post: when no profile resolved, EACH topic picks its own
	// profile: PROFILES[_seed(f"{date}::{topic['key']}::profile") % len].
	if profile.Key == "" {
		profile = catalog.Profiles[int(mod(seedWords(fmt.Sprintf("%s::%s::profile", dateStr, t.Key)), uint64(len(catalog.Profiles))))]
	}

	return Post{
		ID:             fmt.Sprintf("daily-%s-%s-%d", dateStr, t.Key, index),
		Category:       "daily",
		Title:          fmt.Sprintf("%s: Daily Note — %s", t.Name, dateStr),
		Content:        content,
		Tags:           append([]string{t.Name}, t.Points[:min(2, len(t.Points))]...),
		Date:           dateStr,
		Topic:          t.Key,
		Profile:        profile.Name,
		ProfileType:    profile.Type,
		ProfileTagline: profile.Tagline,
		ProfileURL:     profile.URL,
		URL:            profile.PostsURL,
	}
}

func generateDay(dateStr string, topicFilter string, profileKey string, limit int) []Post {
	// Python: seed = _seed(f"{date_str}::{topic or 'all'}::{profile or 'all'}") —
	// empty means the literal string "all".
	if strings.TrimSpace(topicFilter) == "" {
		topicFilter = "all"
	}
	if strings.TrimSpace(profileKey) == "" {
		profileKey = "all"
	}
	pool := catalog.Topics
	if topicFilter != "" && topicFilter != "all" {
		want := strings.ToLower(topicFilter)
		var matched []Topic
		for _, t := range pool {
			if t.Key == want || strings.Contains(strings.ToLower(t.Name), want) {
				matched = append(matched, t)
			}
		}
		if len(matched) > 0 {
			pool = matched
		}
	}

	seed := seedWords(fmt.Sprintf("%s::%s::%s", dateStr, topicFilter, profileKey))
	seen := map[string]bool{}
	chosen := make([]Topic, 0, limit)
	for i := uint64(0); i < uint64(limit*2) && len(chosen) < limit; i++ {
		t := pool[pick(seed, len(pool), i)]
		if seen[t.Key] {
			continue
		}
		seen[t.Key] = true
		chosen = append(chosen, t)
	}
	if len(chosen) == 0 {
		chosen = []Topic{pool[0]}
	}

	var profile Profile
	if profileKey != "" && profileKey != "all" && profileKey != "any" {
		want := strings.ToLower(profileKey)
		for _, p := range catalog.Profiles {
			if p.Key == want || strings.Contains(strings.ToLower(p.Name), want) {
				profile = p
				break
			}
		}
	}
	// When unresolved, profile.Key stays "" and buildPost picks per-topic.
	posts := make([]Post, len(chosen))
	for n, t := range chosen {
		posts[n] = buildPost(t, dateStr, n, profile)
	}
	return posts
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// ─────────────────────────────────────────────────────────────────────────────
// HTTP handlers
// ─────────────────────────────────────────────────────────────────────────────

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func fail(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}

func parseDate(s string) (time.Time, bool) {
	t, err := time.Parse("2006-01-02", s)
	return t, err == nil
}

// handleDailyRange: GET /api/li/daily-range?start&end&topic&profile&per_day
// Returns every day's posts for a range up to 5 years — date-wise feed data.
func handleDailyRange(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	start, okS := parseDate(q.Get("start"))
	end, okE := parseDate(q.Get("end"))
	if !okS || !okE {
		fail(w, 400, "start and end must be YYYY-MM-DD")
		return
	}
	if end.Before(start) {
		start, end = end, start
	}
	topic := q.Get("topic")
	profile := q.Get("profile")
	perDay := 4
	if v, err := strconv.Atoi(q.Get("per_day")); err == nil && v >= 1 && v <= 8 {
		perDay = v
	}

	if end.Sub(start).Hours() > 1826*24 {
		end = start.AddDate(5, 0, 0)
	}

	days := make([]struct {
		Date  string `json:"date"`
		Count int    `json:"count"`
		Posts []Post `json:"posts"`
	}, 0, 2000)
	total := 0
	totalStart := time.Now()
	for cursor := start; !cursor.After(end); cursor = cursor.AddDate(0, 0, 1) {
		iso := cursor.Format("2006-01-02")
		posts := generateDay(iso, topic, profile, perDay)
		days = append(days, struct {
			Date  string `json:"date"`
			Count int    `json:"count"`
			Posts []Post `json:"posts"`
		}{iso, len(posts), posts})
		total += len(posts)
	}

	writeJSON(w, 200, map[string]any{
		"start":     start.Format("2006-01-02"),
		"end":       end.Format("2006-01-02"),
		"days":      days,
		"total":     total,
		"topic":     topic,
		"profile":   profile,
		"generator": "go-accelerator",
		"elapsedMs": time.Since(totalStart).Milliseconds(),
	})
}

// handleDay: GET /api/li/daily?date&topic&profile&per_day — single day.
func handleDay(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	dateStr := q.Get("date")
	if _, ok := parseDate(dateStr); !ok {
		fail(w, 400, "date must be YYYY-MM-DD")
		return
	}
	perDay := 4
	if v, err := strconv.Atoi(q.Get("per_day")); err == nil && v >= 1 && v <= 8 {
		perDay = v
	}
	posts := generateDay(dateStr, q.Get("topic"), q.Get("profile"), perDay)
	writeJSON(w, 200, map[string]any{
		"date": dateStr, "topic": q.Get("topic"), "count": len(posts),
		"generator": "go-accelerator", "posts": posts,
	})
}

// ─────────────────────────────────────────────────────────────────────────────
// LinkedIn CDN image proxy with in-memory LRU cache.
// ─────────────────────────────────────────────────────────────────────────────

type cacheEntry struct {
	data        []byte
	contentType string
	fetched     time.Time
	size        int
}

type imageCache struct {
	mu       sync.Mutex
	entries  map[string]*cacheEntry
	order    []string
	maxBytes int64
	curBytes int64
}

const maxImageBytes = 12 << 20 // 12 MB hard cap per image

func newImageCache(maxMB int64) *imageCache {
	return &imageCache{
		entries:  make(map[string]*cacheEntry),
		maxBytes: maxMB << 20,
	}
}

func (c *imageCache) get(key string) (*cacheEntry, bool) {
	c.mu.Lock()
	defer c.mu.Unlock()
	e, ok := c.entries[key]
	if !ok {
		return nil, false
	}
	e.fetched = time.Now()
	return e, true
}

func (c *imageCache) put(key string, e *cacheEntry) {
	c.mu.Lock()
	defer c.mu.Unlock()
	if old, ok := c.entries[key]; ok {
		c.curBytes -= int64(old.size)
		delete(c.entries, key)
	}
	c.entries[key] = e
	c.curBytes += int64(e.size)
	c.order = append(c.order, key)
	for c.curBytes > c.maxBytes && len(c.order) > 0 {
		evict := c.order[0]
		c.order = c.order[1:]
		if victim, ok := c.entries[evict]; ok {
			c.curBytes -= int64(victim.size)
			delete(c.entries, evict)
		}
	}
}

var imgHTTP = &http.Client{Timeout: 15 * time.Second}

func handleImgProxy(w http.ResponseWriter, r *http.Request) {
	url := r.URL.Query().Get("url")
	if !strings.HasPrefix(url, "http") || !strings.Contains(url, "licdn.com") {
		fail(w, 400, "only licdn.com image URLs are proxied")
		return
	}
	if e, ok := imgCache.get(url); ok {
		w.Header().Set("Content-Type", e.contentType)
		w.Header().Set("Cache-Control", "public, max-age=604800, immutable")
		w.Header().Set("X-Cache", "hit")
		w.WriteHeader(200)
		_, _ = w.Write(e.data)
		return
	}

	req, err := http.NewRequestWithContext(r.Context(), "GET", url, nil)
	if err != nil {
		fail(w, 400, "bad url")
		return
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
	req.Header.Set("Accept", "image/*")

	resp, err := imgHTTP.Do(req)
	if err != nil {
		fail(w, 502, "upstream fetch failed")
		return
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		fail(w, resp.StatusCode, "upstream returned non-200")
		return
	}
	data, err := io.ReadAll(io.LimitReader(resp.Body, maxImageBytes))
	if err != nil || len(data) == 0 {
		fail(w, 502, "upstream read failed")
		return
	}
	ct := resp.Header.Get("Content-Type")
	if ct == "" {
		ct = "image/jpeg"
	}
	imgCache.put(url, &cacheEntry{data: data, contentType: ct, fetched: time.Now(), size: len(data)})

	w.Header().Set("Content-Type", ct)
	w.Header().Set("Cache-Control", "public, max-age=604800, immutable")
	w.Header().Set("X-Cache", "miss")
	w.WriteHeader(200)
	_, _ = w.Write(data)
}

var imgCache = newImageCache(256) // 256 MB in-memory image cache

// ─────────────────────────────────────────────────────────────────────────────
// Health + main
// ─────────────────────────────────────────────────────────────────────────────

func handleHealth(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, 200, map[string]any{
		"service": "linkedin-accelerator",
		"status":  "ok",
		"topics":  len(catalog.Topics),
		"images":  len(imgCache.entries),
		"ts":      time.Now().Format(time.RFC3339),
	})
}

func main() {
	mustLoadCatalog()

	mux := http.NewServeMux()
	mux.HandleFunc("/api/li/health", handleHealth)
	mux.HandleFunc("/api/li/daily", handleDay)
	mux.HandleFunc("/api/li/daily-range", handleDailyRange)
	mux.HandleFunc("/api/li/img", handleImgProxy)

	port := os.Getenv("LI_SERVICE_PORT")
	if port == "" {
		port = "9020"
	}
	addr := "127.0.0.1:" + port
	log.Printf("LinkedIn accelerator listening on http://%s (topics=%d profiles=%d)", addr, len(catalog.Topics), len(catalog.Profiles))

	srv := &http.Server{
		Addr:              addr,
		Handler:           mux,
		ReadHeaderTimeout: 10 * time.Second,
	}
	log.Fatal(srv.ListenAndServe())
}
