#!/usr/bin/env python3
"""ETL Tools & Data Engineering Complete Global Guide 2026 - HTML Generator & Inserter"""
import re
from html import escape

TARGET_FILE = r"C:\Users\Legion\Desktop\AI_Engineer_Jobs_Global.html"
INSERT_MARKER = "<!-- ===================== KNOWLEDGE HUB JOBS (2385 TOTAL) ===================== -->"

CSS = """
<style>
.etl-global-guide { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #e0e0e0; }
.etl-global-guide * { box-sizing: border-box; }
.etl-global-guide .section { background: rgba(0,255,136,0.05); border: 1px solid rgba(0,255,136,0.15); border-radius: 12px; padding: 25px; margin-bottom: 24px; }
.etl-global-guide h2 { color: #00ff88; font-size: 1.4em; margin-bottom: 16px; border-bottom: 2px solid rgba(0,255,136,0.3); padding-bottom: 8px; }
.etl-global-guide h3 { color: #00d4ff; font-size: 1.15em; margin: 16px 0 10px; }
.etl-global-guide h4 { color: #ff9900; font-size: 1.0em; margin: 12px 0 8px; }
.etl-global-guide p, .etl-global-guide li { font-size: 0.88em; line-height: 1.6; }
.etl-global-guide .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap: 14px; margin: 16px 0; }
.etl-global-guide .stat-card { background: rgba(0,0,0,0.35); border-radius: 10px; padding: 16px; text-align: center; border: 1px solid rgba(255,255,255,0.08); }
.etl-global-guide .stat-card .num { font-size: 1.6em; font-weight: bold; color: #00ff88; }
.etl-global-guide .stat-card .label { font-size: 0.78em; color: #aaa; margin-top: 4px; }
.etl-global-guide .stat-card.blue .num { color: #00d4ff; }
.etl-global-guide .stat-card.orange .num { color: #ff9900; }
.etl-global-guide .stat-card.purple .num { color: #7b2ff7; }
.etl-global-guide .stat-card.yellow .num { color: #ffcc00; }
.etl-global-guide table { width: 100%; border-collapse: collapse; margin: 12px 0; background: #111128; border-radius: 8px; overflow: hidden; }
.etl-global-guide th { padding: 10px 8px; text-align: left; font-size: 0.8em; text-transform: uppercase; letter-spacing: 0.5px; color: #fff; background: rgba(0,255,136,0.12); border-bottom: 2px solid rgba(0,255,136,0.3); }
.etl-global-guide td { padding: 9px 8px; font-size: 0.82em; border-bottom: 1px solid rgba(255,255,255,0.06); }
.etl-global-guide tr:nth-child(even) { background: rgba(255,255,255,0.02); }
.etl-global-guide tr:hover { background: rgba(255,255,255,0.05); }
.etl-global-guide .best { color: #00ff88; font-weight: bold; }
.etl-global-guide .high { color: #00d4ff; font-weight: bold; }
.etl-global-guide .growing { color: #ff9900; font-weight: bold; }
.etl-global-guide .declining { color: #ff4444; font-weight: bold; }
.etl-global-guide .purple { color: #7b2ff7; font-weight: bold; }
.etl-global-guide .yellow { color: #ffcc00; font-weight: bold; }
.etl-global-guide .tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.82em; margin: 2px; }
.etl-global-guide .tag-green { background: rgba(0,255,136,0.15); color: #00ff88; }
.etl-global-guide .tag-blue { background: rgba(0,212,255,0.15); color: #00d4ff; }
.etl-global-guide .tag-orange { background: rgba(255,153,0,0.15); color: #ff9900; }
.etl-global-guide .tag-red { background: rgba(255,68,68,0.15); color: #ff4444; }
.etl-global-guide .tag-purple { background: rgba(123,47,247,0.15); color: #b07bff; }
.etl-global-guide .verdict-box { background: linear-gradient(135deg, rgba(0,255,136,0.08), rgba(0,212,255,0.08)); border: 1px solid rgba(0,255,136,0.25); border-radius: 10px; padding: 20px; margin-top: 16px; }
.etl-global-guide .verdict-box ol { padding-left: 20px; }
.etl-global-guide .verdict-box li { margin: 8px 0; }
.etl-global-guide .rec-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px,1fr)); gap: 12px; margin: 12px 0; }
.etl-global-guide .rec-card { background: rgba(0,0,0,0.3); border-radius: 8px; padding: 14px; border-left: 3px solid #00ff88; }
.etl-global-guide .rec-card h5 { color: #00d4ff; margin-bottom: 6px; font-size: 0.92em; }
.etl-global-guide .rec-card p { margin: 0; font-size: 0.82em; }
.etl-global-guide .overflow-wrap { overflow-x: auto; }
.etl-global-guide .phase-card { background: rgba(0,0,0,0.3); border-radius: 10px; padding: 16px; margin: 10px 0; border-left: 4px solid #00d4ff; }
.etl-global-guide .phase-card.p1 { border-left-color: #00ff88; }
.etl-global-guide .phase-card.p2 { border-left-color: #00d4ff; }
.etl-global-guide .phase-card.p3 { border-left-color: #ff9900; }
.etl-global-guide .phase-card.p4 { border-left-color: #7b2ff7; }
.etl-global-guide .phase-card h4 { margin-top: 0; }
.etl-global-guide .arch-diagram { background: rgba(0,0,0,0.4); border: 1px dashed rgba(0,212,255,0.3); border-radius: 10px; padding: 20px; margin: 16px 0; font-family: monospace; font-size: 0.82em; line-height: 1.8; white-space: pre; overflow-x: auto; color: #aaa; text-align: center; }
.etl-global-guide .market-bar { display: flex; align-items: center; gap: 10px; margin: 6px 0; }
.etl-global-guide .market-bar .bar-bg { flex: 1; height: 22px; background: rgba(255,255,255,0.06); border-radius: 6px; overflow: hidden; }
.etl-global-guide .market-bar .bar-fill { height: 100%; border-radius: 6px; display: flex; align-items: center; padding-left: 8px; font-size: 0.75em; font-weight: bold; color: #fff; }
.etl-global-guide .market-bar .bar-label { width: 140px; font-size: 0.82em; text-align: right; }
</style>
"""


