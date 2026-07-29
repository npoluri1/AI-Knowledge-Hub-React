"""Scrape all jobs from topgenaijobs.com using Playwright"""
import json
import re
import os
import time
from playwright.sync_api import sync_playwright

BASE = "https://www.topgenaijobs.com"
TOTAL_PAGES = 29
OUTPUT = "frontend/src/data/topgenai_jobs.js"

def scrape_page(page, page_num):
    """Scrape a single listing page"""
    url = f"{BASE}/jobs?page={page_num}"
    print(f"  Navigating to page {page_num}...")
    page.goto(url, wait_until="networkidle")
    time.sleep(2)
    
    # Wait for job cards/table to render
    jobs = []
    
    # Try to find job rows in the table
    rows = page.query_selector_all("table tbody tr, table tr")
    
    if rows and len(rows) > 1:
        print(f"  Found {len(rows)} table rows")
        for row in rows:
            cells = row.query_selector_all("td")
            if len(cells) >= 9:
                job = {}
                
                # Company (td[0])
                job["company"] = cells[0].inner_text().strip()
                
                # Title (td[1]) - title is in the first child div, Posted badge is a child div
                title_div = cells[1].query_selector("div div.break-words")
                if title_div:
                    job["title"] = title_div.inner_text().strip()
                else:
                    # Fallback: get first div's text only
                    all_divs = cells[1].query_selector_all("div")
                    if all_divs:
                        job["title"] = all_divs[0].inner_text().strip()
                    else:
                        job["title"] = cells[1].inner_text().strip().split('\n')[0].strip()
                
                # Location (td[2])
                job["location"] = cells[2].inner_text().strip()
                
                # Experience (td[3])
                job["experience"] = cells[3].inner_text().strip()
                
                # Job Type (td[4])
                job["job_type"] = cells[4].inner_text().strip()
                
                # Mode (td[5])
                job["mode"] = cells[5].inner_text().strip()
                
                # Salary (td[6])
                job["salary"] = cells[6].inner_text().strip()
                
                # Skills (td[7]) - each skill is in a child div with specific classes
                skill_elements = cells[7].query_selector_all("div.inline-flex, span.inline-flex, div.rounded-full, span.rounded-full")
                if skill_elements:
                    job["skills"] = []
                    for s in skill_elements:
                        text = s.inner_text().strip()
                        if text and not text.startswith("+"):
                            job["skills"].append(text)
                
                # If no skill elements found, try inner_text split by newline
                if not job.get("skills") or len(job["skills"]) == 0:
                    skills_text = cells[7].inner_text().strip()
                    job["skills"] = [s.strip() for s in skills_text.split('\n') if s.strip() and not s.strip().startswith("+")]
                
                # URL - from View button in td[8]
                view_link = cells[8].query_selector("a")
                if view_link:
                    href = view_link.get_attribute("href") or ""
                    job["url"] = href if href.startswith("http") else BASE + href
                
                # Posted - from the Posted badge in td[1]
                posted_badge = cells[1].query_selector("div div:has-text('Posted')")
                if posted_badge:
                    job["posted"] = posted_badge.inner_text().strip()
                else:
                    for cell in cells:
                        text = cell.inner_text()
                        if "Posted" in text:
                            posted_match = re.search(r'Posted\s+(Today|\d+\s+(day|days|week|weeks|month|months)\s+ago)', text)
                            if posted_match:
                                job["posted"] = posted_match.group(0)
                                break
                
                if job.get("title") and job.get("company"):
                    jobs.append(job)
    else:
        # Fallback: try to find job cards
        print("  No table found, trying card layout...")
        cards = page.query_selector_all("a[href*='/jobs/']")
        
        # Extract unique job cards with href containing /jobs/
        seen = set()
        for card in cards:
            href = card.get_attribute("href") or ""
            if href not in seen and "/jobs/" in href and href != "/jobs":
                seen.add(href)
                title_el = card.query_selector("h3, h2, h4")
                if title_el:
                    job = {"url": href if href.startswith("http") else BASE + href}
                    job["title"] = title_el.inner_text().strip()
                    job["company"] = ""
                    job["location"] = ""
                    job["salary"] = ""
                    job["skills"] = []
                    jobs.append(job)
    
    return jobs


def scrape_job_detail(page, job):
    """Scrape detail from a job page"""
    url = job.get("url", "")
    if not url:
        return ""
    
    try:
        page.goto(url, wait_until="networkidle", timeout=30000)
        time.sleep(1)
    except Exception as e:
        print(f"  Error loading {url}: {e}")
        return ""
    
    desc = ""
    
    try:
        # Get all text from the main content area and extract description
        main = page.query_selector("main")
        if main:
            all_text = main.inner_text()
            # Find "Description" section
            desc_idx = all_text.find("Description")
            if desc_idx >= 0:
                # Get content after "Description" until next section
                after_desc = all_text[desc_idx + 11:].strip()
                # Cut at "Apply" or "Prepare" or "More"
                for stop in ["Apply for this job", "Prepare for this role", "More LLM jobs", "Back to jobs"]:
                    stop_idx = after_desc.find(stop)
                    if stop_idx >= 0:
                        after_desc = after_desc[:stop_idx]
                        break
                desc = after_desc.strip()[:600]
            else:
                # Fallback to full text
                desc = all_text[:600].strip()
    except Exception as e:
        print(f"  Error parsing detail: {e}")
    
    return desc.strip()


