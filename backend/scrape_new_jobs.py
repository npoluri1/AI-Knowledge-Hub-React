"""
Scrape new jobs from topgenaijobs.com API and append to existing data.
Usage: python backend/scrape_new_jobs.py
"""

import urllib.request
import json
import re
import os
import sys

API_BASE = "https://www.topgenaijobs.com/api/jobs?"
OUTPUT_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "src", "data", "topgenai_jobs.js")

def esc(s):
    """Escape a string for JS single-quoted string.
    Uses \\u0027 for single quotes to avoid ambiguous \\' + ' patterns
    that confuse Vite's import analyzer.
    """
    if s is None:
        return ""
    s = str(s)
    s = s.replace("\\", "\\\\")
    s = s.replace("'", "\\u0027")  # unicode escape for ' — unambiguous
    s = s.replace("`", "\\`")
    s = s.replace("${", "\\${")
    s = s.replace("\n", "\\n")
    s = s.replace("\r", "\\r")
    return s


def fetch_page(page_num, limit=50):
    """Fetch a single page of jobs from the API."""
    url = f"{API_BASE}page={page_num}&limit={limit}&view=card"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/json",
        }
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data


def extract_job(api_job):
    """Convert an API job object to the JS module format."""
    title = api_job.get("job_title", api_job.get("title", ""))
    company = api_job.get("company", "")
    location = api_job.get("location", "")
    salary = ""
    s_min = api_job.get("salary_min")
    s_max = api_job.get("salary_max")
    if s_min is not None and s_max is not None:
        currency = api_job.get("salary_currency", "$")
        period = api_job.get("salary_period", "yr")
        salary = f"{currency}{s_min:.0f}K–{s_max:.0f}K/{period[:3]}"
    skills = api_job.get("skills", [])
    if isinstance(skills, str):
        skills = [s.strip() for s in skills.split(",") if s.strip()]
    desc = api_job.get("source_raw_description", api_job.get("responsibility", ""))
    if not desc:
        desc = api_job.get("job_title", "")
    # Truncate desc to 300 chars for the file; strip trailing quotes that confuse Vite
    strip_chars = "'\\"
    desc = desc[:300].rstrip(strip_chars)
    experience = api_job.get("experience", "")
    job_type = api_job.get("job_type", "")
    mode = api_job.get("work_mode", "")
    posted_raw = api_job.get("created_at", "")
    posted = ""
    if posted_raw:
        # Convert ISO date to relative time
        import datetime
        try:
            created = datetime.datetime.fromisoformat(posted_raw.replace("Z", "+00:00"))
            now = datetime.datetime.now(datetime.timezone.utc)
            days_ago = (now - created).days
            if days_ago == 0:
                posted = "Posted Today"
            elif days_ago == 1:
                posted = "Posted 1 day ago"
            else:
                posted = f"Posted {days_ago} days ago"
        except:
            posted = f"Posted {posted_raw[:10]}"
    
    slug = api_job.get("slug", "")
    url = f"https://www.topgenaijobs.com/jobs/{slug}" if slug else ""
    
    return {
        "title": title,
        "company": company,
        "location": location,
        "salary": salary,
        "experience": str(experience),
        "job_type": job_type,
        "mode": mode,
        "posted": posted,
        "skills": skills,
        "desc": desc,
        "url": url,
    }