def build_market_overview():
    return f"""
<div class="section" id="etl-section1">
<h2>Section 1: ETL Tool Categories & Market Overview</h2>
<p>The global ETL and data integration market is experiencing explosive growth driven by cloud adoption, AI/ML pipelines, and real-time analytics demands.</p>

<h3>Market Size & Growth</h3>
<div class="stats-grid">
  <div class="stat-card"><div class="num">$7.63B</div><div class="label">ETL Tools Market 2026</div></div>
  <div class="stat-card blue"><div class="num">$29.04B</div><div class="label">Projected 2029 (30% CAGR)</div></div>
  <div class="stat-card orange"><div class="num">$48.33B</div><div class="label">Data Pipeline Market 2030 (26% CAGR)</div></div>
  <div class="stat-card purple"><div class="num">$10.5B</div><div class="label">Cloud ETL Market 2033 (16.4% CAGR)</div></div>
</div>

<h3>Market Dominance & Trends</h3>
<div class="market-bar">
  <div class="bar-label">North America</div>
  <div class="bar-bg"><div class="bar-fill" style="width:82%;background:linear-gradient(90deg,#00ff88,#00d4ff);">41% market share</div></div>
</div>
<div class="market-bar">
  <div class="bar-label">Asia-Pacific</div>
  <div class="bar-bg"><div class="bar-fill" style="width:58%;background:linear-gradient(90deg,#ff9900,#ffcc00);">29% share (FASTEST 17.1% CAGR)</div></div>
</div>
<div class="market-bar">
  <div class="bar-label">Cloud Deployment</div>
  <div class="bar-bg"><div class="bar-fill" style="width:67%;background:linear-gradient(90deg,#7b2ff7,#b07bff);">66.8% of deployments</div></div>
</div>
<div style="margin-top:12px;">
  <span class="tag tag-green">59% of orgs identify AI/ML integration as key ETL priority</span>
  <span class="tag tag-blue">60%+ companies adopting real-time streaming ETL</span>
</div>
</div>"""


