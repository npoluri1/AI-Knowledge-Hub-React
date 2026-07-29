"""Batch integrate enterprise dashboard into all main workspace projects."""
import os, sys, shutil, re

BASE = r"D:\WorkSpace\Claude_Code"
PLUGIN_SRC = os.path.join(BASE, "dashboard_plugin.py")

# (dir_name, display_name, description)
PROJECTS = [
    ("AI_Agent_Marketplace", "AI Agent Marketplace", "Publish, discover, and deploy AI agents with safety guardrails"),
    ("AI_Banking_Payment_Brain", "AI Banking & Payment Brain", "Autonomous financial intelligence for payments and compliance"),
    ("AI_Cybersecurity_Platform", "AI Cybersecurity Platform", "Multi-LLM threat detection and quantum-safe security"),
    ("AI_DevOps_Automation", "AI DevOps Automation", "Intelligent CI/CD and infrastructure optimization"),
    ("AI_Education_Tutor", "AI Education Tutor", "Personalized AI tutoring with adaptive learning"),
    ("AI_Enterprise_Search_Engine", "AI Enterprise Search", "Unified semantic search across enterprise data"),
    ("AI_Financial_Fraud_Detection", "AI Fraud Detection", "Graph neural network fraud detection platform"),
    ("AI_Global_Problem_Solver", "AI Global Problem Solver", "Multi-agent system for solving global challenges"),
    ("AI_Government_Automation_Suite", "AI Government Automation", "Digital government transformation platform"),
    ("AI_Healthcare_Platform", "AI Healthcare Platform", "Clinical decision support and diagnosis platform"),
    ("AI_Incident_Commander", "AI Incident Commander", "Autonomous incident response and recovery"),
    ("AI_Legal_Document_Analyzer", "AI Legal Document Analyzer", "Intelligent contract review and legal analysis"),
    ("AI_Logistics_Supply_Chain", "AI Logistics & Supply Chain", "End-to-end logistics optimization platform"),
    ("AI_Monitoring_Brain", "AI Monitoring Brain", "Distributed observability and monitoring platform"),
    ("AI_Real_Estate_Intelligence", "AI Real Estate Intelligence", "Property valuation and market analytics"),
    ("AI_Robotics_Control_Platform", "AI Robotics Control", "Autonomous robotics control and fleet management"),
    ("AI_Software_Engineer_Agent", "AI Software Engineer", "Autonomous code generation and review platform"),
    ("ViziForge", "ViziForge", "Enterprise AI Development Platform"),
    ("Cloud_Management_Platform", "Cloud Management Platform", "Multi-cloud cost optimization and governance"),
    ("Enterprise_Knowledge_Digital_Twin", "Enterprise Knowledge Twin", "Digital twin for enterprise knowledge"),
    ("AI_Smart_City_Platform", "AI Smart City Platform", "Intelligent city management and optimization"),
    ("Autonomous_Enterprise_AI_OS", "Autonomous Enterprise AI OS", "Autonomous operating system for enterprises"),
]

# Projects with existing frontends (skip or just add enhanced features)
SKIP_FRONTEND = ["AI_Company_in_a_Box", "AI_Customer_Support_Platform", "Trading_Applcation_Web_Mobile", "DashClaw"]

def find_main_py(project_dir):
    """Find the main.py file in a project directory (up to 3 levels deep)."""
    for root, dirs, files in os.walk(project_dir):
        # Skip hidden dirs and node_modules
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ('node_modules', '__pycache__', '.venv')]
        if 'main.py' in files:
            return os.path.join(root, 'main.py')
    return None

def integrate_dashboard(project_name, display_name, description):
    project_dir = os.path.join(BASE, project_name)
    if not os.path.isdir(project_dir):
        print(f"  SKIP: {project_name} - directory not found")
        return False

    if project_name in SKIP_FRONTEND:
        print(f"  SKIP: {project_name} - already has frontend")
        return False

    main_py = find_main_py(project_dir)
    if not main_py:
        print(f"  SKIP: {project_name} - no main.py found")
        return False

    src_dir = os.path.dirname(main_py)
    
    # 1. Copy dashboard plugin
    plugin_dest = os.path.join(src_dir, "dashboard_plugin.py")
    shutil.copy2(PLUGIN_SRC, plugin_dest)
    print(f"  COPY: dashboard_plugin.py -> {plugin_dest}")

    # 2. Read main.py
    with open(main_py, 'r', encoding='utf-8') as f:
        content = f.read()

    # 3. Check if already integrated
    if "dashboard_plugin" in content and "mount_dashboard" in content:
        print(f"  OK: {project_name} - already has dashboard integration")
        return True

    # 4. Add import
    # Find the last import line
    lines = content.split('\n')
    last_import_idx = -1
    for i, line in enumerate(lines):
        if line.startswith('import ') or line.startswith('from '):
            last_import_idx = i
    
    # Insert dashboard import after last import
    import_line = f"from dashboard_plugin import mount_dashboard"
    lines.insert(last_import_idx + 1, import_line)
    last_import_idx += 1

    # 5. Add mount call after CORSMiddleware or app creation
    mount_line = f'mount_dashboard(app, "{display_name}", "{description}")'
    
    cors_idx = -1
    app_create_idx = -1
    for i, line in enumerate(lines):
        if 'CORSMiddleware' in line and 'app.add_middleware' in line:
            cors_idx = i
        if 'app = FastAPI(' in line or re.match(r'^app\s*=\s*FastAPI\(', line):
            app_create_idx = i

    insert_after = max(cors_idx, app_create_idx)
    if insert_after >= 0:
        # Find a good insertion point - after all middleware and router includes
        insert_at = insert_after
        for i in range(insert_after + 1, min(insert_after + 30, len(lines))):
            if lines[i].strip().startswith('app.include_router') or lines[i].strip().startswith('app.add_middleware'):
                insert_at = i
            elif lines[i].strip() == '' and i > insert_at + 1:
                break
        
        # Insert after the last router/middleware
        actual_insert = insert_at + 1
        # Skip blank lines
        while actual_insert < len(lines) and lines[actual_insert].strip() == '':
            actual_insert += 1
        
        lines.insert(actual_insert, mount_line)
        lines.insert(actual_insert, '')
    else:
        # Fallback: add before __main__ guard
        for i, line in enumerate(lines):
            if '__name__' in line and '__main__' in line:
                lines.insert(i, '')
                lines.insert(i, mount_line)
                break

    # 6. Write back
    with open(main_py, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    
    print(f"  INTEGRATED: {project_name} -> {main_py}")
    return True

def main():
    print("=" * 70)
    print("INTEGRATING ENTERPRISE DASHBOARDS INTO ALL PROJECTS")
    print("=" * 70)
    
    success = 0
    skipped = 0
    failed = 0
    
    for proj_name, disp_name, desc in PROJECTS:
        print(f"\n[{proj_name}]")
        try:
            if integrate_dashboard(proj_name, disp_name, desc):
                success += 1
            else:
                skipped += 1
        except Exception as e:
            print(f"  ERROR: {e}")
            failed += 1
    
    print("\n" + "=" * 70)
    print(f"SUMMARY: {success} integrated, {skipped} skipped, {failed} failed")
    print("=" * 70)

if __name__ == "__main__":
    main()
