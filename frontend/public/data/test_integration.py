"""Integration tests for all 13 AI projects."""
import sys
from pathlib import Path

import pytest
import httpx
from httpx import ASGITransport

BASE = Path(r"D:\WorkSpace\Claude_Code")

PROJECTS = {
    "AI_Banking_Payment_Brain": ("src/core", 8000),
    "AI_Agent_Marketplace": ("src/marketplace-core", 8001),
    "AI_Smart_City_Platform": ("src/core", 8002),
    "AI_Cybersecurity_Platform": ("src/core", 8003),
    "Enterprise_Knowledge_Digital_Twin": ("src/core", 8004),
    "AI_Software_Engineer_Agent": ("src/core", 8005),
    "AI_Robotics_Control_Platform": ("src/core", 8006),
    "Quantum_AI_Optimization": ("src/core", 8007),
    "Cloud_Management_Platform": ("src/core", 8008),
    "AI_Monitoring_Brain": ("src/core", 8009),
    "AI_Healthcare_Platform": ("src/core", 8010),
    "AI_Logistics_Supply_Chain": ("src/core", 8011),
    "Universal_Agentic_AI": ("src/core", 8012),
}


_APP_CACHE = {}

def get_app(name):
    if name in _APP_CACHE:
        return _APP_CACHE[name]
    rel_dir, port = PROJECTS[name]
    proj_dir = BASE / name / rel_dir
    sys.path.insert(0, str(proj_dir))
    for mod_name in ('realtime', 'agi'):
        sys.modules.pop(mod_name, None)
    try:
        import importlib.util
        safe_name = name.replace("-", "_").replace(" ", "_")
        main_path = proj_dir / "main.py"
        spec = importlib.util.spec_from_file_location(f"main_{safe_name}", str(main_path))
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        _APP_CACHE[name] = mod.app
        return mod.app
    finally:
        sys.path.remove(str(proj_dir))

def import_app(name):
    return get_app(name)


@pytest.fixture
def transport(request):
    name = request.param
    app = import_app(name)
    return ASGITransport(app=app), name


@pytest.mark.asyncio
class TestHealth:
    @pytest.mark.parametrize("transport", list(PROJECTS.keys()), indirect=True, ids=list(PROJECTS.keys()))
    async def test_health_returns_ok(self, transport):
        t, name = transport
        async with httpx.AsyncClient(transport=t, base_url="http://testserver") as client:
            resp = await client.get("/health")
            assert resp.status_code == 200, f"{name}: {resp.text}"
            data = resp.json()
            assert data["status"] == "ok", f"{name}: {data}"


@pytest.mark.asyncio
class TestBanking:
    PROJECT = "AI_Banking_Payment_Brain"

    @pytest.fixture
    async def c(self):
        app = import_app(self.PROJECT)
        transport = ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
            yield client

    async def test_execute_payment_saga(self, c):
        resp = await c.post("/api/v1/saga/payment", json={
            "amount": 100.0,
            "currency": "SGD",
            "source_account": "ACC-001",
            "destination_account": "ACC-002",
        })
        assert resp.status_code in (200, 402), resp.text
        if resp.status_code == 200:
            assert "saga_id" in resp.json()

    async def test_get_saga_status_not_found(self, c):
        resp = await c.get("/api/v1/saga/nonexistent")
        assert resp.status_code == 404

    async def test_clear_saga(self, c):
        resp = await c.delete("/api/v1/saga/nonexistent")
        assert resp.status_code == 204

    async def test_realtime_transactions(self, c):
        resp = await c.post("/api/v1/realtime/transactions", json={
            "transaction_id": "txn-test-001",
            "amount": 100.0,
            "currency": "SGD",
            "source": "ACC-001",
            "destination": "ACC-002",
        })
        assert resp.status_code == 200
        assert resp.json()["ingested"] is True

    async def test_realtime_fraud_alert(self, c):
        resp = await c.post("/api/v1/realtime/fraud-alert", json={
            "transaction_id": "txn-fraud-001",
            "score": 0.95,
            "reason": "Suspicious pattern",
        })
        assert resp.status_code == 200
        assert resp.json()["broadcast"] is True

    async def test_kafka_topics(self, c):
        resp = await c.get("/api/v1/realtime/kafka/transactions/topics")
        assert resp.status_code == 200
        assert len(resp.json()["topics"]) >= 5

    async def test_agi_reason(self, c):
        resp = await c.post("/api/v1/agi/reason", json={
            "observation": "Is this transaction risky?",
            "context": {"amount": 50000, "country": "high_risk"},
        })
        assert resp.status_code == 200

    async def test_agi_capabilities(self, c):
        resp = await c.get("/api/v1/agi/capabilities")
        assert resp.status_code == 200
        assert "capabilities" in resp.json()

    async def test_invalid_currency(self, c):
        resp = await c.post("/api/v1/realtime/transactions", json={
            "transaction_id": "txn-001",
            "amount": 100.0,
            "currency": "INVALID",
            "source": "ACC-001",
            "destination": "ACC-002",
        })
        assert resp.status_code == 422


