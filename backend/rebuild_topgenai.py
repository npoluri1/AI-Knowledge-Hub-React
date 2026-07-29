"""
REBUILD topgenai_jobs.js from scratch using the TopGenAIJobs API.
No file parsing — fetches all 35 pages fresh from the API.
"""

import urllib.request
import json
import os
import sys
import datetime

API_BASE = "https://www.topgenaijobs.com/api/jobs?"
OUTPUT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "frontend", "src", "data", "topgenai_jobs.js"
)

def js_escape(s):
    """Escape a string for JS single-quoted string. Uses \\u0027 for quotes."""
    if s is None:
        return ""
    s = str(s)
    s = s.replace("\\", "\\\\")         # backslash first
    s = s.replace("'", "\\u0027")       # unambiguous unicode escape
    s = s.replace("`", "\\`")
    s = s.replace("${", "\\${")
    s = s.replace("\n", "\\n")
    s = s.replace("\r", "\\r")
    return s


def fetch_page(page_num, limit=50):
    url = f"{API_BASE}page={page_num}&limit={limit}&view=card"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                 "Accept": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def extract_job(api_job):
    title = api_job.get("job_title", api_job.get("title", ""))
    company = api_job.get("company", "")

    s_min = api_job.get("salary_min")
    s_max = api_job.get("salary_max")
    salary = ""
    if s_min is not None and s_max is not None:
        currency = api_job.get("salary_currency", "$")
        period = api_job.get("salary_period", "yr")[:3]
        salary = f"{currency}{s_min:.0f}K–{s_max:.0f}K/{period}"

    skills = api_job.get("skills", [])
    if isinstance(skills, str):
        skills = [s.strip() for s in skills.split(",") if s.strip()]

    desc = (api_job.get("source_raw_description") or
            api_job.get("responsibility") or
            api_job.get("job_title", ""))[:300]

    slug = api_job.get("slug", "")
    url = f"https://www.topgenaijobs.com/jobs/{slug}" if slug else ""

    # Compute posted from created_at
    posted_raw = api_job.get("created_at", "")
    posted = ""
    if posted_raw:
        try:
            created = datetime.datetime.fromisoformat(
                posted_raw.replace("Z", "+00:00")
            )
            now = datetime.datetime.now(datetime.timezone.utc)
            days_ago = (now - created).days
            if days_ago < 0:
                posted = "Posted Today"
            elif days_ago == 0:
                posted = "Posted Today"
            elif days_ago == 1:
                posted = "Posted 1 day ago"
            else:
                posted = f"Posted {days_ago} days ago"
        except Exception:
            posted = f"Posted {posted_raw[:10]}"

    return {
        "title": title, "company": company, "location": api_job.get("location", ""),
        "salary": salary, "experience": str(api_job.get("experience", "")),
        "job_type": api_job.get("job_type", ""), "mode": api_job.get("work_mode", ""),
        "skills": skills, "desc": desc, "url": url,
    }


def generate_js(all_jobs):
    all_techs = sorted(set(
        t for j in all_jobs for t in j.get("skills", []) if t
    ))
    lines = []
    lines.append("// GenAI & Agentic AI Jobs - All from TopGenAIJobs")
    lines.append("")
    lines.append("export const TOPGENAI_JOBS = [")

    for j in all_jobs:
        lines.append("  {")
        for field in ["title", "company", "location", "salary",
                       "experience", "job_type", "mode", "posted"]:
            val = js_escape(j.get(field, ""))
            lines.append(f"    {field}: '{val}',")
        lines.append(f"    skills: {json.dumps(j.get('skills', []))},")
        lines.append(f"    desc: '{js_escape(j.get('desc', ''))}',")
        lines.append(f"    url: '{js_escape(j.get('url', ''))}'")
        lines.append("  },")

    lines.append("]")
    lines.append("")
    lines.append(f"export const TOPGENAI_TECHS = {json.dumps(sorted(all_techs))}")
    lines.append("")
    lines.append("export const TOPGENAI_LOCATIONS = [...new Set(TOPGENAI_JOBS.map(j => j.location))].sort()")
    lines.append("")
    return "\n".join(lines)


def main():
    print("=" * 60)
    print("REBUILD: TopGenAIJobs from API (fresh)")
    print("=" * 60)

    all_jobs = []
    seen_urls = set()

    for page_num in range(1, 36):
        try:
            data = fetch_page(page_num)
            api_jobs = data.get("jobs", [])
            page_new = 0
            for api_job in api_jobs:
                ext = extract_job(api_job)
                if ext["url"] and ext["url"] not in seen_urls:
                    seen_urls.add(ext["url"])
                    all_jobs.append(ext)
                    page_new += 1
            print(f"  Page {page_num}/35: {len(api_jobs)} jobs, {page_new} new, total={len(all_jobs)}")
        except Exception as e:
            print(f"  Page {page_num}: ERROR - {e}")

    print(f"\nTotal unique jobs fetched: {len(all_jobs)}")

    # Write
    js = generate_js(all_jobs)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(js)

    size_kb = os.path.getsize(OUTPUT_PATH) / 1024
    print(f"Written to {OUTPUT_PATH} ({size_kb:.0f} KB)")


if __name__ == "__main__":
    main()