def build_tool_tables():
    cat_a = """
<h3>Category A: Modern ELT/ETL Platforms</h3>
<div class="overflow-wrap"><table>
<tr><th>Tool</th><th>Type</th><th>Company</th><th>Cost</th><th>Difficulty</th><th>Salary Impact</th></tr>
<tr><td class="best">Databricks</td><td>Lakehouse</td><td>Databricks</td><td>Usage-based (DBU)</td><td>HIGH</td><td class="best">VERY HIGH: +10-15%</td></tr>
<tr><td class="high">Snowflake</td><td>Warehouse</td><td>Snowflake</td><td>Credit-based</td><td>MEDIUM</td><td class="high">HIGH: +5-10%</td></tr>
<tr><td class="high">dbt</td><td>Transform</td><td>dbt Labs</td><td>Free (Core) / $100+/mo</td><td>MEDIUM</td><td class="high">HIGH: +8-12%</td></tr>
<tr><td class="high">Fivetran</td><td>ELT Ingest</td><td>Fivetran</td><td>Free 500K MAR / $1-1.50/credit</td><td>LOW</td><td class="high">HIGH: +5-10%</td></tr>
<tr><td class="growing">Airbyte</td><td>ELT Ingest</td><td>Airbyte</td><td>Free (OSS) / $1-2/credit</td><td>LOW-MED</td><td class="growing">GROWING: +5-8%</td></tr>
</table></div>"""

    cat_b = """
<h3>Category B: Cloud-Native ETL</h3>
<div class="overflow-wrap"><table>
<tr><th>Tool</th><th>Cloud</th><th>Type</th><th>Cost</th><th>Difficulty</th><th>Salary Impact</th></tr>
<tr><td class="high">AWS Glue</td><td>AWS</td><td>Serverless ETL</td><td>Pay per DPU-hour</td><td>MEDIUM</td><td class="high">HIGH: +5-8%</td></tr>
<tr><td class="high">Azure Data Factory</td><td>Azure</td><td>ETL/ELT</td><td>Consumption-based</td><td>MEDIUM</td><td class="high">HIGH: +5-8%</td></tr>
<tr><td class="high">Google Cloud Dataflow</td><td>GCP</td><td>Stream/Batch</td><td>Pay per element</td><td>MEDIUM</td><td class="high">HIGH: +5-8%</td></tr>
<tr><td class="high">Azure Synapse</td><td>Azure</td><td>Analytics</td><td>Consumption-based</td><td>HIGH</td><td class="high">HIGH: +5-10%</td></tr>
<tr><td class="high">AWS Redshift</td><td>AWS</td><td>Warehouse</td><td>Per-node/hour</td><td>MEDIUM</td><td class="high">HIGH: +5-8%</td></tr>
<tr><td class="high">Google BigQuery</td><td>GCP</td><td>Warehouse</td><td>Per-TB scanned</td><td>LOW-MED</td><td class="high">HIGH: +5-8%</td></tr>
<tr><td class="best">Databricks (Lakeflow)</td><td>Multi</td><td>Lakehouse</td><td>Usage-based (DBU)</td><td>HIGH</td><td class="best">VERY HIGH: +10-15%</td></tr>
</table></div>"""

    cat_c = """
<h3>Category C: Enterprise ETL (Legacy)</h3>
<div class="overflow-wrap"><table>
<tr><th>Tool</th><th>Company</th><th>Type</th><th>Cost</th><th>Jobs Trend</th><th>Salary USD</th></tr>
<tr><td class="declining">Informatica</td><td>Informatica</td><td>Enterprise ETL</td><td>$131K+/yr</td><td class="declining">DECLINING</td><td>$88K-$133K</td></tr>
<tr><td class="declining">IBM DataStage</td><td>IBM</td><td>Enterprise ETL</td><td>$50K-$200K/license</td><td class="declining">DECLINING</td><td>$89K-$133K</td></tr>
<tr><td class="declining">Talend (Qlik)</td><td>Qlik</td><td>Open+Enterprise</td><td>Free (Community)</td><td class="declining">DECLINING</td><td>$98K-$132K</td></tr>
<tr><td class="declining">SSIS</td><td>Microsoft</td><td>On-prem ETL</td><td>Free with SQL Server</td><td class="declining">DECLINING</td><td>$72K-$95K</td></tr>
<tr><td class="declining">Pentaho</td><td>Hitachi</td><td>Open+Enterprise</td><td>Free (CE)</td><td class="declining">DECLINING</td><td>$80K-$110K</td></tr>
<tr><td>Oracle Data Integrator</td><td>Oracle</td><td>Enterprise ETL</td><td>License-based</td><td>STABLE</td><td>$95K-$130K</td></tr>
<tr><td>SAP Data Services</td><td>SAP</td><td>Enterprise ETL</td><td>License-based</td><td>STABLE</td><td>$90K-$125K</td></tr>
<tr><td>Ab Initio</td><td>Ab Initio</td><td>Enterprise ETL</td><td>Very expensive</td><td>NICHE</td><td>$90K-$140K</td></tr>
</table></div>"""

    cat_d = """
<h3>Category D: Orchestration</h3>
<div class="overflow-wrap"><table>
<tr><th>Tool</th><th>Type</th><th>Cost</th><th>Difficulty</th><th>Demand</th></tr>
<tr><td class="best">Dagster</td><td>Orchestration</td><td>Free (OSS)</td><td>HIGH</td><td class="growing">FAST GROWING</td></tr>
<tr><td class="high">Apache Airflow</td><td>Orchestration</td><td>Free (OSS)</td><td>HIGH</td><td class="best">VERY HIGH</td></tr>
<tr><td class="growing">Prefect</td><td>Orchestration</td><td>Free / $50+/mo</td><td>HIGH</td><td class="growing">GROWING</td></tr>
<tr><td class="growing">Mage</td><td>Orchestration</td><td>Free (OSS)</td><td>MEDIUM</td><td class="growing">EMERGING</td></tr>
<tr><td>Apache NiFi</td><td>Data Flow</td><td>Free (OSS)</td><td>HIGH</td><td>STABLE</td></tr>
<tr><td class="declining">Luigi</td><td>Orchestration</td><td>Free (OSS)</td><td>HIGH</td><td class="declining">DECLINING</td></tr>
<tr><td>Celery</td><td>Task Queue</td><td>Free (OSS)</td><td>MEDIUM</td><td>STABLE</td></tr>
</table></div>"""

    cat_e = """
<h3>Category E: Real-Time / Streaming</h3>
<div class="overflow-wrap"><table>
<tr><th>Tool</th><th>Type</th><th>Cost</th><th>Difficulty</th><th>Salary USD</th></tr>
<tr><td class="best">Apache Kafka</td><td>Streaming</td><td>Free (OSS)</td><td>VERY HIGH</td><td class="best">VERY HIGH: $120K-$180K</td></tr>
<tr><td class="best">Apache Flink</td><td>Stream Process</td><td>Free (OSS)</td><td>VERY HIGH</td><td class="best">VERY HIGH: $125K-$185K</td></tr>
<tr><td class="high">Apache Spark</td><td>Batch+Stream</td><td>Free (OSS)</td><td>HIGH</td><td class="high">HIGH: $115K-$175K</td></tr>
<tr><td class="high">Kafka Confluent</td><td>Streaming</td><td>Free tier / Usage</td><td>HIGH</td><td class="high">HIGH: $120K-$180K</td></tr>
<tr><td class="high">Amazon Kinesis</td><td>Streaming</td><td>Pay per shard</td><td>MEDIUM</td><td class="high">HIGH: $110K-$165K</td></tr>
<tr><td class="high">Azure Event Hubs</td><td>Streaming</td><td>Consumption-based</td><td>MEDIUM</td><td class="high">HIGH: $105K-$160K</td></tr>
<tr><td class="high">Google Pub/Sub</td><td>Streaming</td><td>Per message</td><td>MEDIUM</td><td class="high">HIGH: $110K-$165K</td></tr>
</table></div>"""

    cat_f = """
<h3>Category F: Data Quality & Governance</h3>
<div class="overflow-wrap"><table>
<tr><th>Tool</th><th>Type</th><th>Cost</th><th>Difficulty</th><th>Salary Impact</th></tr>
<tr><td class="best">Monte Carlo</td><td>Data Observability</td><td>Enterprise pricing</td><td>LOW</td><td class="best">VERY HIGH: +8-12%</td></tr>
<tr><td class="high">Great Expectations</td><td>Data Quality</td><td>Free (OSS)</td><td>MEDIUM</td><td class="high">HIGH: +5-8%</td></tr>
<tr><td class="growing">dbt Tests</td><td>Data Quality</td><td>Free (with dbt)</td><td>LOW</td><td class="growing">GROWING: +3-5%</td></tr>
<tr><td class="growing">Atlan</td><td>Data Catalog</td><td>Enterprise pricing</td><td>LOW</td><td class="growing">GROWING: +5-8%</td></tr>
<tr><td class="growing">Alation</td><td>Data Catalog</td><td>Enterprise pricing</td><td>LOW</td><td class="growing">GROWING: +5-8%</td></tr>
<tr><td>Apache Atlas</td><td>Metadata</td><td>Free (OSS)</td><td>HIGH</td><td>STABLE: +3-5%</td></tr>
<tr><td class="growing">OpenLineage</td><td>Lineage</td><td>Free (OSS)</td><td>MEDIUM</td><td class="growing">GROWING: +3-5%</td></tr>
</table></div>"""

    return f"""
<div class="section" id="etl-section2">
<h2>Section 2: Tool-by-Tool Breakdown</h2>
{cat_a}{cat_b}{cat_c}{cat_d}{cat_e}{cat_f}
</div>"""