@pytest.mark.asyncio
class TestMarketplace:
    PROJECT = "AI_Agent_Marketplace"

    @pytest.fixture
    async def c(self):
        app = import_app(self.PROJECT)
        transport = ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
            yield client

    async def test_list_agents(self, c):
        resp = await c.get("/api/v1/marketplace/agents")
        assert resp.status_code == 200
        data = resp.json()
        assert "agents" in data
        assert data["total"] >= 3

    async def test_get_agent_found(self, c):
        resp = await c.get("/api/v1/marketplace/agents/agent-001")
        assert resp.status_code == 200
        assert resp.json()["name"] == "Content Writer Pro"

    async def test_get_agent_not_found(self, c):
        resp = await c.get("/api/v1/marketplace/agents/agent-999")
        assert resp.status_code == 404

    async def test_publish_agent(self, c):
        resp = await c.post("/api/v1/marketplace/agents", json={
            "name": "Test Agent",
            "publisher": "TestPub",
            "price_per_call": 0.05,
            "category": "content",
            "capabilities": ["writing"],
        })
        assert resp.status_code == 201
        assert resp.json()["status"] == "published"

    async def test_invalid_category(self, c):
        resp = await c.post("/api/v1/marketplace/agents", json={
            "name": "Bad Agent",
            "publisher": "TestPub",
            "price_per_call": 0.05,
            "category": "invalid-category",
            "capabilities": [],
        })
        assert resp.status_code == 422

    async def test_invalid_price(self, c):
        resp = await c.post("/api/v1/marketplace/agents", json={
            "name": "Bad",
            "publisher": "Pub",
            "price_per_call": 20.0,
            "category": "content",
            "capabilities": [],
        })
        assert resp.status_code == 422

    async def test_publisher_earnings(self, c):
        resp = await c.get("/api/v1/marketplace/publishers/AIWorks/earnings")
        assert resp.status_code == 200
        assert resp.json()["publisher_id"] == "AIWorks"

    async def test_kafka_topics(self, c):
        resp = await c.get("/api/v1/realtime/kafka/topics")
        assert resp.status_code == 200

    async def test_agi_learn(self, c):
        resp = await c.post("/api/v1/agi/learn", json={
            "agent_id": "agent-001",
            "skill": "writing",
            "proficiency": 0.85,
            "execution_time_ms": 1500,
            "feedback": 0.5,
        })
        assert resp.status_code == 200


@pytest.mark.asyncio
class TestSmartCity:
    PROJECT = "AI_Smart_City_Platform"

    @pytest.fixture
    async def c(self):
        app = import_app(self.PROJECT)
        transport = ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
            yield client

    async def test_get_sensors(self, c):
        resp = await c.get("/api/v1/city/sensors")
        assert resp.status_code == 200
        assert "sensors" in resp.json()

    async def test_traffic_optimize(self, c):
        resp = await c.post("/api/v1/city/traffic/optimize", json={
            "zone": "downtown",
            "congestion_level": 0.75,
            "time_of_day": "08:30",
        })
        assert resp.status_code == 200

    async def test_drone_dispatch(self, c):
        resp = await c.post("/api/v1/city/drone/dispatch", json={
            "drone_id": "drone-01",
            "location": {"lat": 1.3521, "lng": 103.8198},
            "type": "surveillance",
        })
        assert resp.status_code == 200

    async def test_realtime_aqi(self, c):
        resp = await c.post("/api/v1/realtime/environment/aqi", params={
            "sensor_id": "aqi-01",
            "pm25": 25.0,
            "pm10": 30.0,
            "aqi": 85,
        })
        assert resp.status_code == 200

    async def test_agi_predict(self, c):
        resp = await c.post("/api/v1/agi/predict", json={
            "zone": "downtown",
            "horizon_minutes": 60,
        })
        assert resp.status_code == 200


