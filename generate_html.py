"""Generate HTML table rows for all AI jobs"""
import json
import re

with open('merged_ai_jobs.json', 'r', encoding='utf-8') as f:
    jobs = json.load(f)

# Country configuration
COUNTRIES = {
    'IN': {'name': 'INDIA', 'flag': '🇮🇳', 'color': '#ff9933', 'min_salary': 20000, 'max_salary': 200000},
    'US': {'name': 'USA', 'flag': '🇺🇸', 'color': '#3c3b6e', 'min_salary': 100000, 'max_salary': 800000},
    'UK': {'name': 'UK', 'flag': '🇬🇧', 'color': '#00247d', 'min_salary': 60000, 'max_salary': 400000},
    'CA': {'name': 'CANADA', 'flag': '🇨🇦', 'color': '#ff0000', 'min_salary': 80000, 'max_salary': 400000},
    'SG': {'name': 'SINGAPORE', 'flag': '🇸🇬', 'color': '#ef3340', 'min_salary': 80000, 'max_salary': 400000},
    'DE': {'name': 'GERMANY', 'flag': '🇩🇪', 'color': '#000000', 'min_salary': 60000, 'max_salary': 300000},
    'FR': {'name': 'FRANCE', 'flag': '🇫🇷', 'color': '#002395', 'min_salary': 50000, 'max_salary': 250000},
    'AU': {'name': 'AUSTRALIA', 'flag': '🇦🇺', 'color': '#00008b', 'min_salary': 100000, 'max_salary': 350000},
    'IE': {'name': 'IRELAND', 'flag': '🇮🇪', 'color': '#169b62', 'min_salary': 70000, 'max_salary': 300000},
    'JP': {'name': 'JAPAN', 'flag': '🇯🇵', 'color': '#bc002d', 'min_salary': 5000000, 'max_salary': 30000000},
    'CN': {'name': 'CHINA', 'flag': '🇨🇳', 'color': '#de2910', 'min_salary': 100000, 'max_salary': 800000},
    'IL': {'name': 'ISRAEL', 'flag': '🇮🇱', 'color': '#0038b8', 'min_salary': 100000, 'max_salary': 400000},
    'SE': {'name': 'SWEDEN', 'flag': '🇸🇪', 'color': '#006aa7', 'min_salary': 400000, 'max_salary': 1500000},
    'CH': {'name': 'SWITZERLAND', 'flag': '🇨🇭', 'color': '#d52b1e', 'min_salary': 100000, 'max_salary': 500000},
    'AE': {'name': 'UAE', 'flag': '🇦🇪', 'color': '#00732f', 'min_salary': 150000, 'max_salary': 600000},
    'KR': {'name': 'SOUTH KOREA', 'flag': '🇰🇷', 'color': '#003478', 'min_salary': 30000000, 'max_salary': 150000000},
    'BR': {'name': 'BRAZIL', 'flag': '🇧🇷', 'color': '#009c3b', 'min_salary': 50000, 'max_salary': 300000},
    'VN': {'name': 'VIETNAM', 'flag': '🇻🇳', 'color': '#da251d', 'min_salary': 10000, 'max_salary': 100000},
    'ID': {'name': 'INDONESIA', 'flag': '🇮🇩', 'color': '#ce1126', 'min_salary': 10000, 'max_salary': 80000},
    'MY': {'name': 'MALAYSIA', 'flag': '🇲🇾', 'color': '#010066', 'min_salary': 30000, 'max_salary': 150000},
    'TH': {'name': 'THAILAND', 'flag': '🇹🇭', 'color': '#a51931', 'min_salary': 200000, 'max_salary': 1000000},
    'PH': {'name': 'PHILIPPINES', 'flag': '🇵🇭', 'color': '#0038a8', 'min_salary': 300000, 'max_salary': 2000000},
    'TW': {'name': 'TAIWAN', 'flag': '🇹🇼', 'color': '#fe0000', 'min_salary': 600000, 'max_salary': 3000000},
    'ZA': {'name': 'SOUTH AFRICA', 'flag': '🇿🇦', 'color': '#007a4d', 'min_salary': 300000, 'max_salary': 1500000},
    'NG': {'name': 'NIGERIA', 'flag': '🇳🇬', 'color': '#008751', 'min_salary': 3000000, 'max_salary': 15000000},
    'MX': {'name': 'MEXICO', 'flag': '🇲🇽', 'color': '#006341', 'min_salary': 200000, 'max_salary': 1000000},
}