def build_salary_table():
    def region_table(title, rows):
        header = "<tr><th>Country / City</th><th>Junior</th><th>Mid-Level</th><th>Senior</th><th>Principal / Lead</th></tr>"
        body = ""
        for r in rows:
            body += f"<tr><td>{r[0]}</td><td>{r[1]}</td><td class='high'>{r[2]}</td><td class='best'>{r[3]}</td><td class='yellow'>{r[4]}</td></tr>"
        return f"<h3>{title}</h3><div class='overflow-wrap'><table>{header}{body}</table></div>"

    na = region_table("North America", [
        ("USA (SF/NYC)", "$85K-$110K", "$115K-$155K", "$145K-$200K+", "$190K-$300K+"),
        ("USA (Remote)", "$80K-$105K", "$110K-$145K", "$140K-$185K", "$180K-$260K"),
        ("Canada (Toronto)", "CAD $70K-90K", "CAD $100K-130K", "CAD $130K-175K", "CAD $175K-240K"),
        ("Canada (Vancouver)", "CAD $65K-85K", "CAD $90K-115K", "CAD $115K-150K", "CAD $150K-200K"),
    ])
    eu = region_table("Europe", [
        ("UK (London)", "GBP 35K-50K", "GBP 55K-75K", "GBP 75K-110K", "GBP 100K-150K+"),
        ("Germany", "EUR 48K-56K", "EUR 62K-75K", "EUR 78K-105K", "EUR 95K-140K"),
        ("France (Paris)", "EUR 38K-48K", "EUR 50K-65K", "EUR 65K-90K", "EUR 85K-120K"),
        ("Netherlands", "EUR 40K-50K", "EUR 55K-70K", "EUR 70K-95K", "EUR 90K-125K"),
        ("Switzerland", "CHF 90K-110K", "CHF 110K-135K", "CHF 130K-165K", "CHF 155K-200K+"),
        ("Ireland", "EUR 50K-65K", "EUR 70K-95K", "EUR 95K-135K", "EUR 120K-175K+"),
        ("Spain", "EUR 30K-38K", "EUR 40K-52K", "EUR 52K-70K", "EUR 65K-90K"),
        ("Poland", "PLN 20K-28K", "PLN 30K-42K", "PLN 42K-60K", "PLN 55K-78K"),
    ])
    ap = region_table("Asia-Pacific", [
        ("Singapore", "SGD 60K-84K", "SGD 96K-144K", "SGD 144K-216K", "SGD 216K-336K+"),
        ("Australia (Sydney)", "AUD 80K-100K", "AUD 110K-145K", "AUD 150K-200K", "AUD 200K-280K+"),
        ("Japan (Tokyo)", "$27K-$40K", "$47K-$80K", "$80K-$133K", "$120K-$233K"),
        ("South Korea", "$26K-$37K", "$41K-$60K", "$60K-$98K", "$82K-$135K"),
        ("India", "$6K-$12K", "$14K-$30K", "$30K-$60K", "$48K-$90K"),
        ("Malaysia", "$22K-$32K", "$38K-$65K", "$65K-$97K", "$81K-$135K"),
        ("New Zealand", "$43K-$55K", "$58K-$77K", "$77K-$101K", "$98K-$129K"),
    ])
    me = region_table("Middle East", [
        ("UAE (Dubai)", "$49K-$72K", "$82K-$131K", "$131K-$196K", "$180K-$261K"),
        ("Qatar", "$59K-$82K", "$99K-$148K", "$148K-$213K", "$197K-$279K"),
    ])
    la = region_table("Latin America", [
        ("Brazil", "$19K-$29K", "$36K-$60K", "$60K-$96K", "$84K-$132K"),
    ])

    return f"""
<div class="section" id="etl-section3">
<h2>Section 3: Global Salary Comparison by Country</h2>
{na}{eu}{ap}{me}{la}
</div>"""