@pytest.mark.asyncio
class TestCybersecurity:
    PROJECT = "AI_Cybersecurity_Platform"

    @pytest.fixture
    async def c(self):
        app = import_app(self.PROJECT)
        transport = ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
            yield client

    async def test_get_alerts(self, c):
        resp = await c.get("/api/v1/security/alerts")
        assert resp.status_code == 200
        assert "alerts" in resp.json()

    async def test_siem_ingest(self, c):
        resp = await c.post("/api/v1/security/siem/ingest", json={
            "log_source": "firewall",
            "event_type": "login",
            "source_ip": "10.0.0.1",
            "user": "jdoe",
            "raw_message": "test-log",
        })
        assert resp.status_code == 200

    async def test_threat_detect(self, c):
        resp = await c.post("/api/v1/security/threat/detect", json={
            "event_type": "login",
            "bytes_out": 1000,
            "bytes_in": 500,
            "destination_ip": "203.0.113.5",
            "process_name": "sshd",
            "user": "jdoe",
        })
        assert resp.status_code == 200

    async def test_agi_threat(self, c):
        resp = await c.post("/api/v1/agi/threat/observe", json={
            "mitre_id": "T1566",
            "technique": "phishing",
            "severity": "high",
            "source_ip": "203.0.113.5",
        })
        assert resp.status_code == 200


@pytest.mark.asyncio
class TestKnowledge:
    PROJECT = "Enterprise_Knowledge_Digital_Twin"

    @pytest.fixture
    async def c(self):
        app = import_app(self.PROJECT)
        transport = ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
            yield client

    async def test_search(self, c):
        resp = await c.post("/api/v1/knowledge/search", json={"query": "test", "top_k": 5})
        assert resp.status_code == 200
        assert "results" in resp.json()

    async def test_ingest(self, c):
        resp = await c.post("/api/v1/knowledge/ingest", json={
            "title": "Test Document",
            "content": "Test content",
            "source": "test",
        })
        assert resp.status_code == 201

    async def test_graph_stats(self, c):
        resp = await c.get("/api/v1/knowledge/graph/stats")
        assert resp.status_code == 200

    async def test_agi_synthesize(self, c):
        resp = await c.post("/api/v1/agi/synthesize", json={
            "topic": "machine learning trends",
            "depth": "comprehensive",
        })
        assert resp.status_code == 200


@pytest.mark.asyncio
class TestSoftwareEngineer:
    PROJECT = "AI_Software_Engineer_Agent"

    @pytest.fixture
    async def c(self):
        app = import_app(self.PROJECT)
        transport = ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
            yield client

    async def test_code_generate(self, c):
        resp = await c.post("/api/v1/code/generate", json={
            "description": "Write a hello world in Python",
            "language": "python",
            "framework": None,
        })
        assert resp.status_code == 200
        assert "task_id" in resp.json()

    async def test_code_review(self, c):
        resp = await c.post("/api/v1/code/review", json={
            "code": "def foo():\n    pass\n",
            "language": "python",
        })
        assert resp.status_code == 200
        assert "issues" in resp.json()

    async def test_refactor(self, c):
        resp = await c.post("/api/v1/code/refactor", json={
            "code": "x = 1 + 2\nprint(x)",
            "language": "python",
            "goals": ["readability"],
        })
        assert resp.status_code == 200

    async def test_agi_architect(self, c):
        resp = await c.post("/api/v1/agi/design/recommend", json={
            "requirements": ["Build a REST API"],
        })
        assert resp.status_code == 200