def load_existing_jobs():
    """Load existing jobs from the JS module file."""
    if not os.path.exists(OUTPUT_PATH):
        print(f"Output file {OUTPUT_PATH} does not exist yet.")
        return []
    
    with open(OUTPUT_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extract all URLs
    urls = re.findall(r"url:\s*'([^']+)'", content)
    titles = re.findall(r"title:\s*'([^']+)'", content)
    print(f"Existing file: {len(titles)} jobs, {len(urls)} URLs")
    
    # Create a set of existing URLs for dedup
    existing_urls = set(urls)
    
    # Also extract all jobs as a list of dicts for later rebuilding
    # We'll just rebuild the entire file with new jobs appended
    
    return list(existing_urls), content


def generate_js_module(all_jobs):
    """Generate the full JS module content."""
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
    lines.append("export const TOPGENAI_LOCATIONS = [...new Set(TOPGENAI_JOBS.map(j => j.location))].sort()")
    lines.append("")
    
    return "\n".join(lines)


def main():
    print("=" * 60)
    print("TopGenAIJobs - New Job Scraper")
    print("=" * 60)
    
    # Load existing jobs
    existing_urls_str, existing_content = load_existing_jobs()
    
    # Fetch all pages
    all_new_jobs = []
    seen_urls_in_fetch = set()
    
    total_pages = 35
    total_new = 0
    total_duplicates = 0
    
    for page_num in range(1, total_pages + 1):
        try:
            data = fetch_page(page_num)
            api_jobs = data.get("jobs", [])
            
            page_new = 0
            page_dup = 0
            
            for api_job in api_jobs:
                ext = extract_job(api_job)
                job_url = ext["url"]
                
                # Check if job exists in existing data or was already seen in this fetch
                if job_url in existing_urls_str or job_url in seen_urls_in_fetch:
                    page_dup += 1
                    continue
                
                seen_urls_in_fetch.add(job_url)
                all_new_jobs.append(ext)
                page_new += 1
            
            total_new += page_new
            total_duplicates += page_dup
            
            print(f"  Page {page_num}/{total_pages}: {len(api_jobs)} jobs, {page_new} new, {page_dup} existing")
            
        except Exception as e:
            print(f"  Page {page_num}: ERROR - {e}")
    
    print(f"\nTotal new jobs found: {total_new}")
    print(f"Total duplicates skipped: {total_duplicates}")
    
    if total_new == 0:
        print("No new jobs to add. Data is up to date.")
        return
    
    # Rebuild the full job list: parse existing JS + new jobs
    # We need to extract existing jobs from the JS content
    print("\nParsing existing jobs from JS file...")
    
    # Extract job data from existing content using regex
    existing_jobs = []
    pattern = re.compile(
        r"title:\s*'([^']*)',\s*"
        r"company:\s*'([^']*)',\s*"
        r"location:\s*'([^']*)',\s*"
        r"salary:\s*'([^']*)',\s*"
        r"experience:\s*'([^']*)',\s*"
        r"job_type:\s*'([^']*)',\s*"
        r"mode:\s*'([^']*)',\s*"
        r"posted:\s*'([^']*)',\s*"
        r"skills:\s*(\[[^\]]*\]),\s*"
        r"desc:\s*'([^']*)',\s*"
        r"url:\s*'([^']*)'",
        re.DOTALL
    )
    
    for match in re.finditer(r"\{[^}]+\}", existing_content):
        block = match.group(0)
        # Extract fields individually
        def get_field(name):
            m = re.search(rf"{name}:\s*'([^']*)'", block)
            return m.group(1) if m else ""
        
        def get_skills():
            m = re.search(r"skills:\s*(\[[^\]]*\])", block)
            if m:
                try:
                    return json.loads(m.group(1))
                except:
                    return []
            return []
        
        title = get_field("title")
        if not title:
            continue
        
        existing_jobs.append({
            "title": title,
            "company": get_field("company"),
            "location": get_field("location"),
            "salary": get_field("salary"),
            "experience": get_field("experience"),
            "job_type": get_field("job_type"),
            "mode": get_field("mode"),
            "posted": get_field("posted"),
            "skills": get_skills(),
            "desc": get_field("desc"),
            "url": get_field("url"),
        })
    
    print(f"Parsed {len(existing_jobs)} existing jobs from JS file.")
    
    # Combine existing + new
    all_jobs = existing_jobs + all_new_jobs
    print(f"Total jobs to write: {len(all_jobs)}")
    
    # Generate JS module
    js_content = generate_js_module(all_jobs)
    
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(js_content)
    
    size_kb = os.path.getsize(OUTPUT_PATH) / 1024
    print(f"\nSaved to {OUTPUT_PATH} ({size_kb:.0f} KB)")
    print(f"Total: {len(all_jobs)} jobs")
    print(f"Newly added: {total_new} jobs")


if __name__ == "__main__":
    main()