def build_best_tools():
    tools = [
        ("1", "Databricks + Spark", "#1 hot platform, pre-IPO", "VERY HIGH", "VERY HIGH"),
        ("2", "Snowflake", "Massive install base, SnowPro", "HIGH", "VERY HIGH"),
        ("3", "Apache Airflow", "#1 orchestration, 743 jobs/90days", "HIGH", "VERY HIGH"),
        ("4", "dbt", "SQL transform standard", "HIGH", "HIGH"),
        ("5", "Fivetran", "750+ connectors, managed ELT", "HIGH", "HIGH"),
        ("6", "Kafka + Flink", "Streaming = highest pay", "VERY HIGH", "HIGH"),
        ("7", "AWS Glue + Redshift", "AWS ecosystem dominant", "HIGH", "HIGH"),
        ("8", "Azure Data Factory", "Microsoft ecosystem", "HIGH", "HIGH"),
        ("9", "Google Dataflow", "GCP streaming best-in-class", "HIGH", "HIGH"),
        ("10", "Airbyte", "Open-source Fivetran alternative", "GROWING", "GROWING"),
        ("11", "Dagster", "Modern orchestrator, growing fast", "GROWING", "FAST GROWING"),
        ("12", "Informatica IDMC", "Legacy but huge enterprise base", "STABLE", "DECLINING"),
        ("13", "Talend (Qlik)", "Open-source option available", "STABLE", "DECLINING"),
        ("14", "IBM DataStage", "Legacy enterprise only", "STABLE", "DECLINING"),
        ("15", "SSIS", "Lowest pay, on-prem only", "DECLINING", "DECLINING"),
    ]

    def demand_cls(v):
        if v in ("VERY HIGH",): return "best"
        if v in ("HIGH",): return "high"
        if "GROWING" in v or "EMERGING" in v or "FAST" in v: return "growing"
        if "DECLINING" in v: return "declining"
        return ""

    rows = ""
    for rank, name, note, salary, demand in tools:
        sc = demand_cls(salary)
        dc = demand_cls(demand)
        rows += f"<tr><td class='best'>#{rank}</td><td class='best'>{name}</td><td>{note}</td><td class='{sc}'>{salary}</td><td class='{dc}'>{demand}</td></tr>"

    combos = [
        ("1", "Databricks + dbt + Airflow + Python", "VERY HIGH: $140K-$200K+"),
        ("2", "Snowflake + dbt + Fivetran + Python", "HIGH: $130K-$185K+"),
        ("3", "Kafka + Flink + Spark + Python", "VERY HIGH: $150K-$200K+"),
        ("4", "AWS Glue + Redshift + Airflow + dbt", "HIGH: $130K-$180K+"),
        ("5", "Azure Data Factory + Synapse + dbt", "HIGH: $125K-$175K+"),
    ]
    combo_rows = ""
    for r, c, s in combos:
        combo_rows += f"<tr><td class='best'>#{r}</td><td>{c}</td><td class='best'>{s}</td></tr>"

    return f"""
<div class="section" id="etl-section4">
<h2>Section 4: Best Tools to Learn (Ranked 1-15)</h2>
<div class="overflow-wrap"><table>
<tr><th>Rank</th><th>Tool</th><th>Why</th><th>Salary Impact</th><th>Job Demand</th></tr>
{rows}
</table></div>

<h3>Top 5 Tool Combinations for Maximum Salary</h3>
<div class="overflow-wrap"><table>
<tr><th>Rank</th><th>Combination</th><th>Expected Salary Range</th></tr>
{combo_rows}
</table></div>
</div>"""