# Salary conversion to USD (approximate rates)
SALARY_TO_USD = {
    'SGD': 0.75,
    'GBP': 1.27,
    'EUR': 1.08,
    'CAD': 0.74,
    'AUD': 0.65,
    'JPY': 0.0067,
    'CNY': 0.14,
    'INR': 0.012,
    'ILS': 0.28,
    'SEK': 0.095,
    'CHF': 1.13,
    'AED': 0.27,
    'KRW': 0.00074,
    'BRL': 0.20,
    'VND': 0.00004,
    'IDR': 0.000064,
    'MYR': 0.22,
    'THB': 0.028,
    'PHP': 0.018,
    'TWD': 0.031,
    'ZAR': 0.055,
    'NGN': 0.00065,
    'MXN': 0.058,
    'USD': 1.0,
}

def parse_salary_usd(salary_str):
    """Parse salary string and return USD range"""
    if not salary_str or salary_str == 'Negotiable':
        return None, None
    
    salary_str = salary_str.replace(',', '').replace(' ', '').upper()
    
    # Try to extract numbers
    numbers = re.findall(r'[\d.]+', salary_str)
    if not numbers:
        return None, None
    
    nums = [float(n) for n in numbers if n.replace('.', '').isdigit()]
    if not nums:
        return None, None
    
    min_val = min(nums)
    max_val = max(nums)
    
    # Detect currency
    currency = 'USD'
    for curr in SALARY_TO_USD:
        if curr in salary_str:
            currency = curr
            break
    
    # Convert to USD
    rate = SALARY_TO_USD.get(currency, 1.0)
    min_usd = int(min_val * rate)
    max_usd = int(max_val * rate)
    
    # Handle K suffix
    if 'K' in salary_str:
        min_usd = min_usd * 1000
        max_usd = max_usd * 1000
    
    # Handle /yr vs /mo
    if '/MO' in salary_str or '/MONTH' in salary_str:
        min_usd *= 12
        max_usd *= 12
    
    return min_usd, max_usd

def format_salary_SGD(min_usd, max_usd):
    """Format salary as SGD monthly"""
    if min_usd is None:
        return 'Negotiable', 'Negotiable'
    
    # Convert USD to SGD (1 USD = 1.33 SGD)
    SGD_PER_USD = 1.33
    
    min_sgd = int(min_usd * SGD_PER_USD / 12)
    max_sgd = int(max_usd * SGD_PER_USD / 12)
    
    min_annual = int(min_usd * SGD_PER_USD)
    max_annual = int(max_usd * SGD_PER_USD)
    
    monthly = f"${min_sgd/1000:.1f}K-${max_sgd/1000:.1f}K"
    annual = f"${min_annual/1000:.0f}K-${max_annual/1000:.0f}K+"
    
    return monthly, annual

def get_level(title):
    """Extract level from title"""
    title_lower = (title or '').lower()
    if any(x in title_lower for x in ['principal', 'director', 'vp', 'head']):
        return 'principal', 'Principal'
    if any(x in title_lower for x in ['staff', 'distinguished']):
        return 'staff', 'Staff'
    if any(x in title_lower for x in ['lead', 'architect']):
        return 'mid', 'Lead'
    if any(x in title_lower for x in ['sr.', 'sr ', 'senior', 'advanced']):
        return 'senior', 'Senior'
    if any(x in title_lower for x in ['mid', 'ii', '2']):
        return 'mid', 'Mid'
    return 'senior', 'Senior'

def get_tech_tags(techs):
    """Generate tech tags HTML"""
    colors = ['', 'green', 'blue', 'orange', 'red']
    tags = []
    for i, tech in enumerate(techs[:5]):
        color = colors[i % len(colors)]
        css_class = f' tech-tag {color}' if color else ' tech-tag'
        tags.append(f'<span class="{css_class}">{tech}</span>')
    return ''.join(tags)

# Group jobs by country
jobs_by_country = {}
for job in jobs:
    country = job.get('country')
    if country:
        if country not in jobs_by_country:
            jobs_by_country[country] = []
        jobs_by_country[country].append(job)

# Generate HTML
html_lines = []
total_count = 0