@pytest.mark.asyncio
class TestRobotics:
    PROJECT = "AI_Robotics_Control_Platform"

    @pytest.fixture
    async def c(self):
        app = import_app(self.PROJECT)
        transport = ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
            yield client

    async def test_get_robots(self, c):
        resp = await c.get("/api/v1/robots")
        assert resp.status_code == 200

    async def test_robot_command(self, c):
        resp = await c.post("/api/v1/robots/rbt-001/command", json={
            "type": "move",
            "params": {"x": 1.0, "y": 2.0},
        })
        assert resp.status_code == 200

    async def test_navigation_plan(self, c):
        resp = await c.post("/api/v1/navigation/plan", json={
            "start": [0.0, 0.0],
            "goal": [10.0, 10.0],
            "algorithm": "a_star",
        })
        assert resp.status_code == 200

    async def test_agi_skill(self, c):
        resp = await c.post("/api/v1/agi/skill/learn", json={
            "robot_id": "robot-01",
            "skill": "grasping",
            "demonstration": {"gripper": "close", "success_rate": 0.8},
        })
        assert resp.status_code == 200


@pytest.mark.asyncio
class TestQuantum:
    PROJECT = "Quantum_AI_Optimization"

    @pytest.fixture
    async def c(self):
        app = import_app(self.PROJECT)
        transport = ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
            yield client

    async def test_qaoa(self, c):
        resp = await c.post("/api/v1/optimize/qaoa", json={
            "problem": {"type": "maxcut", "nodes": 4, "edges": [[0, 1], [1, 2], [2, 3], [3, 0]]},
            "params": {"p": 2, "gamma": [0.5, 1.0], "beta": [0.3, 0.6]},
        })
        assert resp.status_code == 200

    async def test_milp(self, c):
        resp = await c.post("/api/v1/optimize/milp", json={
            "objectives": [{"variable": "x", "coefficient": 1.0}],
            "constraints": [{"variables": ["x"], "coefficients": [1.0], "rhs": 10.0, "sense": "<="}],
            "solver": "cbc",
        })
        assert resp.status_code == 200

    async def test_quantum_backends(self, c):
        resp = await c.get("/api/v1/quantum/backends")
        assert resp.status_code == 200
        assert "backends" in resp.json()

    async def test_agi_discover(self, c):
        resp = await c.post("/api/v1/agi/algorithm/recommend", json={
            "problem_type": "maxcut",
            "n_variables": 10,
        })
        assert resp.status_code == 200


@pytest.mark.asyncio
class TestCloud:
    PROJECT = "Cloud_Management_Platform"

    @pytest.fixture
    async def c(self):
        app = import_app(self.PROJECT)
        transport = ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
            yield client

    async def test_rightsize(self, c):
        resp = await c.post("/api/v1/rightsize", json={
            "instance_type": "t2.micro",
            "avg_cpu": 45.0,
            "avg_memory": 60.0,
            "provider": "aws",
        })
        assert resp.status_code == 200

    async def test_cost_forecast(self, c):
        resp = await c.post("/api/v1/cost-forecast", json={
            "provider": "aws",
            "months": 12,
        })
        assert resp.status_code == 200

    async def test_resources(self, c):
        resp = await c.get("/api/v1/resources")
        assert resp.status_code == 200


@pytest.mark.asyncio
class TestMonitoring:
    PROJECT = "AI_Monitoring_Brain"

    @pytest.fixture
    async def c(self):
        app = import_app(self.PROJECT)
        transport = ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
            yield client

    async def test_ingest_traces(self, c):
        resp = await c.post("/api/v1/traces", json=[{
            "trace_id": "trace-001",
            "span_id": "span-001",
            "parent_span_id": None,
            "service": "test-svc",
            "operation": "test",
            "start_time_unix_nano": 0,
            "duration_ns": 1000,
            "status": "ok",
        }])
        assert resp.status_code == 200

    async def test_ingest_metrics(self, c):
        resp = await c.post("/api/v1/metrics", json=[{
            "name": "cpu_usage",
            "type": "gauge",
            "value": 75.0,
            "tags": {"host": "web-01"},
        }])
        assert resp.status_code == 200

    async def test_detect_anomalies(self, c):
        resp = await c.post("/api/v1/anomalies/detect", json={
            "values": [10, 20, 15, 100, 18, 22],
            "sensitivity": 0.8,
            "metric_name": "latency_ms",
        })
        assert resp.status_code == 200

    async def test_service_graph(self, c):
        resp = await c.get("/api/v1/service-graph")
        assert resp.status_code == 200