def build_ai_tools():
    ai_powered = """
<h3>5.1 AI-Powered ETL Tools</h3>
<div class="overflow-wrap"><table>
<tr><th>Tool</th><th>AI Features</th><th>What It Does</th></tr>
<tr><td class="best">Databricks</td><td>AI/BI Dashboards, Mosaic AI</td><td>Auto-generate insights, AI ETL</td></tr>
<tr><td class="high">Snowflake</td><td>Cortex AI, Snowpark ML</td><td>In-warehouse ML, AI functions</td></tr>
<tr><td>Informatica</td><td>CLAIRE AI Engine</td><td>Auto data mapping, quality</td></tr>
<tr><td class="high">Fivetran</td><td>AI-powered schema detection</td><td>Auto schema migration</td></tr>
<tr><td class="high">dbt</td><td>Semantic Layer + AI</td><td>AI-powered transformations</td></tr>
<tr><td class="best">Monte Carlo</td><td>AI Data Observability</td><td>Anomaly detection, auto-fix</td></tr>
<tr><td class="growing">Atlan</td><td>AI Data Catalog</td><td>Auto-classification, PII detect</td></tr>
</table></div>"""

    ai_native = """
<h3>5.2 AI-Native Data Tools</h3>
<div class="overflow-wrap"><table>
<tr><th>Tool</th><th>Type</th><th>What It Does</th></tr>
<tr><td class="best">Pinecone / Weaviate / pgvector</td><td>Vector Databases</td><td>Store embeddings for RAG pipelines</td></tr>
<tr><td class="high">Apache Spark + MLflow</td><td>ML Pipeline Management</td><td>Distributed ML training on data</td></tr>
<tr><td class="high">Ray</td><td>Distributed AI</td><td>Scalable AI/ML compute</td></tr>
<tr><td class="growing">vLLM</td><td>LLM Inference</td><td>Optimized LLM serving on data</td></tr>
<tr><td class="high">Feast</td><td>Feature Store</td><td>ML feature management</td></tr>
<tr><td class="growing">Tecton</td><td>Feature Platform</td><td>Real-time feature engineering</td></tr>
<tr><td class="best">Databricks (Unity Catalog)</td><td>Lakehouse + Governance</td><td>Unified data + AI platform</td></tr>
</table></div>"""

    arch = """
<h3>5.3 AI-Ready Data Architecture</h3>
<div class="arch-diagram">
&#9484;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9488;
&#9474;                    DATA SOURCES                               &#9474;
&#9474;  [Databases] [APIs] [Files] [Streams] [IoT] [SaaS Apps]       &#9474;
&#9492;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9516;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9496;
                    &#9474;
        &#9484;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9524;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9488;
        &#9474;              INGESTION LAYER                         &#9474;
        &#9474;  [Fivetran] [Airbyte] [Kafka] [AWS Glue] [ADF]      &#9474;
        &#9492;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9524;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9496;
                    &#9474;
        &#9484;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9524;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9488;
        &#9474;            STORAGE &amp; LAKEHOUSE LAYER                  &#9474;
        &#9474;  [Snowflake] [Databricks] [BigQuery] [Redshift]     &#9474;
        &#9492;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9524;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9496;
                    &#9474;
        &#9484;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9524;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9488;
        &#9474;            TRANSFORM &amp; ORCHESTRATION                  &#9474;
        &#9474;     [dbt] [Airflow] [Dagster] [Prefect] [Spark]     &#9474;
        &#9492;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9524;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9496;
                    &#9474;
        &#9484;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9524;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9488;
        &#9474;         AI / ML / VECTOR / LAYER                     &#9474;
        &#9474;  [Pinecone] [MLflow] [Feast] [Ray] [vLLM]          &#9474;
        &#9492;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9532;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9496;
                    &#9474;
        &#9484;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9524;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9488;
        &#9474;          GOVERNANCE &amp; QUALITY                         &#9474;
        &#9474;  [Monte Carlo] [Atlan] [Great Expectations] [dbt]   &#9474;
        &#9492;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9524;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9496;
                    &#9474;
        &#9484;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9524;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9488;
        &#9474;              SERVING &amp; CONSUMPTION                   &#9474;
        &#9474;  [Dashboards] [APIs] [Reverse ETL] [BI Tools]       &#9474;
        &#9492;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9496;</div>"""

    return f"""
<div class="section" id="etl-section5">
<h2>Section 5: AI-Integrated Data Engineering Tools</h2>
{ai_powered}{ai_native}{arch}
</div>"""