for country_code, country_config in COUNTRIES.items():
    country_jobs = jobs_by_country.get(country_code, [])
    if not country_jobs:
        continue
    
    count = len(country_jobs)
    total_count += count
    
    html_lines.append(f'\n<!-- ===================== {country_config["name"]} ({count} JOBS) ===================== -->')
    html_lines.append(f'<div class="country-section">')
    html_lines.append(f'  <div class="country-header" style="background: linear-gradient(90deg, {country_config["color"]}, #333);">{country_config["flag"]} {country_config["name"]} ({country_code}) &mdash; {count}+ OPENINGS</div>')
    html_lines.append(f'  <table>')
    html_lines.append(f'    <tr><th style="width:14%">Company</th><th style="width:16%">Role</th><th style="width:10%">Level</th><th style="width:12%">Monthly SGD</th><th style="width:12%">Annual SGD</th><th style="width:18%">Tech Stack</th><th style="width:18%">Key Requirements</th></tr>')
    
    # Sort by salary (highest first)
    def salary_sort_key(j):
        min_usd, max_usd = parse_salary_usd(j.get('salary', ''))
        return -(max_usd or 0)
    
    country_jobs.sort(key=salary_sort_key)
    
    # Show top 50 per country
    for job in country_jobs[:50]:
        title = job.get('title', '').replace('<', '&lt;').replace('>', '&gt;')
        company = job.get('company', '').replace('<', '&lt;').replace('>', '&gt;')
        techs = job.get('techs', [])
        salary = job.get('salary', '')
        location = job.get('location', '')
        
        # Parse and format salary
        min_usd, max_usd = parse_salary_usd(salary)
        monthly_sgd, annual_sgd = format_salary_SGD(min_usd, max_usd)
        
        # Get level
        level_css, level_text = get_level(title)
        
        # Get tech tags
        tech_tags = get_tech_tags(techs)
        
        # Get key requirements (first 3 techs + level)
        key_reqs = ', '.join(techs[:3]) if techs else 'AI/ML Experience'
        
        html_lines.append(f'    <tr><td class="company">{company}</td><td class="role">{title}</td><td><span class="level-badge level-{level_css}">{level_text}</span></td><td class="salary">{monthly_sgd}</td><td class="salary">{annual_sgd}</td><td>{tech_tags}</td><td>{key_reqs}</td></tr>')
    
    html_lines.append(f'  </table>')
    html_lines.append(f'</div>')

# Add "Remote/Global" section for unknown locations
unknown_jobs = jobs_by_country.get('Unknown', [])
if unknown_jobs:
    html_lines.append(f'\n<!-- ===================== REMOTE/GLOBAL ({len(unknown_jobs)} JOBS) ===================== -->')
    html_lines.append(f'<div class="country-section">')
    html_lines.append(f'  <div class="country-header" style="background: linear-gradient(90deg, #666, #333);">🌍 REMOTE/GLOBAL &mdash; {len(unknown_jobs)}+ OPENINGS</div>')
    html_lines.append(f'  <table>')
    html_lines.append(f'    <tr><th style="width:14%">Company</th><th style="width:16%">Role</th><th style="width:10%">Level</th><th style="width:12%">Monthly SGD</th><th style="width:12%">Annual SGD</th><th style="width:18%">Tech Stack</th><th style="width:18%">Key Requirements</th></tr>')
    
    unknown_jobs.sort(key=lambda j: -(parse_salary_usd(j.get('salary', ''))[1] or 0))
    
    for job in unknown_jobs[:50]:
        title = job.get('title', '').replace('<', '&lt;').replace('>', '&gt;')
        company = job.get('company', '').replace('<', '&lt;').replace('>', '&gt;')
        techs = job.get('techs', [])
        salary = job.get('salary', '')
        
        min_usd, max_usd = parse_salary_usd(salary)
        monthly_sgd, annual_sgd = format_salary_SGD(min_usd, max_usd)
        level_css, level_text = get_level(title)
        tech_tags = get_tech_tags(techs)
        key_reqs = ', '.join(techs[:3]) if techs else 'AI/ML Experience'
        
        html_lines.append(f'    <tr><td class="company">{company}</td><td class="role">{title}</td><td><span class="level-badge level-{level_css}">{level_text}</span></td><td class="salary">{monthly_sgd}</td><td class="salary">{annual_sgd}</td><td>{tech_tags}</td><td>{key_reqs}</td></tr>')
    
    html_lines.append(f'  </table>')
    html_lines.append(f'</div>')

print(f"Generated {total_count} job rows across {len(jobs_by_country)} countries")

# Save to file
with open('generated_table_rows.html', 'w', encoding='utf-8') as f:
    f.write('\n'.join(html_lines))

print(f"Saved to generated_table_rows.html")