@pytest.mark.asyncio
class TestHealthcare:
    PROJECT = "AI_Healthcare_Platform"

    @pytest.fixture
    async def c(self):
        app = import_app(self.PROJECT)
        transport = ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
            yield client

    async def test_diagnosis_predict(self, c):
        resp = await c.post("/api/v1/diagnosis/predict", json={
            "age": 45,
            "gender": "male",
            "symptoms": ["fever", "cough"],
            "vital_signs": {"heart_rate": 80, "blood_pressure_systolic": 120},
        })
        assert resp.status_code == 200

    async def test_clinical_notes(self, c):
        resp = await c.post("/api/v1/clinical-notes/analyze", json={
            "text": "Patient presents with chest pain",
            "note_type": "progress",
            "patient_id": "PAT-001",
        })
        assert resp.status_code == 200

    async def test_medication_check(self, c):
        resp = await c.post("/api/v1/medication/check", json={
            "medications": ["Aspirin", "Warfarin"],
            "conditions": ["Atrial Fibrillation"],
        })
        assert resp.status_code == 200

    async def test_realtime_vitals(self, c):
        resp = await c.post("/api/v1/realtime/vitals", json={
            "patient_id": "PAT-001",
            "heart_rate": 75,
            "blood_pressure_systolic": 120,
            "blood_pressure_diastolic": 80,
        })
        assert resp.status_code == 200

    async def test_invalid_gender(self, c):
        resp = await c.post("/api/v1/diagnosis/predict", json={
            "age": 30,
            "gender": "unknown",
            "symptoms": ["cough"],
        })
        assert resp.status_code == 422


@pytest.mark.asyncio
class TestLogistics:
    PROJECT = "AI_Logistics_Supply_Chain"

    @pytest.fixture
    async def c(self):
        app = import_app(self.PROJECT)
        transport = ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
            yield client

    async def test_routing_optimize(self, c):
        resp = await c.post("/api/v1/routing/optimize", json={
            "depot": {"lat": 1.3, "lng": 103.8},
            "stops": [{"lat": 1.3, "lng": 103.8}, {"lat": 1.4, "lng": 103.9}],
            "vehicles": [{"id": "v1", "capacity_kg": 1000}],
            "algorithm": "savings",
        })
        assert resp.status_code == 200

    async def test_warehouse_optimize(self, c):
        resp = await c.post("/api/v1/warehouse/optimize", json={
            "layout_type": "traditional",
            "width_m": 100.0,
            "depth_m": 80.0,
            "num_zones": 5,
            "sku_count": 1000,
        })
        assert resp.status_code == 200

    async def test_demand_forecast(self, c):
        resp = await c.post("/api/v1/demand/forecast", json={
            "product_id": "SKU-001",
            "historical_data": [{"date": "2024-01-01", "sales": 100}],
            "horizon_days": 30,
        })
        assert resp.status_code == 200

    async def test_inventory_status(self, c):
        resp = await c.get("/api/v1/inventory/status")
        assert resp.status_code == 200


@pytest.mark.asyncio
class TestUniversalAgentic:
    PROJECT = "Universal_Agentic_AI"

    @pytest.fixture
    async def c(self):
        app = import_app(self.PROJECT)
        transport = ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
            yield client

    async def test_register_agent(self, c):
        resp = await c.post("/api/v1/agents/register", json={
            "name": "test-agent",
            "role": "orchestrator",
            "allowed_tools": ["chat", "reasoning"],
        })
        assert resp.status_code == 200

    async def test_list_agents(self, c):
        resp = await c.get("/api/v1/agents")
        assert resp.status_code == 200
        assert "agents" in resp.json()

    async def test_execute_agent(self, c):
        resp = await c.post("/api/v1/agents/execute", json={
            "agent_name": "test-agent",
            "task": "Say hello",
            "context": {},
        })
        assert resp.status_code in (200, 404)

    async def test_policy_evaluate(self, c):
        resp = await c.post("/api/v1/policy/evaluate", json={
            "action": "execute_agent",
            "resource": "agent:test-agent",
            "agent": "user:admin",
        })
        assert resp.status_code == 200

    async def test_realtime_execution(self, c):
        resp = await c.post("/api/v1/realtime/executions/stream", json={
            "execution_id": "exec-001",
            "agent_id": "test-agent",
            "task": "test",
            "status": "running",
        })
        assert resp.status_code == 200