def build_learning_path():
    phases = [
        ("p1", "Phase 1: Foundation (0-3 months) | Target: $70K-$100K",
         "SQL, Python, Git, Data Warehousing, Basic ETL",
         "Python, SQL, Git, CSV/Excel, Linux basics",
         "None yet (focus on fundamentals)",
         "Build a basic data pipeline with Python + SQL"),
        ("p2", "Phase 2: Cloud & Modern Tools (3-8 months) | Target: $100K-$140K",
         "Cloud platforms, dbt, modern ELT, orchestration",
         "AWS/GCP/Azure, dbt, Fivetran/Airbyte, Snowflake/BigQuery, Airflow",
         "AWS Cloud Practitioner, dbt Analytics Engineering",
         "Deploy a cloud data pipeline with dbt + Snowflake"),
        ("p3", "Phase 3: Specialization (8-14 months) | Target: $140K-$180K",
         "Deep expertise in one track",
         "Track A: Databricks + Spark | Track B: Kafka + Flink | Track C: AWS/Azure/GCP Deep | Track D: AI-Ready Data Engineer",
         "Databricks Certified, AWS/GCP Specialty, Confluent Kafka",
         "Production streaming pipeline or lakehouse architecture"),
        ("p4", "Phase 4: Leadership & Architecture (14-24 months) | Target: $180K-$280K+",
         "Architecture, leadership, multi-cloud, governance",
         "Data Mesh, Data Governance, Multi-cloud, Team Leadership",
         "Terraform, Kubernetes, Data Governance certifications",
         "Design enterprise data architecture, mentor teams"),
    ]

    cards = ""
    for cls, title, skills, tools_list, certs, projects in phases:
        cards += f"""
<div class="phase-card {cls}">
<h4>{title}</h4>
<p><strong>Skills:</strong> {skills}</p>
<p><strong>Tools:</strong> {tools_list}</p>
<p><strong>Certifications:</strong> {certs}</p>
<p><strong>Projects:</strong> {projects}</p>
</div>"""

    return f"""
<div class="section" id="etl-section6">
<h2>Section 6: Learning Path & Certification Roadmap</h2>
{cards}
</div>"""


def build_job_market():
    roles = [
        ("Data Engineer (Junior)", "$70K-$100K", "Python, SQL, Git, basic ETL"),
        ("Data Engineer (Mid)", "$100K-$140K", "Cloud, dbt, Airflow, Snowflake"),
        ("Senior Data Engineer", "$140K-$185K", "Databricks, Spark, Kafka, Architecture"),
        ("Staff / Principal Data Engineer", "$185K-$280K+", "Multi-cloud, Governance, Leadership"),
        ("Streaming Data Engineer", "$120K-$185K", "Kafka, Flink, Spark Streaming"),
        ("Analytics Engineer", "$100K-$155K", "dbt, Snowflake, SQL, BI tools"),
        ("ML Platform Engineer", "$150K-$220K+", "MLflow, Feast, Kubernetes, Python"),
        ("Data Architect", "$160K-$250K+", "Enterprise architecture, multi-cloud"),
    ]

    role_rows = ""
    for role, sal, skills in roles:
        role_rows += f"<tr><td class='best'>{role}</td><td class='best'>{sal}</td><td>{skills}</td></tr>"

    tools_jobs = [
        ("Apache Airflow", "743", "Orchestration"),
        ("Snowflake", "680+", "Data Warehouse"),
        ("Databricks", "600+", "Lakehouse"),
        ("dbt", "500+", "Transformation"),
        ("Fivetran", "350+", "ELT Ingestion"),
        ("AWS Glue", "320+", "Cloud ETL"),
        ("Kafka", "300+", "Streaming"),
        ("Azure Data Factory", "280+", "Cloud ETL"),
        ("Informatica", "250+", "Legacy ETL"),
        ("BigQuery", "230+", "Data Warehouse"),
    ]

    job_rows = ""
    for t, count, cat in tools_jobs:
        job_rows += f"<tr><td class='best'>{t}</td><td class='high'>{count}</td><td>{cat}</td></tr>"

    return f"""
<div class="section" id="etl-section7">
<h2>Section 7: Job Market by Country &amp; Role</h2>

<h3>7.1 Highest Paying Data Engineering Roles</h3>
<div class="overflow-wrap"><table>
<tr><th>Role</th><th>Salary Range (USD)</th><th>Key Skills</th></tr>
{role_rows}
</table></div>

<h3>7.2 Tools with Most Job Postings (Last 90 Days)</h3>
<div class="overflow-wrap"><table>
<tr><th>Tool</th><th>Job Postings (approx)</th><th>Category</th></tr>
{job_rows}
</table></div>
</div>"""