def main():
    print("=" * 60)
    print("TopGenAIJobs Scraper (Playwright)")
    print("=" * 60)
    
    all_jobs = []
    detail_cache = {}
    cache_file = "topgenai_cache.json"
    
    if os.path.exists(cache_file):
        with open(cache_file, "r", encoding="utf-8") as f:
            detail_cache = json.load(f)
        print(f"Loaded {len(detail_cache)} cached details")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )
        page = context.new_page()
        
        # Phase 1: Scrape all listing pages
        for pn in range(1, TOTAL_PAGES + 1):
            jobs = scrape_page(page, pn)
            print(f"  Page {pn}: {len(jobs)} jobs")
            all_jobs.extend(jobs)
        
        # Phase 2: Enrich descriptions for first 50 jobs as sample
        print(f"\nTotal jobs from listings: {len(all_jobs)}")
        
        jobs_to_fetch = [j for j in all_jobs if j.get("url") and j["url"] not in detail_cache]
        print(f"Fetching details for {min(50, len(jobs_to_fetch))} jobs (sample)...")
        
        for i, job in enumerate(jobs_to_fetch[:50]):
            print(f"  [{i+1}/50] Fetching: {job.get('title', '')[:40]}...")
            desc = scrape_job_detail(page, job)
            job["desc"] = desc
            detail_cache[job["url"]] = desc
            time.sleep(0.5)
        
        # Apply any cached descriptions
        for job in all_jobs:
            if job.get("url") and job["url"] in detail_cache and not job.get("desc"):
                job["desc"] = detail_cache[job["url"]]
        
        browser.close()
    
    # Save cache
    with open(cache_file, "w", encoding="utf-8") as f:
        json.dump(detail_cache, f, indent=2)
    
    # Save raw listing data as JSON for later processing
    listing_cache = "topgenai_listings.json"
    # Strip desc from all_jobs to save space in listing cache
    clean_jobs = []
    for j in all_jobs:
        cj = dict(j)
        cj.pop("desc", None)
        clean_jobs.append(cj)
    with open(listing_cache, "w", encoding="utf-8") as f:
        json.dump(clean_jobs, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(clean_jobs)} listings to {listing_cache}")
    
    # Generate JS module
    print("\nGenerating JS module...")
    
    all_techs = set()
    for j in all_jobs:
        for t in j.get("skills", []):
            if t:
                all_techs.add(t)
    sorted_techs = sorted(all_techs)
    
    lines = []
    lines.append("// GenAI & Agentic AI Jobs - All from TopGenAIJobs")
    lines.append("")
    lines.append("export const TOPGENAI_JOBS = [")
    
def esc(s):
    if s is None:
        return ""
    return str(s).replace("\\", "\\\\").replace("'", "\\'").replace("`", "\\`").replace("${", "\\${").replace("\n", "\\n").replace("\r", "\\r")
    
    for j in all_jobs:
        title = esc(j.get("title", ""))
        company = esc(j.get("company", ""))
        location = esc(j.get("location", ""))
        salary = esc(j.get("salary", ""))
        experience = esc(j.get("experience", ""))
        mode = esc(j.get("mode", ""))
        posted = esc(j.get("posted", ""))
        desc = esc(j.get("desc", ""))[:300]
        skills = j.get("skills", [])
        url = esc(j.get("url", ""))
        job_type = esc(j.get("job_type", ""))
        
        lines.append("  {")
        lines.append(f"    title: '{title}',")
        lines.append(f"    company: '{company}',")
        lines.append(f"    location: '{location}',")
        lines.append(f"    salary: '{salary}',")
        lines.append(f"    experience: '{experience}',")
        lines.append(f"    job_type: '{job_type}',")
        lines.append(f"    mode: '{mode}',")
        lines.append(f"    posted: '{posted}',")
        lines.append(f"    skills: {json.dumps(skills)},")
        lines.append(f"    desc: '{desc}',")
        lines.append(f"    url: '{url}'")
        lines.append("  },")
    
    lines.append("]")
    lines.append("")
    lines.append(f"export const TOPGENAI_TECHS = {json.dumps(sorted_techs)}")
    lines.append("")
    lines.append(f"export const TOPGENAI_LOCATIONS = [...new Set(TOPGENAI_JOBS.map(j => j.location))].sort()")
    lines.append("")
    
    js_content = "\n".join(lines)
    
    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write(js_content)
    
    size_kb = os.path.getsize(OUTPUT) / 1024
    print(f"Saved to {OUTPUT} ({size_kb:.0f} KB)")
    print(f"Total: {len(all_jobs)} jobs, {len(sorted_techs)} unique skills")
    
    companies = set(j.get("company", "") for j in all_jobs)
    locations = set(j.get("location", "") for j in all_jobs)
    print(f"Companies: {len(companies)}, Locations: {len(locations)}")
    
    if all_jobs:
        s = all_jobs[0]
        print(f"\nSample: {s.get('title')} @ {s.get('company')} | skills: {s.get('skills')[:5]}")


if __name__ == "__main__":
    main()