def build_quick_reference():
    skills = [
        ("Python (production-grade)", "BASELINE", ""),
        ("SQL (advanced)", "BASELINE", ""),
        ("Databricks", "VERY HIGH", "+10-15%"),
        ("Snowflake", "HIGH", "+5-10%"),
        ("Apache Kafka / Flink", "VERY HIGH", "+20-30%"),
        ("Apache Airflow", "HIGH", "+8-12%"),
        ("dbt", "HIGH", "+8-12%"),
        ("Kubernetes + Docker", "HIGH", "+10-15%"),
        ("AWS / GCP / Azure Cert", "HIGH", "+10-15%"),
        ("Terraform", "HIGH", "+8-12%"),
        ("Data Governance / GDPR", "HIGH", "+8-12%"),
        ("AI / ML Pipeline", "VERY HIGH", "+15-25%"),
        ("Multi-cloud", "HIGH", "+10-15%"),
        ("Vector DBs + RAG", "VERY HIGH", "+20-30%"),
    ]

    rows = ""
    for skill, impact, pct in skills:
        cls = "best" if "VERY" in impact else ("high" if "HIGH" in impact else "")
        rows += f"<tr><td>{skill}</td><td class='{cls}'>{impact}</td><td class='{cls}'>{pct}</td></tr>"

    return f"""
<div class="section" id="etl-quickref">
<h2>Quick Reference: Salary Impact by Skill</h2>
<div class="overflow-wrap"><table>
<tr><th>Skill</th><th>Impact Level</th><th>Salary Premium</th></tr>
{rows}
</table></div>
</div>"""


def build_recommendations():
    recs = [
        ("Maximum Salary", "Kafka + Flink + Spark + Databricks", "$150K-$200K+"),
        ("Easiest Entry", "dbt + Fivetran + Snowflake", "$100K-$140K"),
        ("Most Job Options", "Python + SQL + Airflow + dbt", "Available everywhere"),
        ("Future-Proof", "AI Data Pipeline + Vector DBs + LLMs", "$160K-$250K+"),
        ("Singapore Market", "Databricks + Snowflake + Python + dbt", "SGD 96K-$336K+"),
        ("Remote-Friendly", "dbt + Fivetran + Snowflake", "Fully remote roles"),
        ("Enterprise / Banking", "Informatica + Teradata + DataStage (LEGACY)", "BUT migrate to Snowflake/Databricks"),
    ]

    cards = ""
    for title, stack, outcome in recs:
        cards += f"""
<div class="rec-card">
<h5>{title}</h5>
<p><strong>Stack:</strong> {stack}</p>
<p><strong>Outcome:</strong> {outcome}</p>
</div>"""

    return f"""
<div class="section" id="etl-recommendations">
<h2>Recommendations: Career Paths by Goal</h2>
<div class="rec-grid">{cards}</div>

<div class="verdict-box">
<h3 style="color:#00ff88;margin-top:0;">The Verdict</h3>
<ol>
<li><strong>Master Python + SQL</strong> (foundation - non-negotiable)</li>
<li><strong>Learn dbt + Snowflake/Databricks + Airflow</strong> (modern stack)</li>
<li><strong>Add Kafka/Flink for streaming</strong> (VERY HIGH salary jump)</li>
<li><strong>Integrate Vector DBs + LLM pipelines</strong> (AI-ready, FASTEST GROWTH)</li>
</ol>
</div>
</div>"""


def build_full_guide():
    return f"""<div class="etl-global-guide" id="etl-global-guide">
{CSS}
<div class="section" style="background:linear-gradient(135deg,rgba(0,255,136,0.1),rgba(0,212,255,0.1));text-align:center;border:1px solid rgba(0,255,136,0.3);">
<h2 style="border:none;color:#00ff88;font-size:1.6em;">ETL Tools &amp; Data Engineering Complete Global Guide 2026</h2>
<p style="color:#aaa;">Market Analysis | Tool Breakdown | Global Salaries | AI-Integrated Tools | Learning Paths | Job Market</p>
</div>
{build_market_overview()}
{build_tool_tables()}
{build_salary_table()}
{build_best_tools()}
{build_ai_tools()}
{build_learning_path()}
{build_job_market()}
{build_quick_reference()}
{build_recommendations()}
</div>"""


def main():
    html = build_full_guide()

    with open(TARGET_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    marker = INSERT_MARKER
    if marker not in content:
        print(f"ERROR: Marker not found in {TARGET_FILE}")
        return

    new_content = content.replace(marker, html + "\n" + marker)

    with open(TARGET_FILE, "w", encoding="utf-8") as f:
        f.write(new_content)

    line_count = new_content.count("\n") + 1
    print(f"ETL Guide inserted successfully into {TARGET_FILE}")
    print(f"Total lines after insertion: {line_count:,}")


if __name__ == "__main__":
    main()
