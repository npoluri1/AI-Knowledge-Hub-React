# Edureka AI/ML Cloud Tech Stack Reference

> A comprehensive guide to building production AI/ML systems using cloud-native technologies.
> 30 sections covering platforms, infrastructure, databases, APIs, tooling, and governance.

---

## Table of Contents

1. [Cloud AI Platforms](#1-cloud-ai-platforms)
2. [Serverless ML](#2-serverless-ml)
3. [Container Orchestration](#3-container-orchestration)
4. [GPU Infrastructure](#4-gpu-infrastructure)
5. [Model Hubs](#5-model-hubs)
6. [Vector DB Cloud](#6-vector-db-cloud)
7. [API Gateways](#7-api-gateways)
8. [Message Queues](#8-message-queues)
9. [Streaming](#9-streaming)
10. [Data Lakes](#10-data-lakes)
11. [Feature Stores](#11-feature-stores)
12. [Experiment Tracking](#12-experiment-tracking)
13. [CI/CD for ML](#13-cicd-for-ml)
14. [Monitoring](#14-monitoring)
15. [LLM APIs](#15-llm-apis)
16. [Embedding APIs](#16-embedding-apis)
17. [Speech-to-Text](#17-speech-to-text)
18. [Text-to-Speech](#18-text-to-speech)
19. [Image Generation](#19-image-generation)
20. [Video AI](#20-video-ai)
21. [Search & RAG](#21-search--rag)
22. [Auth for AI](#22-auth-for-ai)
23. [CDN & Edge AI](#23-cdn--edge-ai)
24. [Databases](#24-databases)
25. [Low-Code AI](#25-low-code-ai)
26. [AI IDEs](#26-ai-ides)
27. [Prompt Management](#27-prompt-management)
28. [Evaluation](#28-evaluation)
29. [Cost Optimization](#29-cost-optimization)
30. [Compliance & Governance](#30-compliance--governance)

---

## 1. Cloud AI Platforms

Managed platforms that provide end-to-end ML lifecycle: data prep, training, tuning, deployment, and monitoring.

### Amazon SageMaker

- **Vendor:** AWS
- **Description:** Fully managed service covering the entire ML workflow — data labeling, training, tuning, hosting, and monitoring. Supports built-in algorithms, custom containers, and JumpStart for foundation models.
- **When to Use:** End-to-end ML projects on AWS; teams wanting managed infrastructure without managing servers; need built-in experiment tracking and model registry.
- **Pricing:** No upfront cost. Pay per instance-hour for training and hosting. ml.t3.medium (studio) ~$0.0485/hr. Training ml.m5.xlarge ~$0.23/hr. Hosting ml.g4dn.xlarge ~$0.736/hr. Free tier: 250 hrs ml.t2.medium for 2 months.

```python
import sagemaker
from sagemaker.sklearn.estimator import SKLearn

session = sagemaker.Session()
role = sagemaker.get_execution_role()

estimator = SKLearn(
    entry_point="train.py",
    role=role,
    instance_type="ml.m5.xlarge",
    instance_count=1,
    framework_version="1.2-1",
    sagemaker_session=session,
    hyperparameters={"n_estimators": 100, "max_depth": 5},
    output_path="s3://my-bucket/models/",
)

estimator.fit({"train": "s3://my-bucket/data/train/"})

predictor = estimator.deploy(
    initial_instance_count=1,
    instance_type="ml.t2.medium",
    endpoint_name="my-model-endpoint",
)

result = predictor.predict([[5.1, 3.5, 1.4, 0.2]])
print(result)
```

### Google Vertex AI

- **Vendor:** GCP
- **Description:** Unified platform for building, deploying, and scaling ML models on GCP. Integrates with BigQuery ML, AutoML, and custom training. Supports Gemini models natively.
- **When to Use:** GCP-native shops; teams needing tight BigQuery integration; AutoML for vision/NLP/tabular without deep ML expertise; building on Gemini.
- **Pricing:** No upfront cost. Training custom models on n1-standard-4 ~$0.188/hr. Prediction nodes ~$0.043/hr. AutoML training depends on node-hours. Vertex AI Search: first 1,000 queries/month free.

```python
from google.cloud import aiplatform

aiplatform.init(project="my-project", location="us-central1")

model = aiplatform.Model.upload(
    display_name="fraud-detection-v1",
    artifact_uri="gs://my-bucket/model-artifacts/",
    serving_container_image_uri="us-docker.pkg.dev/vertex-ai/prediction/sklearn-cpu.1-0:latest",
    serving_container_predict_route="/predict",
    serving_container_health_route="/health",
)

endpoint = model.deploy(
    deployed_model_display_name="fraud-detection-v1",
    machine_type="n1-standard-4",
    min_replica_count=1,
    max_replica_count=3,
)

prediction = endpoint.predict([[4.5, 2.3, 1.1, 0.3]])
print(prediction)
```

### Azure Machine Learning

- **Vendor:** Microsoft
- **Description:** Cloud-based ML platform integrating with Azure services. Provides AutoML, designer (drag-and-drop), notebooks, pipelines, and managed online endpoints. Strong enterprise governance.
- **When to Use:** Microsoft/Azure ecosystem shops; enterprise needing RBAC and compliance; .NET shops; teams using Power BI and Fabric.
- **Pricing:** Free tier: 750 hrs of Compute Instance (Standard_D2s_v3) for 12 months. Pay-as-you-go for compute. Managed endpoints: ~$0.10/hr for DS2 v2.

```python
from azureml.core import Workspace, Model, Environment
from azureml.core.model import InferenceConfig
from azureml.core.webservice import AciWebservice

ws = Workspace.from_config()
model = Model(ws, name="fraud-detection", version=1)

env = Environment.from_conda_specification("sklearn-env", "environment.yml")
inference_config = InferenceConfig(
    entry_script="score.py", source_directory="./src", environment=env,
)

deployment_config = AciWebservice.deploy_configuration(cpu_cores=1, memory_gb=1, auth_enabled=True)

service = Model.deploy(
    workspace=ws, name="fraud-service", models=[model],
    inference_config=inference_config, deployment_config=deployment_config, overwrite=True,
)
service.wait_for_deployment(show_output=True)
print(service.scoring_uri)
```

### IBM Watson Studio + Watsonx

- **Vendor:** IBM
- **Description:** Enterprise AI platform combining Watson Studio (ML lifecycle) with Watsonx (foundation models, data, governance). Includes Prompt Lab, Tuning Studio, and watsonx.ai runtime.
- **When to Use:** IBM Cloud/Hybrid Cloud environments; regulated industries needing watsonx.governance; teams wanting Granite models; hybrid on-prem + cloud deployments.
- **Pricing:** Watson Studio Lite: free (limited). Watsonx.ai: $0.0024/1K chars for LLM inference. Watsonx.data: $1.20/DBU. Watsonx.governance: $0.0024/credits.

```python
from ibm_watsonx_ai import APIClient, Credentials
from ibm_watsonx_ai.foundation_models import Model

credentials = Credentials(url="https://us-south.ml.cloud.ibm.com", api_key="YOUR_API_KEY")
client = APIClient(credentials)
client.set.default_project("your-project-id")

model = Model(
    model_id="ibm/granite-13b-chat-v2",
    params={"max_new_tokens": 256, "temperature": 0.7},
    credentials=credentials,
    project_id="your-project-id",
)

response = model.generate_text(prompt="Explain supervised vs unsupervised learning in 3 sentences.")
print(response)
```

---

## 2. Serverless ML

Event-driven compute for ML inference, pre/post-processing, and lightweight training without managing servers.

### AWS Lambda + Bedrock

- **Vendor:** AWS
- **Description:** Lambda provides serverless compute; Bedrock provides managed foundation model APIs. Together they enable cost-effective, auto-scaling AI endpoints.
- **When to Use:** Spiky inference workloads; event-driven AI (S3 upload triggers prediction); prototyping; cost-sensitive deployments.
- **Pricing:** Lambda: 1M free requests/month, 400K GB-seconds free. Then $0.20/M requests + $0.0000166667/GB-second. Bedrock: Claude 3 Haiku ~$0.25/M input tokens, ~$1.25/M output tokens.

```python
import json
import boto3

bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")

def lambda_handler(event, context):
    body = json.loads(event["body"])
    prompt = body.get("prompt", "Hello, world!")

    response = bedrock.invoke_model(
        modelId="anthropic.claude-3-haiku-20240307-v1:0",
        contentType="application/json",
        accept="application/json",
        body=json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 256,
            "messages": [{"role": "user", "content": prompt}],
        }),
    )

    result = json.loads(response["body"].read())
    return {
        "statusCode": 200,
        "body": json.dumps({"response": result["content"][0]["text"], "usage": result["usage"]}),
    }
```

### Google Cloud Functions

- **Vendor:** GCP
- **Description:** Lightweight serverless compute triggered by events (HTTP, Pub/Sub, Cloud Storage). Good for ML preprocessing and lightweight inference.
- **When to Use:** Quick prototyping; event-driven ML pipelines; HTTP-triggered inference; Google ecosystem integrations.
- **Pricing:** 2M invocations/month free, 400K GB-seconds free. Then $0.40/M invocations + $0.0000025/GB-second.

```python
import functions_framework
import vertexai
from vertexai.preview.generative_models import GenerativeModel

vertexai.init(project="my-project", location="us-central1")
model = GenerativeModel("gemini-1.5-flash")

@functions_framework.http
def generate(request):
    data = request.get_json(silent=True)
    prompt = data.get("prompt", "Explain quantum computing.")

    response = model.generate_content(
        prompt, generation_config={"max_output_tokens": 256, "temperature": 0.7},
    )
    return {"text": response.text, "tokens": response.usage_metadata.total_token_count}
```

### Azure Functions

- **Vendor:** Microsoft
- **Description:** Serverless compute on Azure. Supports Python, JavaScript, C#, Java. Integrates with Azure AI Services and custom ML models.
- **When to Use:** Azure-native serverless AI; event-driven processing with Event Grid/Blob triggers; enterprise Azure environments.
- **Pricing:** Consumption: 1M executions/month free, 400K GB-s/month free. Then $0.20/M executions + $0.000016/GB-s. Premium: from $0.173/hr.

```python
import azure.functions as func
import json
from azure.ai.textanalytics import TextAnalyticsClient
from azure.identity import DefaultAzureCredential

app = func.FunctionApp()
credential = DefaultAzureCredential()
client = TextAnalyticsClient(
    endpoint="https://my-text.cognitiveservices.azure.com/", credential=credential,
)

@app.route(route="analyze", methods=["POST"])
def analyze_sentiment(req: func.HttpRequest) -> func.HttpResponse:
    body = req.get_json()
    documents = body.get("texts", ["I love this product!"])

    result = client.analyze_sentiment(documents=documents)
    sentiments = [
        {"text": doc.text, "sentiment": doc.sentiment, "scores": doc.confidence_scores}
        for doc in result
    ]
    return func.HttpResponse(json.dumps(sentiments), mimetype="application/json")
```

---

## 3. Container Orchestration

Running ML workloads in containers for consistency, scalability, and portability.

### Kubernetes + KServe

- **Vendor:** CNCF / Various
- **Description:** Kubernetes is the de facto container orchestrator. KServe provides Kubernetes-native model serving with autoscaling, canary, and multi-framework support.
- **When to Use:** Multi-model serving at scale; need autoscaling (including scale-to-zero); hybrid/multi-cloud; team already running Kubernetes.
- **Pricing:** Kubernetes is free (open source). Managed: EKS $0.10/hr/cluster + worker costs, GKE Autopilot ~$0.03881/hr/vCPU. KServe is open source.

```yaml
apiVersion: serving.kserve.io/v1beta1
kind: InferenceService
metadata:
  name: sklearn-iris
  namespace: default
spec:
  predictor:
    model:
      modelFormat:
        name: sklearn
      storageUri: "s3://my-bucket/sklearn/iris/"
      resources:
        requests:
          cpu: "1"
          memory: "2Gi"
        limits:
          cpu: "2"
          memory: "4Gi"
    minReplicas: 0
    maxReplicas: 10
    scaleTarget: 80
```

### Docker + Docker Compose

- **Vendor:** Docker Inc.
- **Description:** Containerization platform for packaging ML applications with all dependencies. Compose enables multi-service local development.
- **When to Use:** Local development; packaging ML services; reproducible environments; simple multi-service deployments.
- **Pricing:** Docker Desktop: free for personal/small businesses. Pro: $5/month. Docker Hub: 1 private repo free, 2,000 pulls/day.

```yaml
version: "3.9"
services:
  inference:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - MODEL_PATH=/models/classifier
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./models:/models:ro
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  redis_data:
```

### Amazon ECS

- **Vendor:** AWS
- **Description:** Fully managed container orchestration on AWS. Supports Fargate (serverless) or EC2 launch types. Integrates with ALB, ECR, CloudWatch.
- **When to Use:** AWS-native container workloads; want managed orchestration without Kubernetes complexity; Fargate for serverless containers.
- **Pricing:** No charge for ECS (pay for underlying resources). Fargate Linux: ~$0.04048/vCPU/hr + $0.004445/GB/hr.

```json
{
  "family": "ml-inference",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "2048",
  "memory": "4096",
  "executionRoleArn": "arn:aws:iam::role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "model-server",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/ml-inference:latest",
      "portMappings": [{"containerPort": 8080, "protocol": "tcp"}],
      "environment": [
        {"name": "MODEL_NAME", "value": "fraud-detector"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ml-inference",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Google Cloud Run

- **Vendor:** GCP
- **Description:** Fully managed serverless container platform. Deploy any container as a stateless HTTP service with automatic scaling, including to zero. Supports GPU.
- **When to Use:** Simple HTTP inference endpoints; want serverless with containers; rapid prototyping; GPU on serverless.
- **Pricing:** 2M requests/month free, 360K GiB-seconds free. Then $0.00002400/vCPU-second + $0.00000250/GiB-second. GPU (L4): ~$0.003611/GPU-second extra.

```yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: ml-inference
  annotations:
    run.googleapis.com/accelerator: nvidia-l4
spec:
  template:
    spec:
      containerConcurrency: 4
      containers:
        - image: gcr.io/my-project/ml-inference:latest
          ports:
            - containerPort: 8080
          resources:
            limits:
              cpu: "4"
              memory: "16Gi"
              nvidia.com/gpu: "1"
      scaling:
        minInstanceCount: 0
        maxInstanceCount: 100
```

---

## 4. GPU Infrastructure

Raw and managed GPU compute for training and inference of large models.

### AWS p4d.24xlarge (A100)

- **Vendor:** AWS
- **Description:** 8x NVIDIA A100 40GB GPUs, 96 vCPUs, 1.1TB RAM, 4x 1.9TB NVMe SSD. Optimized for large-scale distributed training.
- **When to Use:** Training large models (1B+ parameters); distributed training with NCCL; running multiple inference workloads.
- **Pricing:** On-demand: ~$32.77/hr. Spot: ~$11-15/hr (60-70% savings). Reserved 1yr: ~$22/hr.

```bash
# Launch p4d instance with AWS CLI
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type p4d.24xlarge \
  --key-name my-key \
  --security-group-ids sg-0abc1234 \
  --subnet-id subnet-0abc1234 \
  --block-device-mappings '[{
    "DeviceName": "/dev/sdf",
    "Ebs": {"VolumeSize": 1000, "VolumeType": "gp3", "Iops": 16000, "Throughput": 1000}
  }]' \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=ml-training}]'

# Install NVIDIA drivers and Docker
ssh -i my-key.pem ubuntu@<ip> << 'EOF'
sudo apt-get update && sudo apt-get install -y nvidia-driver-535 nvidia-docker2
sudo systemctl restart docker
sudo docker run --gpus all nvidia/cuda:12.2-base nvidia-smi
EOF
```

### GCP A2 High GPU

- **Vendor:** GCP
- **Description:** A2 machine types with NVIDIA A100 GPUs (up to 8x 80GB). Deep Learning VM images with pre-installed frameworks.
- **When to Use:** GCP-native training; need A100 80GB; tight integration with Vertex AI.
- **Pricing:** a2-highgpu-1g (1x A100 40GB): ~$3.67/hr. a2-highgpu-8g: ~$29.39/hr. Preemptible: 30-60% discount.

```bash
# Create A2 VM
gcloud compute instances create ml-training-a2 \
  --zone=us-central1-a \
  --machine-type=a2-highgpu-8g \
  --image-family=pytorch-latest-gpu \
  --image-project=deeplearning-platform-release \
  --boot-disk-size=500GB \
  --boot-disk-type=pd-ssd \
  --metadata="install-nvidia-driver=True" \
  --maintenance-policy=TERMINATE

gcloud compute ssh ml-training-a2 --zone=us-central1-a --command="nvidia-smi"
```

### Lambda Labs

- **Vendor:** Lambda
- **Description:** Cloud GPU instances optimized for ML. A100, H100, RTX A6000 with InfiniBand on multi-node. Simple pricing.
- **When to Use:** Research teams; startups; need fast GPU access; training medium-sized models; cost-sensitive GPU compute.
- **Pricing:** 1x A100 40GB: $1.10/hr. 1x A100 80GB: $1.64/hr. 8x A100 80GB: $12.32/hr. H100: ~$2.49/hr.

```bash
# Launch GPU instance via API
curl -X POST "https://cloud.lambdalabs.com/api/v1/instance-operations/launch" \
  -u "YOUR_API_KEY:" \
  -H "Content-Type: application/json" \
  -d '{
    "region_name": "us-west-2",
    "instance_type_name": "gpu_1x_a100_80gb",
    "ssh_key_names": ["my-key"],
    "quantity": 1
  }'
```

### RunPod

- **Vendor:** RunPod
- **Description:** Community and enterprise GPU cloud. Spot and on-demand GPUs. Serverless endpoint option. Pod system for interactive sessions.
- **When to Use:** Budget-friendly GPU; spot training; quick experiments; serverless GPU inference.
- **Pricing:** Community Cloud: A100 40GB from $0.45/hr (spot). A100 80GB from $1.20/hr. H100 from $2.69/hr. Serverless: $0.00063/s.

### Vast.ai

- **Vendor:** Vast.ai
- **Description:** Marketplace for GPU rental. Connects users with available GPU hardware. Lowest prices but variable availability.
- **When to Use:** Tightest budget; flexible training timelines; spot-like workloads; prototyping.
- **Pricing:** RTX 3090: from ~$0.10/hr. A100 40GB: from ~$0.40/hr. A100 80GB: from ~$0.80/hr.

```bash
pip install vastai

# Find cheapest A100
vastai search offers --gpu-name "A100" --gpu_ram 80 --order 'dph_total' --limit 5

# Create instance
vastai create instance <offer_id> \
  --image runpod/pytorch:2.1.0-py3.10-cuda11.8.0-devel-ubuntu22.04 \
  --disk 200 --ssh --direct
```

---

## 5. Model Hubs

Registry and versioning for ML models, artifacts, and pipelines.

### HuggingFace Hub

- **Vendor:** HuggingFace
- **Description:** Central repository for ML models, datasets, and spaces. Supports transformers, diffusers, safetensors. Private repos, model cards, inference API.
- **When to Use:** Sharing/reusing pre-trained models; deploying transformers; model discovery; hosting demos with Spaces.
- **Pricing:** Free for public repos. Pro: $9/month (private repos, faster inference). Enterprise: custom. Inference API: free tier with rate limits.

```python
from huggingface_hub import HfApi, create_repo, upload_file
from transformers import pipeline

api = HfApi(token="hf_your_token")

# Push model
repo_id = "my-org/my-fine-tuned-model"
create_repo(repo_id, token="hf_your_token", private=True)
upload_file(path_or_fileobj="model.safetensors", path_in_repo="model.safetensors",
            repo_id=repo_id, token="hf_your_token")

# Pull and use model
generator = pipeline("text-generation", model="meta-llama/Llama-3.1-8B")
result = generator("The future of AI is", max_new_tokens=50)
print(result[0]["generated_text"])

# Model search
models = api.list_models(search="sentiment analysis", library="transformers",
                          sort="downloads", direction=-1, limit=5)
for m in models:
    print(f"{m.id} - {m.downloads} downloads")
```

### MLflow Model Registry

- **Vendor:** Databricks (open source)
- **Description:** Version-controlled model repository integrated with MLflow Tracking. Supports model stages, annotations, and lineage.
- **When to Use:** Teams already using MLflow; need model version governance; approval workflows; integration with Databricks.
- **Pricing:** MLflow is open source. Databricks MLflow: included in workspace (DBU-based, ~$0.07/DBU). Self-hosted: free.

```python
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris

mlflow.set_tracking_uri("http://localhost:5000")

iris = load_iris()
model = RandomForestClassifier(n_estimators=100, max_depth=5)
model.fit(iris.data, iris.target)

with mlflow.start_run(run_name="iris-rf"):
    mlflow.log_param("n_estimators", 100)
    mlflow.log_metric("accuracy", 0.96)
    result = mlflow.sklearn.log_model(model, artifact_path="model",
                                       registered_model_name="iris-classifier")

loaded_model = mlflow.pyfunc.load_model("models:/iris-classifier/Production")
predictions = loaded_model.predict(iris.data[:5])
```

### Amazon ECR

- **Vendor:** AWS
- **Description:** Managed Docker container registry. Store, manage, and deploy container images. Integrates with ECS, EKS, Fargate, SageMaker.
- **Pricing:** Storage: $0.10/GB/month. Data transfer to internet: first 5GB/month free, then $0.09/GB. Public ECR: free.

```bash
# Authenticate and push
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

aws ecr create-repository --repository-name ml-inference \
  --image-scanning-configuration scanOnPush=true

docker build -t ml-inference:latest .
docker tag ml-inference:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/ml-inference:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/ml-inference:latest
```

### Google Artifact Registry

- **Vendor:** GCP
- **Description:** Unified repository for Docker images, Python packages, Maven artifacts. Supports vulnerability scanning and IAM.
- **Pricing:** Storage: $0.10/GB/month. Data transfer: first 500MB/day free. Docker: first 5GB/month free.

```bash
gcloud auth configure-docker us-central1-docker.pkg.dev

gcloud artifacts repositories create ml-repos \
  --repository-format=docker --location=us-central1

docker build -t us-central1-docker.pkg.dev/my-project/ml-repos/inference:v1 .
docker push us-central1-docker.pkg.dev/my-project/ml-repos/inference:v1
```

---

## 6. Vector DB Cloud

Specialized databases for storing, indexing, and querying high-dimensional vectors for semantic search and RAG.

### Pinecone

- **Vendor:** Pinecone Systems
- **Description:** Fully managed vector database. Serverless architecture with automatic scaling. Supports metadata filtering, hybrid search, namespaces.
- **When to Use:** Production RAG systems; semantic search at scale; recommendation engines; zero-ops vector DB.
- **Pricing:** Starter (free): 100K vectors, 1GB. Standard: from $70/month. Serverless: pay per read/write + storage.

```python
from pinecone import Pinecone, ServerlessSpec

pc = Pinecone(api_key="YOUR_API_KEY")

pc.create_index(name="my-docs", dimension=1536, metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1"))

index = pc.Index("my-docs")

# Upsert vectors
vectors = [
    {"id": "doc1", "values": [0.1]*1536, "metadata": {"source": "wiki", "topic": "AI"}},
    {"id": "doc2", "values": [0.2]*1536, "metadata": {"source": "paper", "topic": "ML"}},
]
index.upsert(vectors=vectors)

# Query with metadata filter
results = index.query(vector=[0.1]*1536, top_k=5,
    filter={"topic": {"$eq": "AI"}}, include_metadata=True)
print(results.matches)
```

### Weaviate Cloud

- **Vendor:** Weaviate B.V.
- **Description:** Open-source vector search engine with managed cloud. Hybrid search (BM25 + vector), multi-tenancy, generative search modules.
- **When to Use:** Hybrid search; need custom vectorizers; multi-tenant applications; open-source option with cloud management.
- **Pricing:** Sandbox (free): limited. Serverless: from $25/month. Self-hosted: free.

```python
import weaviate
from weaviate.classes.config import Configure, Property, DataType

client = weaviate.connect_to_weaviate_cloud(
    cluster_url="https://abc123.weaviate.cloud",
    auth_credentials=weaviate.auth.AuthApiKey(api_key="YOUR_KEY"))

client.collections.create(name="Documents",
    vectorizer_config=Configure.Vectorizer.text2vec_openai(),
    properties=[
        Property(name="title", data_type=DataType.TEXT),
        Property(name="content", data_type=DataType.TEXT),
    ])

docs = client.collections.get("Documents")
docs.data.insert({"title": "AI Overview", "content": "AI is transforming...", "source": "blog"})

results = docs.query.hybrid(query="machine learning applications", alpha=0.75, limit=5)
```

### Qdrant Cloud

- **Vendor:** Qdrant Solutions
- **Description:** High-performance vector database in Rust. Payload filtering, multi-vector search, quantization, distributed deployment.
- **Pricing:** Free tier: 1GB. Pay-as-you-go: ~$0.0035/hr per vCPU+2GB. Starter: $25/month. Self-hosted: free.

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue

client = QdrantClient(url="https://abc123.us-east4-0.gcp.cloud.qdrant.io:6333", api_key="YOUR_KEY")

client.create_collection(collection_name="docs",
    vectors_config=VectorParams(size=1536, distance=Distance.COSINE))

client.upsert(collection_name="docs", points=[
    PointStruct(id=1, vector=[0.1]*1536, payload={"source": "wiki", "topic": "AI"}),
])

results = client.search(collection_name="docs", query_vector=[0.1]*1536, limit=5,
    query_filter=Filter(must=[FieldCondition(key="topic", match=MatchValue(value="AI"))]))
```

### Chroma

- **Vendor:** Chroma (open source)
- **Description:** Developer-friendly embedding database. Simple API, built-in embedding functions, metadata filtering. Great for prototyping.
- **Pricing:** Open source: free. Chroma Cloud (beta): free tier available.

```python
import chromadb
from chromadb.utils import embedding_functions

ef = embedding_functions.OpenAIEmbeddingFunction(api_key="sk-...")
client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection(name="documents", embedding_function=ef)

collection.add(
    documents=["AI is transforming healthcare", "ML detects fraud patterns"],
    metadatas=[{"source": "blog"}, {"source": "paper"}],
    ids=["doc1", "doc2"],
)

results = collection.query(query_texts=["artificial intelligence in medicine"], n_results=3)
print(results["documents"])
```

---

## 7. API Gateways

Manage, secure, and throttle APIs serving ML models.

### Kong Gateway

- **Vendor:** Kong Inc.
- **Description:** Cloud-native API gateway. Plugins for auth, rate limiting, logging, transformation. Supports HTTP, gRPC, WebSocket.
- **Pricing:** Kong OSS: free. Konnect: Free tier (limited). Plus: from $250/month. Enterprise: custom.

```yaml
_format_version: "3.0"
services:
  - name: ml-inference-api
    url: http://model-server:8080
    routes:
      - name: inference-route
        paths: ["/api/v1/inference"]
        methods: ["POST"]
    plugins:
      - name: rate-limiting
        config: {minute: 60, policy: redis, redis_host: redis}
      - name: key-auth
        config: {key_names: [apikey]}

consumers:
  - username: ml-client-app
    keyauth_credentials:
      - key: my-api-key-12345
```

### AWS API Gateway

- **Vendor:** AWS
- **Description:** Fully managed API service. REST and HTTP APIs, WebSocket, authorizers, request validation, caching. Integrates with Lambda, ECS.
- **Pricing:** REST API: $3.50/M calls. HTTP API: $1.00/M. Cache: $0.02/hr for 0.5GB. Free tier: 1M REST calls/month for 12 months.

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31
Resources:
  InferenceFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: handler.lambda_handler
      Runtime: python3.11
      MemorySize: 1024
      Timeout: 30
      Policies:
        - AmazonBedrockFullAccess
      Events:
        Inference:
          Type: Api
          Properties:
            Path: /inference
            Method: post
            RestApiId: !Ref InferenceApi

  InferenceApi:
    Type: AWS::Serverless::Api
    Properties:
      StageName: prod
      Auth:
        DefaultAuthorizer: ApiKey
        ApiKeyRequired: true
      Throttle:
        BurstLimit: 100
        RateLimit: 50
```

### Apigee (Google Cloud)

- **Vendor:** Google
- **Description:** Enterprise API management. Advanced analytics, developer portal, monetization, AI-powered threat detection.
- **Pricing:** Evaluation: free 60 days. Pay-as-you-go: $0.0035/10K calls + instance costs. Enterprise: custom.

---

## 8. Message Queues

Asynchronous messaging for ML pipeline orchestration and event-driven inference.

### Apache Kafka

- **Vendor:** Apache / Confluent
- **Description:** Distributed event streaming platform. High-throughput, low-latency, fault-tolerant. Kafka Streams and ksqlDB for processing.
- **Pricing:** Self-hosted: free. Confluent: Starter free (limited). Standard: $0.10/hr per CKU. AWS MSK: $0.21/hr per broker.

```python
from confluent_kafka import Producer, Consumer, KafkaError
import json

# Producer
producer = Producer({"bootstrap.servers": "localhost:9092", "client.id": "ml-producer"})

producer.produce(
    topic="ml-inference-requests",
    key="user-123",
    value=json.dumps({"prompt": "Classify this", "model": "resnet50"}),
)
producer.flush()

# Consumer
consumer = Consumer({
    "bootstrap.servers": "localhost:9092",
    "group.id": "ml-inference-group",
    "auto.offset.reset": "earliest",
})
consumer.subscribe(["ml-inference-requests"])

while True:
    msg = consumer.poll(1.0)
    if msg is None:
        continue
    if msg.error():
        continue
    data = json.loads(msg.value().decode("utf-8"))
    print(f"Processing: {data}")
    consumer.commit(msg)
```

### Amazon SQS

- **Vendor:** AWS
- **Description:** Fully managed message queue. Standard and FIFO queues. Dead letter queues, visibility timeout, long polling.
- **Pricing:** Free tier: 1M requests/month (Standard). Standard: $0.40/M. FIFO: $0.50/M.

```python
import boto3
import json

sqs = boto3.client("sqs")

queue = sqs.create_queue(
    QueueName="ml-inference-queue.fifo",
    Attributes={"FifoQueue": "true", "ContentBasedDeduplication": "true"},
)
queue_url = queue["QueueUrl"]

sqs.send_message(
    QueueUrl=queue_url,
    MessageBody=json.dumps({"prompt": "Summarize this document", "priority": "high"}),
    MessageGroupId="inference-requests",
    MessageDeduplicationId="req-001",
)

response = sqs.receive_message(QueueUrl=queue_url, MaxNumberOfMessages=10, WaitTimeSeconds=20)
for msg in response.get("Messages", []):
    body = json.loads(msg["Body"])
    print(f"Processing: {body}")
    sqs.delete_message(QueueUrl=queue_url, ReceiptHandle=msg["ReceiptHandle"])
```

### Google Cloud Pub/Sub

- **Vendor:** Google
- **Description:** Fully managed real-time messaging. At-least-once delivery, pull/push subscriptions, ordering keys, dead-letter topics.
- **Pricing:** First 10GB/month free. Then $40/TiB. Message overhead: $0.01/100K messages.

```python
from google.cloud import pubsub_v1
import json

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path("my-project", "ml-inference")

data = json.dumps({"prompt": "Classify this text", "model": "gemini-pro"}).encode("utf-8")
future = publisher.publish(topic_path, data, model="gemini-pro")
print(f"Published {future.result()}")

subscriber = pubsub_v1.SubscriberClient()
subscription_path = subscriber.subscription_path("my-project", "ml-inference-sub")

def callback(message):
    data = json.loads(message.data.decode("utf-8"))
    print(f"Processing: {data}")
    message.ack()

streaming_pull_future = subscriber.subscribe(subscription_path, callback=callback)
```

---

## 9. Streaming

Real-time data processing for ML feature computation and inference.

### Apache Flink

- **Vendor:** Apache / Confluent
- **Description:** Distributed stream processing. True stream processing (not micro-batch), exactly-once semantics, state management, event time processing.
- **Pricing:** Self-hosted: free. Confluent Cloud Flink: $0.10/CPU-hour. Amazon Managed Flink: $0.11/hr per KPU.

```java
public class RealTimeFeatures {
    public static void main(String[] args) throws Exception {
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
        env.setParallelism(4);

        DataStream<Transaction> transactions = env
            .fromSource(
                KafkaSource.<Transaction>builder()
                    .setBootstrapServers("kafka:9092")
                    .setTopics("transactions")
                    .setGroupId("flink-features")
                    .setStartingOffsets(OffsetsInitializer.latest())
                    .setValueOnlyDeserializer(new TransactionDeserializer())
                    .build(),
                WatermarkStrategy.noWatermarks(), "Kafka Source");

        DataStream<FeatureVector> features = transactions
            .keyBy(Transaction::getUserId)
            .window(SlidingEventTimeWindows.of(Time.minutes(5), Time.minutes(1)))
            .aggregate(new FeatureAggregator());

        features.addSink(new FeatureStoreSink());
        env.execute("Real-Time Feature Computation");
    }
}
```

### Apache Spark Structured Streaming

- **Vendor:** Apache / Databricks
- **Description:** Micro-batch and continuous streaming on Spark. Unified batch+streaming API. Delta Lake integration for exactly-once.
- **Pricing:** Self-hosted: free. Databricks: ~$0.07/DBU. EMR: EC2 + EMR fees (~$0.052/hr/instance).

```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import window, col, avg, count

spark = SparkSession.builder.appName("RealTimeFeatures").getOrCreate()

raw = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "kafka:9092") \
    .option("subscribe", "transactions") \
    .option("startingOffsets", "latest") \
    .load()

features = raw.select(col("key").cast("string").alias("user_id"), ...) \
    .withWatermark("timestamp", "10 minutes") \
    .groupBy(col("user_id"), window(col("timestamp"), "5 minutes", "1 minute")) \
    .agg(count("*").alias("txn_count_5m"), avg("amount").alias("avg_amount_5m"))

features.writeStream.format("delta").outputMode("update") \
    .option("checkpointLocation", "/checkpoints/features") \
    .start("/delta/features")
```

### Amazon Kinesis Data Streams

- **Vendor:** AWS
- **Description:** Managed streaming service. Handles capacity, encryption, durability. Enhanced fan-out for dedicated throughput per consumer.
- **Pricing:** Provisioned: $0.014/hr per shard. On-demand: $0.00013/4KB chunk. Enhanced fan-out: $0.015/hr per consumer.

```python
import boto3
import json

kinesis = boto3.client("kinesis")

kinesis.create_stream(StreamName="ml-events", ShardCount=2)

kinesis.put_record(
    StreamName="ml-events",
    Data=json.dumps({"event_type": "inference_request", "user_id": "u-123"}).encode("utf-8"),
    PartitionKey="u-123",
)

iterator = kinesis.get_shard_iterator(
    StreamName="ml-events", ShardId="shardId-000000000000", ShardIteratorType="LATEST",
)["ShardIterator"]

response = kinesis.get_records(ShardIterator=iterator, Limit=10)
for record in response["Records"]:
    data = json.loads(record["Data"].decode("utf-8"))
    print(f"Event: {data}")
```

---

## 10. Data Lakes

Scalable storage and query engines for ML training data and analytics.

### Delta Lake

- **Vendor:** Databricks (open source)
- **Description:** Open-source storage layer for data lakes. ACID transactions, time travel, schema enforcement, unified batch/streaming.
- **Pricing:** Open source: free. Databricks: $0.07-0.15/DBU. Self-hosted Spark: infra only.

```python
from delta import DeltaTable
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \
    .getOrCreate()

df = spark.read.parquet("/data/raw/training_data/")
df.write.format("delta").mode("overwrite").save("/delta/training_data")

# Time travel
old_df = spark.read.format("delta").option("versionAsOf", 0).load("/delta/training_data")

# ACID merge
DeltaTable.forPath(spark, "/delta/training_data").alias("target") \
    .merge(new_data.alias("source"), "target.id = source.id") \
    .whenMatchedUpdateAll() \
    .whenNotMatchedInsertAll() \
    .execute()
```

### Apache Iceberg

- **Vendor:** Apache (Netflix origin)
- **Description:** Open table format for huge analytic datasets. Hidden partitioning, time travel, schema/partition evolution. Engine-agnostic.
- **Pricing:** Open source: free. AWS Athena: $5/TB scanned. EMR: EC2 + EMR costs.

```python
spark.sql("""
    CREATE TABLE catalog.db.training_data (
        id BIGINT,
        features ARRAY<FLOAT>,
        label INT,
        created_at TIMESTAMP
    ) USING iceberg
    PARTITIONED BY (days(created_at))
    LOCATION 's3://my-lake/training_data'
""")

# Time travel
df = spark.read.table("catalog.db.training_data").filter("created_at > '2024-01-01'")

# Schema evolution
spark.sql("ALTER TABLE catalog.db.training_data ADD COLUMN version INT AFTER id")
```

### Snowflake

- **Vendor:** Snowflake Inc.
- **Description:** Cloud data platform. Separation of compute/storage. ML functions, Cortex AI, Snowpark for Python UDFs.
- **Pricing:** Free trial: $400 credit (14 days). Standard: from $2/credit/hr. Storage: $23/TB/month.

```sql
CREATE TABLE ml_training_data (
    id INT AUTOINCREMENT PRIMARY,
    features VARIANT,
    label INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);

COPY INTO ml_training_data
FROM 's3://my-bucket/training-data/'
FILE_FORMAT = (TYPE = PARQUET);

-- Snowpark Python UDF
CREATE OR REPLACE FUNCTION preprocess(text STRING)
RETURNS VARIANT LANGUAGE PYTHON RUNTIME_VERSION = '3.11'
PACKAGES = ('transformers', 'torch') HANDLER = 'run' AS $$
from transformers import AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
def run(text):
    tokens = tokenizer(text, padding='max_length', max_length=128, truncation=True)
    return {'input_ids': tokens['input_ids'], 'attention_mask': tokens['attention_mask']}
$$;
```

---

## 11. Feature Stores

Centralized repository for storing, sharing, and serving ML features consistently.

### Feast

- **Vendor:** Feast (open source)
- **Description:** Open-source feature store. Offline (batch) and online (real-time) feature serving. Python-native workflows, multiple backends.
- **Pricing:** Open source: free. Self-hosted: infra costs only.

```python
from feast import FeatureStore, Entity, FeatureView, FileSource, Field
from feast.types import Float32, Int64
from datetime import timedelta

driver = Entity(name="driver_id", join_keys=["driver_id"])

driver_stats = FeatureView(
    name="driver_stats", entities=[driver],
    schema=[
        Field(name="avg_daily_trips", dtype=Int64),
        Field(name="average_speed", dtype=Float32),
    ],
    source=FileSource(path="data/driver_stats.parquet", event_timestamp_column="event_timestamp"),
    online=True, ttl=timedelta(days=1),
)

store = FeatureStore(repo_path=".")
store.apply([driver, driver_stats])

feature_vector = store.get_online_features(
    features=["driver_stats:avg_daily_trips", "driver_stats:average_speed"],
    entity_rows=[{"driver_id": 1}],
).to_dict()
```

### Tecton

- **Vendor:** Tecton
- **Description:** Managed feature platform. Real-time features via streaming, batch, on-demand. Point-in-time correctness. Databricks/Spark integration.
- **Pricing:** Free tier available. Pay-as-you-go. Enterprise plans.

```python
from tecton import BatchFeatureView, StreamFeatureView
from tecton.types import Float32
from datetime import timedelta

daily_transactions = BatchFeatureView(
    name="daily_transactions", source=SparkSource(table="transactions"),
    entities=["user_id"],
    features=[Float32("avg_amount"), Float32("total_amount")],
    aggregation_interval=timedelta(days=1), ttl=timedelta(days=30),
)

realtime_signals = StreamFeatureView(
    name="realtime_fraud_signals", source=SparkSource(stream="kafka://transactions"),
    entities=["user_id"],
    features=[Float32("txn_count_last_5min")],
    aggregation_interval=timedelta(minutes=5), online_serving_enabled=True,
)
```

---

## 12. Experiment Tracking

Track ML experiments, hyperparameters, metrics, and artifacts for reproducibility.

### MLflow Tracking

- **Vendor:** Databricks (open source)
- **Description:** Open-source experiment tracking. Logs parameters, metrics, artifacts, models. UI for comparing runs. Any ML framework.
- **Pricing:** Open source: free. Databricks: included. Self-hosted: infra only.

```python
import mlflow
import mlflow.sklearn
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import cross_val_score
from sklearn.datasets import load_breast_cancer
import numpy as np

mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("breast-cancer-classification")

X, y = load_breast_cancer(return_X_y=True)

for n_est in [50, 100, 200]:
    for depth in [3, 5, 7]:
        with mlflow.start_run(run_name=f"gb_n{n_est}_d{depth}"):
            model = GradientBoostingClassifier(n_estimators=n_est, max_depth=depth)
            scores = cross_val_score(model, X, y, cv=5, scoring="accuracy")
            mlflow.log_params({"n_estimators": n_est, "max_depth": depth})
            mlflow.log_metric("accuracy_mean", np.mean(scores))
            mlflow.log_metric("accuracy_std", np.std(scores))
            model.fit(X, y)
            mlflow.sklearn.log_model(model, "model")
```

### Weights & Biases (W&B)

- **Vendor:** WandB
- **Description:** MLOps platform for experiment tracking, visualization, collaboration. Rich dashboards, sweeps, model management.
- **Pricing:** Free personal/academic. Teams: $50/user/month. Enterprise: custom.

```python
import wandb

wandb.init(project="image-classification",
    config={"learning_rate": 0.001, "batch_size": 64, "architecture": "resnet50"})

for epoch in range(10):
    # Training loop...
    wandb.log({"train/loss": 0.5 - epoch*0.05, "val/accuracy": 0.7 + epoch*0.02, "epoch": epoch})

# Hyperparameter sweep
sweep_config = {
    "method": "bayes",
    "metric": {"name": "val/accuracy", "goal": "maximize"},
    "parameters": {
        "learning_rate": {"min": 1e-5, "max": 1e-1, "distribution": "log_uniform"},
        "batch_size": {"values": [16, 32, 64, 128]},
    },
}
sweep_id = wandb.sweep(sweep_config, project="image-classification")
wandb.agent(sweep_id, function=train)
```

### DVC (Data Version Control)

- **Vendor:** Iterative (open source)
- **Description:** Git-based ML version control. Versions data, models, experiments alongside code. YAML pipelines.
- **Pricing:** Open source: free.

```bash
git init && dvc init

dvc add data/training.parquet
git add data/training.parquet.dvc .gitignore
git commit -m "Add training data"

# Pipeline (dvc.yaml)
cat > dvc.yaml << 'EOF'
stages:
  train:
    cmd: python src/train.py
    deps: [src/train.py, data/prepared]
    params: [model.n_estimators, model.max_depth]
    outs: [models/model.pkl]
    metrics: [metrics.json]
EOF

dvc repro
dvc experiments compare
dvc remote add -d storage s3://my-dvc-bucket
dvc push
```

---

## 13. CI/CD for ML

Automated testing, training, and deployment pipelines for ML models.

### GitHub Actions + ML

- **Vendor:** GitHub / Microsoft
- **Description:** YAML-based workflows triggered by events. Self-hosted runners for GPU workloads and matrix builds.
- **Pricing:** Free for public repos. Private: 2,000 minutes/month free. Self-hosted runners: free.

```yaml
name: ML Pipeline
on:
  push:
    branches: [main]
    paths: ['src/**', 'data/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: {python-version: "3.11"}
      - run: pip install -r requirements.txt
      - run: pytest tests/ --junitxml=results.xml

  train:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: {python-version: "3.11"}
      - run: pip install -r requirements.txt
      - run: python src/train.py --config configs/prod.yaml
      - run: python src/evaluate.py --threshold 0.85
        id: eval

  deploy:
    needs: train
    if: steps.eval.outcome == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/deploy-role
          aws-region: us-east-1
      - run: aws sagemaker create-execution-config --endpoint-name ml-prod
```

### Kubeflow Pipelines

- **Vendor:** Google (open source)
- **Description:** Kubernetes-native ML workflow orchestrator. Component-based pipelines, visual UI, experiment tracking, distributed training.
- **Pricing:** Open source: free. Google Cloud: GKE costs + Vertex AI Pipelines.

```python
import kfp
from kfp import dsl

@dsl.component(base_image="python:3.11")
def train_model(train_path: str, model_path: str, n_estimators: int = 100):
    from sklearn.ensemble import RandomForestClassifier
    import joblib, pandas as pd
    from sklearn.model_selection import train_test_split
    df = pd.read_csv(train_path)
    X_train, X_test, y_train, y_test = train_test_split(df.drop("target", axis=1), df["target"])
    model = RandomForestClassifier(n_estimators=n_estimators)
    model.fit(X_train, y_train)
    joblib.dump(model, model_path)

@dsl.pipeline(name="ml-pipeline")
def ml_pipeline(data_path: str, model_path: str):
    train_model(train_path=data_path, model_path=model_path, n_estimators=100)

client = kfp.Client(host="http://localhost:8080")
run = client.create_run_from_pipeline_func(ml_pipeline,
    arguments={"data_path": "s3://bucket/data.csv", "model_path": "s3://bucket/model.pkl"})
```

### ArgoCD + GitOps

- **Vendor:** CNCF (open source)
- **Description:** GitOps continuous delivery for Kubernetes. Declarative config, auto-sync, drift detection. Good for ML serving infrastructure.
- **Pricing:** Open source: free. Akuity: from $299/month.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: ml-serving
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/ml-configs.git
    targetRevision: main
    path: environments/prod
  destination:
    server: https://kubernetes.default.svc
    namespace: ml-serving
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

---

## 14. Monitoring

Observability for ML models, infrastructure, and data quality.

### Prometheus + Grafana

- **Vendor:** CNCF (open source)
- **Description:** Prometheus scrapes/stores metrics; Grafana visualizes with dashboards and alerts. Standard for infrastructure monitoring.
- **Pricing:** Open source: free. Grafana Cloud: Free tier (10K metrics). Pro: $8/user/month.

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "ml-inference"
    static_configs:
      - targets: ["model-server:8080"]
    metrics_path: /metrics

# ml_alerts.yml
groups:
  - name: ml_alerts
    rules:
      - alert: HighLatency
        expr: histogram_quantile(0.99, rate(inference_latency_seconds_bucket[5m])) > 1.0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "ML inference latency is high"

      - alert: LowAccuracy
        expr: ml_model_accuracy < 0.80
        for: 30m
        labels:
          severity: critical
```

### Evidently AI

- **Vendor:** Evidently AI
- **Description:** Open-source ML monitoring. Data drift detection, model performance monitoring, data quality checks. Interactive reports.
- **Pricing:** Open source: free. Cloud: Free tier. Team: from $50/month.

```python
from evidently import DataDefinition, Dataset
from evidently.metrics import DriftedColumnsCount, DataDriftTable
from evidently.report import Report
import pandas as pd

reference_data = pd.read_csv("data/train.csv")
current_data = pd.read_csv("data/production.csv")

data_def = DataDefinition(numerical_columns=["feature1", "feature2", "feature3"])

drift_report = Report(metrics=[DriftedColumnsCount(), DataDriftTable()])
drift_report.run(
    current_data=Dataset.from_pandas(current_data, data_definition=data_def),
    reference_data=Dataset.from_pandas(reference_data, data_definition=data_def),
)
drift_report.save_html("drift_report.html")
```

### Arize AI

- **Vendor:** Arize AI
- **Description:** ML observability platform. Model performance, data quality, embeddings drift, LLM-specific traces.
- **Pricing:** Free tier. Growth: custom. Enterprise: custom.

```python
import arize.pandas.logger as arize_logger
from arize.utils.types import ModelTypes, Environments

logger = arize_logger.Client(api_key="YOUR_API_KEY", project="fraud-detection")

logger.log(
    dataframe=df,
    schema=arize_logger.Schema(
        prediction_label_column_name="prediction_label",
        prediction_score_column_name="prediction_score",
        actual_label_column_name="actual_label",
        feature_column_names=["feature_1"],
    ),
    model_id="fraud-v2",
    model_type=ModelTypes.SCORE_CATEGORICAL,
    environment=Environments.PRODUCTION,
)
```

---

## 15. LLM APIs

Managed APIs for large language model inference.

### OpenAI API

- **Vendor:** OpenAI
- **Description:** GPT-4o, GPT-4, GPT-3.5-turbo, o1, o3. Function calling, vision, audio, structured outputs, fine-tuning.
- **Pricing:** GPT-4o: $2.50/M input, $10/M output. GPT-4o-mini: $0.15/M input, $0.60/M output. GPT-4.1: $2/M input, $8/M output. o3: $2/M input, $8/M output.

```python
from openai import OpenAI
from pydantic import BaseModel

client = OpenAI(api_key="sk-...")

# Chat completion
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful coding assistant."},
        {"role": "user", "content": "Write a Python function to find prime numbers."},
    ],
    temperature=0.7, max_tokens=1024,
)
print(response.choices[0].message.content)

# Function calling
tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get weather for a location",
        "parameters": {
            "type": "object",
            "properties": {"location": {"type": "string"}},
            "required": ["location"],
        },
    },
}]
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}],
    tools=tools, tool_choice="auto",
)

# Structured output
class Analysis(BaseModel):
    sentiment: str
    confidence: float
    key_topics: list[str]

response = client.beta.chat.completions.parse(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Analyze: 'AI is transforming healthcare.'"}],
    response_format=Analysis,
)
analysis = response.choices[0].message.parsed
```

### Anthropic Claude

- **Vendor:** Anthropic
- **Description:** Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku. Extended thinking, computer use, PDF/image understanding, tool use.
- **Pricing:** Claude 3.5 Sonnet: $3/M input, $15/M output. Claude 3.5 Haiku: $0.80/M input, $4/M output. Opus 4: $15/M input, $75/M output.

```python
import anthropic

client = anthropic.Anthropic(api_key="sk-ant-...")

response = client.messages.create(
    model="claude-sonnet-4-20250514", max_tokens=1024,
    system="You are a helpful assistant.",
    messages=[{"role": "user", "content": "Explain the transformer architecture briefly."}],
)
print(response.content[0].text)

# Extended thinking
response = client.messages.create(
    model="claude-sonnet-4-20250514", max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "Solve: 60mph for 2.5hrs then 80mph for 1.5hrs?"}],
)
for block in response.content:
    if block.type == "thinking":
        print(f"Thinking: {block.thinking}")
    elif block.type == "text":
        print(f"Answer: {block.text}")
```

### Google Gemini

- **Vendor:** Google
- **Description:** Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 2.0 Flash. Multi-modal, long context (1M tokens), grounding with Google Search.
- **Pricing:** Gemini 1.5 Pro: $1.25/M input, $5/M output. Flash: $0.075/M input, $0.30/M output. 2.0 Flash: $0.10/M input, $0.40/M output.

```python
import google.generativeai as genai
from PIL import Image

genai.configure(api_key="YOUR_API_KEY")
model = genai.GenerativeModel("gemini-1.5-pro")

response = model.generate_content("Explain transformers vs RNNs in 3 bullets.",
    generation_config=genai.GenerationConfig(max_output_tokens=256, temperature=0.7))
print(response.text)

# Multi-modal
img = Image.open("chart.png")
response = model.generate_content(["Describe this chart.", img])

# Streaming
for chunk in model.generate_content("Write a haiku about ML.", stream=True):
    print(chunk.text, end="", flush=True)
```

### Other LLM APIs

| Provider | Model | Input (per 1M tokens) | Output (per 1M tokens) |
|----------|-------|----------------------|----------------------|
| Cohere | Command R+ | $2.50 | $10.00 |
| Cohere | Command R | $0.15 | $0.60 |
| Mistral | Large | $2.00 | $6.00 |
| Mistral | Small | $0.10 | $0.30 |
| Together AI | Llama 3.1 405B | $3.00 | $3.00 |
| Together AI | Mixtral 8x22B | $0.90 | $0.90 |
| Groq | Llama 3.1 70B | $0.59 | $0.79 |
| Groq | Mixtral 8x7B | $0.24 | $0.24 |
| Fireworks | Llama 3.1 405B | $3.00 | $3.00 |
| Deepseek | DeepSeek-V3 | $0.27 | $1.10 |
| xAI | Grok-2 | $2.00 | $10.00 |

```python
# Unified interface with LiteLLM
import litellm
import os

os.environ["OPENAI_API_KEY"] = "sk-..."
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-..."

response = litellm.completion(model="gpt-4o", messages=[{"role": "user", "content": "Hello!"}])
response = litellm.completion(model="anthropic/claude-sonnet-4-20250514", messages=[{"role": "user", "content": "Hello!"}])
response = litellm.completion(model="vertex_ai/gemini-1.5-pro", messages=[{"role": "user", "content": "Hello!"}])
```

---

## 16. Embedding APIs

Services that convert text into dense vector representations for semantic search and RAG.

### OpenAI Embeddings

- **Vendor:** OpenAI
- **Description:** text-embedding-3-small and text-embedding-3-large. Dimension reduction support.
- **Pricing:** text-embedding-3-small: $0.02/M tokens. text-embedding-3-large: $0.13/M tokens.

```python
from openai import OpenAI
import numpy as np

client = OpenAI(api_key="sk-...")

response = client.embeddings.create(
    model="text-embedding-3-large", input="The quick brown fox jumps over the lazy dog.",
    dimensions=1024,
)
embedding = response.data[0].embedding

# Batch embeddings
texts = ["ML is a subset of AI.", "Deep learning uses neural networks.", "NLP processes text."]
response = client.embeddings.create(model="text-embedding-3-small", input=texts)
embeddings = [item.embedding for item in response.data]

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

for i, emb in enumerate(embeddings):
    sim = cosine_similarity(embeddings[0], emb)
    print(f"Similarity(texts[0], texts[{i}]): {sim:.4f}")
```

### Cohere Embeddings

- **Vendor:** Cohere
- **Description:** embed-v4.0. Supports search_document, search_query, classification, clustering input types. Multilingual.
- **Pricing:** $0.10/M tokens. 512 tokens max input.

```python
import cohere

co = cohere.ClientV2(api_key="YOUR_API_KEY")

response = co.embed(
    texts=["What is ML?", "How does deep learning work?"],
    model="embed-v4.0", input_type="search_document", embedding_types=["float"],
)
print(f"Dimensions: {len(response.embeddings.float_[0])}")
```

### Voyage AI Embeddings

- **Vendor:** Voyage AI
- **Description:** voyage-3, voyage-code-3. Optimized for code search and long documents. 32K token context.
- **Pricing:** voyage-3: $0.06/M tokens. voyage-3-lite: $0.02/M tokens.

```python
from voyageai import Client

vo = Client(api_key="YOUR_API_KEY")
result = vo.embed(
    texts=["def fibonacci(n): return n if n <= 1 else fibonacci(n-1) + fibonacci(n-2)"],
    model="voyage-code-3", input_type="document",
)
print(f"Dimensions: {len(result.embeddings[0])}")
```

---

## 17. Speech-to-Text

Convert audio and video into text transcripts.

### Amazon Transcribe

- **Vendor:** AWS
- **Description:** ASR with real-time streaming, batch transcription, custom vocabularies, medical transcription, speaker diarization.
- **Pricing:** Standard: $0.024/min. Medical: $0.0175/min. Free tier: 60 min/month for 12 months.

```python
import boto3

transcribe = boto3.client("transcribe")

transcribe.start_transcription_job(
    TranscriptionJobName="meeting-001",
    Media={"MediaFileUri": "s3://my-bucket/audio/meeting-001.wav"},
    LanguageCode="en-US",
    OutputBucketName="my-bucket",
    Settings={"ShowSpeakerLabels": True, "MaxSpeakerLabels": 4},
)

transcribe.create_vocabulary(
    VocabularyName="ml-terms", LanguageCode="en-US",
    Phrases=["transformer", "self-attention", "backpropagation"],
)
```

### Deepgram

- **Vendor:** Deepgram
- **Description:** Fast, accurate STT. Nova-2 model. Diarization, summarization, topic detection, sentiment analysis.
- **Pricing:** Free tier: $200 credit (~12,500 min). Growth: from $0.0059/min.

```python
from deepgram import DeepgramClient, PrerecordedOptions

client = DeepgramClient("YOUR_API_KEY")

with open("audio.wav", "rb") as audio:
    source = {"buffer": audio, "mimetype": "audio/wav"}
    options = PrerecordedOptions(model="nova-2", smart_format=True, diarize=True,
                                 summarize=True, topics=True, sentiment=True)
    response = client.listen.rest.v("1").transcribe_file(source, options)
    print(response["results"]["channels"][0]["alternatives"][0]["transcript"])
```

### AssemblyAI

- **Vendor:** AssemblyAI
- **Description:** STT with LeMUR for audio LLM processing. Auto-chapters, content moderation, entity detection.
- **Pricing:** Standard: $0.015/min. Premium: $0.035/min. Free trial: $100 credit.

```python
import assemblyai as aai

aai.api_key = "YOUR_API_KEY"

config = aai.TranscriptionConfig(
    audio_url="https://example.com/podcast.mp3",
    model=aai.TranscriptionModel.best,
    speaker_labels=True, auto_chapters=True, content_safety=True,
    summarization=True, summary_type=aai.SummarizeType.bullets,
)

transcript = aai.Transcriber().transcribe(config)
print(f"Summary: {transcript.summary}")

result = transcript.lemur.answer(
    questions=["What are the main topics discussed?"],
    final_model=aai.LemurModel.claude3_5_sonnet,
)
```

### OpenAI Whisper

- **Vendor:** OpenAI (open source + API)
- **Description:** General-purpose speech recognition. 99 languages, translation, timestamps, word-level alignment.
- **Pricing:** API: $0.006/min. Self-hosted: GPU costs (~$1.50/hr A100, processes 1hr audio in ~30s).

```python
from openai import OpenAI

client = OpenAI(api_key="sk-...")

with open("audio.mp3", "rb") as audio:
    response = client.audio.transcriptions.create(
        model="whisper-1", file=audio, language="en",
        response_format="verbose_json",
        timestamp_granularities=["segment", "word"],
    )
    for seg in response.segments:
        print(f"[{seg['start']:.1f}s - {seg['end']:.1f}s] {seg['text']}")

# Self-hosted with faster-whisper
from faster_whisper import WhisperModel
model = WhisperModel("large-v3", device="cuda", compute_type="float16")
segments, info = model.transcribe("audio.mp3", beam_size=5)
for segment in segments:
    print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")
```

---

## 18. Text-to-Speech

Convert text into natural-sounding speech audio.

### Amazon Polly

- **Vendor:** AWS
- **Description:** Neural and standard TTS. SSML support, pronunciation lexicons, streaming, batch synthesis. 30+ languages, 60+ voices.
- **Pricing:** Standard: $4/M chars. Neural: $16/M chars. Free tier: 5M chars/month (standard), 1M chars/month (neural).

```python
import boto3
from contextlib import closing

polly = boto3.client("polly")

response = polly.synthesize_speech(
    Text="Welcome to the AI course.", VoiceId="Joanna",
    Engine="neural", OutputFormat="mp3", SampleRate="24000",
)

with closing(response["AudioStream"]) as stream:
    with open("output.mp3", "wb") as file:
        file.write(stream.read())

# SSML
response = polly.synthesize_speech(
    Text="<speak>Welcome to <emphasis level='strong'>AI</emphasis>. "
         "<break time='500ms'/> Today we cover transformers.</speak>",
    TextType="ssml", VoiceId="Matthew", Engine="neural", OutputFormat="mp3",
)
```

### ElevenLabs

- **Vendor:** ElevenLabs
- **Description:** Ultra-realistic AI voice. Voice cloning, multilingual, emotional speech. Audio books, dubbing, conversational AI.
- **Pricing:** Free: 10K chars/month. Starter: $5/month (30K). Creator: $22/month (100K). Pro: $99/month (500K).

```python
from elevenlabs.client import ElevenLabs

client = ElevenLabs(api_key="YOUR_API_KEY")

audio = client.generate(
    text="Welcome to this comprehensive course on artificial intelligence.",
    voice="Rachel", model="eleven_monolingual_v1",
)

with open("output.mp3", "wb") as f:
    for chunk in audio:
        f.write(chunk)

# Voice cloning
cloned_voice = client.clone(name="My Voice", files=["voice_sample.mp3"])
audio = client.generate(text="This is my cloned voice!", voice=cloned_voice)
```

### Google Cloud TTS

- **Vendor:** Google
- **Description:** WaveNet, Neural2, and Journey voices. SSML support, multi-speaker, Studio (premium) voices.
- **Pricing:** WaveNet/Neural2: $16/M chars. Standard: $4/M chars. Free tier: 1M chars/month.

```python
from google.cloud import texttospeech_v1 as tts

client = tts.TextToSpeechClient()

response = client.synthesize_speech(
    input=tts.SynthesisInput(text="Hello from Google Cloud Text-to-Speech!"),
    voice=tts.VoiceSelectionParams(
        language_code="en-US", name="en-US-Neural2-F",
        ssml_gender=tts.SsmlVoiceGender.FEMALE,
    ),
    audio_config=tts.AudioConfig(audio_encoding=tts.AudioEncoding.MP3),
)

with open("output.mp3", "wb") as f:
    f.write(response.audio_content)
```

---

## 19. Image Generation

AI-powered image creation from text prompts.

### DALL-E 3 (OpenAI)

- **Vendor:** OpenAI
- **Description:** Text-to-image generation. HD, standard, natural quality. Specific sizes and content moderation.
- **Pricing:** Standard 1024x1024: $0.040/image. HD 1024x1024: $0.080/image. HD 1792x1024: $0.120/image.

```python
from openai import OpenAI

client = OpenAI(api_key="sk-...")

response = client.images.generate(
    model="dall-e-3",
    prompt="A futuristic AI lab with holographic neural network displays, cinematic lighting",
    size="1792x1024", quality="hd", n=1,
)
print(f"Generated: {response.data[0].url}")

# Edit existing image
response = client.images.edit(
    model="dall-e-2",
    image=open("original.png", "rb"), mask=open("mask.png", "rb"),
    prompt="Add a robot at the desk", n=1,
)
```

### Stable Diffusion

- **Vendor:** Stability AI (open source)
- **Description:** Open-source text-to-image. SDXL, SD 3.0. Run locally or via API. Extensive community ecosystem.
- **Pricing:** Self-hosted: GPU costs only (~$1.50/hr A100, ~500 images/hr). Stability API: $0.002-0.065/image.

```python
import torch
from diffusers import StableDiffusionXLPipeline, DPMSolverMultistepScheduler

pipe = StableDiffusionXLPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0",
    torch_dtype=torch.float16, variant="fp16",
).to("cuda")

pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config)

image = pipe(
    prompt="A serene mountain landscape at sunset, oil painting",
    negative_prompt="blurry, low quality, distorted",
    num_inference_steps=30, guidance_scale=7.5, width=1024, height=1024,
).images[0]
image.save("generated.png")
```

---

## 20. Video AI

AI-powered video generation, editing, and analysis.

### Runway Gen-3

- **Vendor:** Runway
- **Description:** AI video generation (text-to-video, image-to-video). Gen-3 Alpha for high-quality temporal consistency.
- **Pricing:** Free: 125 credits. Standard: $12/month. Pro: $28/month. Unlimited: $76/month.

```python
from runwayml import RunwayML

client = RunwayML(api_key="YOUR_API_KEY")

task = client.image_to_video.create(
    model="gen3a_turbo",
    promptImage=open("reference.png", "rb"),
    promptText="Camera slowly zooms in, atmospheric lighting",
    duration=10, ratio="16:9",
)
result = task.wait()
print(f"Video URL: {result.output[0]}")
```

### Synthesia

- **Vendor:** Synthesia
- **Description:** AI video with digital avatars. Professional videos in 120+ languages. Templates and custom avatars.
- **Pricing:** Starter: $18/month. Enterprise: custom.

```python
import requests

response = requests.post(
    "https://api.synthesia.io/v1/videos",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "title": "AI Training Module",
        "script": [{"actor": "anna_costume_1_front_1080p",
                     "scriptText": "Welcome to our AI training module."}],
        "test": True,
    },
)
```

### HeyGen

- **Vendor:** HeyGen
- **Description:** AI video with avatars, voice cloning, lip-syncing. Video translation and localization.
- **Pricing:** Free: 1 credit/min. Essentials: $24/month. Business: $72/month.

```python
import requests

response = requests.post(
    "https://api.heygen.com/v2/video/generate",
    headers={"X-Api-Key": "YOUR_API_KEY"},
    json={
        "video_inputs": [{
            "character": {"type": "avatar", "avatar_id": "your-avatar-id"},
            "voice": {"type": "text", "input_text": "Welcome to our demo.", "voice_id": "your-voice-id"},
        }],
        "dimension": {"width": 1920, "height": 1080},
    },
)
```

---

## 21. Search & RAG

Search engines and retrieval systems for building RAG applications.

### Elasticsearch / OpenSearch

- **Vendor:** Elastic / AWS (OpenSearch)
- **Description:** Distributed search with vector search (kNN), full-text search, aggregations, ML inference pipelines. Foundation of many RAG systems.
- **Pricing:** Elastic Cloud: Free trial (14 days). Standard: from $95/month. OpenSearch: t3.small from $0.0365/hr.

```python
from elasticsearch import Elasticsearch

es = Elasticsearch("https://my-cluster.es.us-east-1.aws.found.io:443", api_key="YOUR_KEY")

# Create index with dense_vector
es.indices.create(index="documents", body={
    "mappings": {"properties": {
        "title": {"type": "text"}, "content": {"type": "text"},
        "embedding": {"type": "dense_vector", "dims": 1536, "index": True, "similarity": "cosine"},
    }}
})

# Hybrid search (kNN + full-text)
results = es.search(index="documents", body={
    "query": {"bool": {"must": [{"match": {"content": "attention mechanism"}}],
                        "filter": [{"term": {"metadata.source": "paper"}}]}},
    "knn": {"field": "embedding", "query_vector": [0.1]*1536, "k": 5, "num_candidates": 50},
})
```

### Typesense

- **Vendor:** Typesense Inc.
- **Description:** Open-source, typo-tolerant search. Fast setup, instant search, vector search, AI semantic search.
- **Pricing:** Free tier: 50K docs, 500MB. Standard: from $20/month.

```python
import typesense

client = typesense.Client({
    "nodes": [{"host": "xyz-abc.a.typesense.net", "port": "443", "protocol": "https"}],
    "api_key": "YOUR_API_KEY", "connection_timeout_seconds": 3,
})

client.collections.create({
    "name": "articles",
    "fields": [
        {"name": "title", "type": "string"},
        {"name": "embedding", "type": "float[]", "num_dim": 1536, "optional": True},
    ],
})

results = client.collections["articles"].documents.search({
    "q": "retrieval augmnted generation",
    "query_by": "title,content,embedding",
    "vector_query": "embedding:([0.1]*1536)",
})
```

---

## 22. Auth for AI

Authentication and authorization for AI APIs and services.

### Auth0

- **Vendor:** Okta
- **Description:** Identity platform with OAuth 2.0, OIDC, SAML, MFA. JWT validation and rate limiting.
- **Pricing:** Free: 7,500 users. Essential: $35/month. Professional: $240/month.

```python
import jwt
from fastapi import FastAPI, Depends
from fastapi.security import HTTPBearer

app = FastAPI()
security = HTTPBearer()

@app.get("/api/inference")
async def inference(prompt: str, token=Depends(security)):
    payload = jwt.decode(
        token.credentials, key="YOUR_JWKS_URL",
        audience="https://api.example.com",
        issuer="https://your-domain.auth0.com/",
        algorithms=["RS256"],
    )
    return {"user": payload["sub"], "result": f"Processed: {prompt}"}
```

### OAuth 2.0 + JWT (DIY)

- **Vendor:** Standard (RFC 6749, 7519)
- **Description:** OAuth 2.0 for authorization, JWT for stateless tokens. Foundation of modern API auth.

```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import jwt
from datetime import datetime, timedelta

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "your-secret-key"

def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=1)):
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + expires_delta
    to_encode["iss"] = "https://my-api.com"
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")

async def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"],
                             audience="https://my-api.com/inference")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")

@app.post("/inference")
async def inference(prompt: str, user=Depends(verify_token)):
    return {"user": user["sub"], "result": f"Processed: {prompt}"}
```

---

## 23. CDN & Edge AI

Run AI inference at the edge for low-latency global access.

### Cloudflare Workers AI

- **Vendor:** Cloudflare
- **Description:** ML models on Cloudflare's global edge. LLMs (Llama, Gemma), embeddings, image classification, speech recognition.
- **Pricing:** 10,000 neurons/day free. Paid: $0.011/1000 neurons. Workers: 10M requests/day free.

```javascript
export default {
  async fetch(request, env) {
    const { prompt } = await request.json();

    const response = await env.AI.run(
      '@cf/meta/llama-3.1-8b-instruct',
      { messages: [{ role: 'user', content: prompt }], max_tokens: 256 }
    );

    return new Response(JSON.stringify({ text: response.response }), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
```

### Fastly Compute@Edge

- **Vendor:** Fastly
- **Description:** Edge computing platform. WASM-based. ML inference with ONNX Runtime.
- **Pricing:** Free: 100K requests/day. Pay-as-you-go: $0.60/M requests.

---

## 24. Databases

Databases commonly used in AI/ML systems.

### PostgreSQL + pgvector

- **Vendor:** PostgreSQL (open source)
- **Description:** Advanced RDBMS with pgvector extension. Combine structured data and embeddings in one database.
- **Pricing:** Self-hosted: free. Supabase: Free (500MB DB). Pro $25/month. RDS: from $0.017/hr.

```python
import psycopg2
from psycopg2.extras import execute_values

conn = psycopg2.connect("postgresql://user:pass@localhost:5432/mydb")
cur = conn.cursor()

cur.execute("CREATE EXTENSION IF NOT EXISTS vector")
cur.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        embedding VECTOR(1536),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
    )
""")

cur.execute("""
    CREATE INDEX ON documents
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64)
""")

# Similarity search
cur.execute("""
    SELECT title, embedding <=> %s::vector AS distance
    FROM documents ORDER BY distance LIMIT 5
""", ("[0.15]*1536",))
```

### Redis

- **Vendor:** Redis Ltd.
- **Description:** In-memory data store. Sub-millisecond latency. Vector search (RediSearch), caching, pub/sub, time series.
- **Pricing:** Free: 30MB. Essentials: from $5/month. Self-hosted: free.

```python
import redis
from redis.commands.search.field import VectorField, TextField
from redis.commands.search.indexDefinition import IndexDefinition

r = redis.Redis(host="localhost", port=6379, decode_responses=True)

r.ft("docs").create_index([
    TextField("title"), TextField("content"),
    VectorField("embedding", "FLAT",
                {"TYPE": "FLOAT32", "DIM": 1536, "DISTANCE_METRIC": "COSINE"}),
], definition=IndexDefinition(prefix=["doc:"]))

r.hset("doc:1", mapping={"title": "AI Overview", "content": "AI is transforming"})
r.setex("user:features:u123", 300, '{"avg_txn": 150}')
```

### MongoDB

- **Vendor:** MongoDB Inc.
- **Description:** Document database with Atlas Vector Search. Flexible schema, aggregation pipeline, multi-document transactions.
- **Pricing:** Free: 512MB. M10: from $57/month. Serverless: pay-per-use.

```python
from pymongo import MongoClient

client = MongoClient("mongodb+srv://user:pass@cluster.mongodb.net/")
db = client["ml_db"]
collection = db["documents"]

collection.insert_one({
    "title": "AI Overview", "content": "AI transforms industries",
    "embedding": [0.1] * 1536, "metadata": {"source": "wiki"},
})

results = collection.aggregate([
    {"$vectorSearch": {
        "index": "vector_idx", "path": "embedding",
        "queryVector": [0.1] * 1536, "numCandidates": 100, "limit": 5,
    }},
    {"$project": {"title": 1, "score": {"$meta": "vectorSearchScore"}}},
])
```

### Supabase

- **Vendor:** Supabase
- **Description:** Open-source Firebase alternative. PostgreSQL, auth, storage, edge functions, vector search. Real-time subscriptions.
- **Pricing:** Free: 500MB DB, 1GB storage. Pro: $25/month. Team: $599/month.

```python
from supabase import create_client

supabase = create_client("https://xyz.supabase.co", "YOUR_ANON_KEY")

supabase.table("documents").insert({
    "title": "AI Course Notes", "content": "Intro to ML...",
    "embedding": [0.1] * 1536,
}).execute()

results = supabase.rpc("match_documents",
    {"query_embedding": [0.1] * 1536, "match_count": 5}).execute()
print(results.data)
```

---

## 25. Low-Code AI

Visual tools for building AI workflows without extensive coding.

### Dify

- **Vendor:** Dify.AI (open source)
- **Description:** Open-source LLM app platform. Visual workflow builder, RAG pipeline, agent framework, model management.
- **Pricing:** Open source: free. Cloud Free: 200 msgs/day. Professional: $59/month.

```yaml
version: "3.8"
services:
  api:
    image: langgenius/dify-api:latest
    environment:
      - SECRET_KEY=your-secret-key
      - DB_USERNAME=postgres
    depends_on: [db, redis]
  web:
    image: langgenius/dify-web:latest
  db:
    image: postgres:15-alpine
    volumes: [pgdata:/var/lib/postgresql/data]
  redis:
    image: redis:7-alpine
volumes:
  pgdata:
```

### Flowise

- **Vendor:** FlowiseAI (open source)
- **Description:** Drag-and-drop UI for LLM chains and agents. LangChain-based. Embeddable chat widget.
- **Pricing:** Open source: free. Cloud Starter: $39/month.

```bash
npm install -g flowise
flowise start --port 3000

# Or Docker
docker run -d -p 3000:3000 flowiseai/flowise
```

### Langflow

- **Vendor:** DataStax
- **Description:** Visual framework for building multi-agent and RAG apps. Drag-and-drop components, Python code integration.
- **Pricing:** Open source: free. DataStax Cloud: free tier, pay-as-you-go.

```bash
pip install langflow
langflow run --port 7860

# API to run flow
curl -X POST "http://localhost:7860/api/v1/run/flow-id" \
  -H "Content-Type: application/json" \
  -d '{"input_value": "What are benefits of RAG?", "output_type": "chat"}'
```

### Make.com (formerly Integromat)

- **Vendor:** Make
- **Description:** Visual automation platform. Connect AI APIs with 1,000+ apps. No-code AI workflows.
- **Pricing:** Free: 1,000 ops/month. Core: $9/month (10K ops). Pro: $16/month.

---

## 26. AI IDEs

AI-powered code editors and coding assistants.

### Cursor

- **Vendor:** Cursor Inc.
- **Description:** AI-first code editor on VS Code. Tab completion, chat, Composer (multi-file edits), codebase understanding.
- **Pricing:** Free: 200 completions, 50 premium/month. Pro: $20/month. Business: $40/month.

```
# Cursor features:
# Tab: Autocomplete entire functions
# Cmd+K: Edit code with natural language
# Cmd+L: Chat with codebase
# Cmd+I: Composer - multi-file edits
# @-mentions: Reference files, docs, codebase, web
```

### GitHub Copilot

- **Vendor:** GitHub / Microsoft
- **Description:** AI pair programmer. Inline suggestions, chat, Copilot Workspace. Multiple IDE support.
- **Pricing:** Free: 2K completions, 50 chats/month. Pro: $10/month. Business: $19/user/month.

```python
# In VS Code, type comments to trigger suggestions:
def calculate_risk_score(transaction_amount, user_history):
    # Calculate risk score based on amount and history patterns
    # Copilot suggests implementation
```

### Continue.dev

- **Vendor:** Continue (open source)
- **Description:** Open-source AI code assistant. Connect to any LLM (local or API). Custom slash commands.
- **Pricing:** Free (open source). BYOLM.

```json
{
  "models": [
    {
      "title": "Claude 3.5 Sonnet",
      "provider": "anthropic",
      "model": "claude-sonnet-4-20250514",
      "apiKey": "YOUR_API_KEY"
    },
    {
      "title": "Local Llama",
      "provider": "ollama",
      "model": "llama3.1:8b",
      "apiBase": "http://localhost:11434"
    }
  ],
  "customCommands": [
    {
      "name": "review",
      "description": "Review selected code for bugs",
      "prompt": "Review this code for bugs and improvements:\n\n{{ input }}"
    }
  ]
}
```

---

## 27. Prompt Management

Tools for versioning, testing, and managing LLM prompts.

### LangSmith

- **Vendor:** LangChain
- **Description:** Debugging, testing, evaluating, monitoring LLM apps. Traces, datasets, evaluations, prompt hub.
- **Pricing:** Free: 5K traces/month. Plus: $39/month (10K). Enterprise: custom.

```python
from langsmith import Client
from langsmith.evaluation import evaluate
import langsmith

client = Client(api_key="YOUR_API_KEY")

dataset = client.create_dataset(name="qa-test-dataset")
client.create_examples(dataset_id=dataset.id, examples=[
    {"inputs": {"question": "What is ML?"}, "outputs": {"answer": "AI subset that learns from data."}},
])

@langsmith.traceable
def qa_system(inputs):
    from openai import OpenAI
    oai = OpenAI()
    response = oai.chat.completions.create(
        model="gpt-4o-mini", messages=[{"role": "user", "content": inputs["question"]}])
    return {"output": response.choices[0].message.content}

def qa_evaluator(run, example):
    score = 1.0 if "answer" in run.outputs.get("output", "").lower() else 0.0
    return {"key": "correctness", "score": score}

results = evaluate(qa_system, data="qa-test-dataset", evaluators=[qa_evaluator])
```

### PromptLayer

- **Vendor:** PromptLayer
- **Description:** Prompt management and observability. Version control prompts, track usage. OpenAI middleware.
- **Pricing:** Free: 1K requests/month. Starter: $20/month (50K). Growth: $100/month.

```python
import promptlayer

pl = promptlayer.OpenAI(api_key="sk-...")

# Versioned prompt
response = pl.ChatCompletion.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}],
    pl_tags=["v2", "greeting"],
)
```

### Braintrust

- **Vendor:** Braintrust
- **Description:** AI product platform. Prompt playground, evaluation, logging, and fine-tuning. Unified dev loop.
- **Pricing:** Free tier available. Pro: $99/month. Enterprise: custom.

```python
import braintrust

client = braintrust.Client(api_key="YOUR_API_KEY")

experiment = client.start_experiment(
    project="qa-system",
    experiment="v1-prompt-test",
)

def evaluate_sample(input):
    response = client.completion(model="gpt-4o", prompt=input["question"])
    return response

experiment.log_eval(
    name="qa-accuracy",
    samples=[{"question": "What is ML?"}, {"question": "What is NLP?"}],
    eval_fn=lambda sample, output: 1.0 if len(output) > 10 else 0.0,
    func=evaluate_sample,
)
experiment.end()
```

---

## 28. Evaluation

Frameworks and benchmarks for evaluating LLM quality and ML model performance.

### DeepEval

- **Vendor:** Confident AI (open source)
- **Description:** Open-source LLM evaluation framework. Hallucination detection, answer relevancy, faithfulness, RAGAS-style metrics.
- **Pricing:** Open source: free. Confident AI platform: free tier, paid plans.

```python
from deepeval import evaluate
from deepeval.metrics import AnswerRelevancyMetric, FaithfulnessMetric
from deepeval.test_case import LLMTestCase

answer_relevancy = AnswerRelevancyMetric(threshold=0.7)
faithfulness = FaithfulnessMetric(threshold=0.8)

test_case = LLMTestCase(
    input="What is machine learning?",
    actual_output="ML is a subset of AI that learns patterns from data to make predictions.",
    retrieval_context=["ML is a branch of AI...", "Patterns in data..."],
)

result_relevancy = evaluate(test_case, [answer_relevancy])
result_faithfulness = evaluate(test_case, [faithfulness])
print(f"Relevancy: {result_relevancy}, Faithfulness: {result_faithfulness}")
```

### Ragas

- **Vendor:** Exploding Gradients (open source)
- **Description:** RAG evaluation framework. Measures context precision, recall, relevancy, faithfulness against ground truth.
- **Pricing:** Open source: free.

```python
from ragas import evaluate
from ragas.metrics import (
    faithfulness, answer_relevancy, context_precision, context_recall,
)
from datasets import Dataset

# Prepare evaluation dataset
eval_data = Dataset.from_dict({
    "question": ["What is ML?"],
    "answer": ["ML learns from data."],
    "contexts": [["ML is a subset of AI..."]],
    "ground_truth": ["Machine learning is a subset of AI."],
})

result = evaluate(
    dataset=eval_data,
    metrics=[faithfulness, answer_relevancy, context_precision, context_recall],
)
print(result.to_pandas())
```

### lm-eval-harness (EleutherAI)

- **Vendor:** EleutherAI (open source)
- **Description:** Framework for evaluating LLMs across many benchmarks. MMLU, HellaSwag, ARC, GSM8K, HumanEval, and more.
- **Pricing:** Open source: free.

```bash
# Install and run MMLU evaluation
pip install lm-eval

lm_eval --model hf \
  --model_args pretrained=meta-llama/Llama-3.1-8B-Instruct \
  --tasks mmlu,arc_challenge,hellaswag,gsm8k \
  --batch_size 8 \
  --output_path ./results/ \
  --num_fewshot 5

# Run HumanEval for code generation
lm_eval --model hf \
  --model_args pretrained=meta-llama/Llama-3.1-8B-Instruct \
  --tasks humaneval \
  --batch_size 4
```

### MMLU (Massive Multitask Language Understanding)

- **Vendor:** Standard benchmark
- **Description:** 57 subjects across STEM, humanities, social sciences. Tests world knowledge and problem solving. 14K+ multiple choice questions.
- **Scoring:** Typically reported as accuracy (%). GPT-4: ~86%. Claude 3.5 Sonnet: ~88%. Llama 3.1 70B: ~79%.

### HumanEval

- **Vendor:** OpenAI
- **Description:** Code generation benchmark. 164 Python programming problems with test cases. Measures functional correctness.
- **Scoring:** pass@k metric (probability of generating correct solution in k attempts). GPT-4: ~67% pass@1.

---

## 29. Cost Optimization

Strategies to reduce ML inference and training costs.

### Spot / Preemptible Instances

- **Vendor:** All clouds
- **Description:** Use discounted spare compute capacity for fault-tolerant workloads (training, batch processing).
- **Savings:** AWS Spot: 60-90% off on-demand. GCP Preemptible: 60-79% off. Azure Spot: up to 90% off.

```bash
# AWS Spot instance for training
aws ec2 run-instances \
  --instance-type p4d.24xlarge \
  --instance-market-options '{"MarketType":"spot","SpotOptions":{"MaxPrice":"10","SpotInstanceType":"one-time","BlockDurationMinutes":240}}' \
  --image-id ami-xxx \
  --key-name my-key

# Checkpoint regularly for spot interruptions
# Save model checkpoints every N steps to S3
# Resume training from last checkpoint on interruption
```

### Quantization

Reduce model precision (FP32 -> INT8/INT4) for faster inference and lower memory.

```python
# BitsAndBytes quantization with HuggingFace
from transformers import AutoModelForCausalLM, BitsAndBytesConfig
import torch

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
)

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3.1-70B-Instruct",
    quantization_config=bnb_config,
    device_map="auto",
)
# ~70B model fits on single A100 80GB with 4-bit quantization
# Speed: ~2-3x faster than FP16 for inference

# GGUF quantization for llama.cpp
# llama.cpp supports Q4_K_M, Q5_K_M, Q8_0 etc.
# Run quantized model locally:
# ./llama-server -m model-Q4_K_M.gguf --host 0.0.0.0 --port 8080
```

### Batch Inference

Process requests in batches for throughput efficiency.

```python
from openai import OpenAI

client = OpenAI()

# Instead of N individual API calls:
prompts = ["Summarize doc 1", "Summarize doc 2", "Summarize doc 3"]

# Batch processing with Batches API (50% cost savings)
batch_file = client.batches.create_batch_file(file=open("batch_input.jsonl", "rb"))
batch = client.batches.create(input_file_id=batch_file.id, endpoint="/v1/chat/completions",
                               completion_window="24h")

# Or manual batching with async
import asyncio
from anthropic import AsyncAnthropic

async_client = AsyncAnthropic(api_key="sk-ant-...")

async def process_batch(prompts, batch_size=50):
    results = []
    for i in range(0, len(prompts), batch_size):
        batch = prompts[i:i+batch_size]
        tasks = [async_client.messages.create(
            model="claude-3-5-haiku-20241022", max_tokens=256,
            messages=[{"role": "user", "content": p}]
        ) for p in batch]
        batch_results = await asyncio.gather(*tasks)
        results.extend(batch_results)
    return results
```

### Caching

Cache LLM responses to avoid redundant API calls.

```python
import hashlib
import json
import redis

r = redis.Redis(host="localhost", port=6379)

def cached_completion(prompt, model="gpt-4o-mini", ttl=3600):
    cache_key = hashlib.md5(f"{model}:{prompt}".encode()).hexdigest()

    cached = r.get(cache_key)
    if cached:
        return json.loads(cached)

    response = client.chat.completions.create(
        model=model, messages=[{"role": "user", "content": prompt}])
    result = {"text": response.choices[0].message.content, "usage": response.usage.model_dump()}

    r.setex(cache_key, ttl, json.dumps(result))
    return result

# Semantic caching (match similar prompts)
from sentence_transformers import SentenceTransformer
import numpy as np

encoder = SentenceTransformer("all-MiniLM-L6-v2")

def semantic_cached_completion(prompt, threshold=0.95):
    prompt_embedding = encoder.encode(prompt)

    # Search Redis for similar cached prompts
    # Store embeddings with prompts, compute cosine similarity
    # Return cache hit if similarity > threshold
```

---

## 30. Compliance & Governance

Ensuring AI systems meet regulatory, ethical, and organizational standards.

### Model Cards

Document models for transparency and accountability.

```yaml
# model_card.yaml
model:
  name: "fraud-detection-v3"
  version: "3.2.1"
  type: "classification"
  framework: "scikit-learn"
  date: "2024-01-15"

intended_use:
  primary: "Credit card fraud detection"
  out_of_scope: ["Identity verification", "Money laundering"]

training_data:
  source: "Internal transaction logs"
  period: "2022-01 to 2023-12"
  size: "10M transactions"
  demographics: "Global users, 18+"

evaluation:
  metrics:
    accuracy: 0.987
    precision: 0.923
    recall: 0.891
    f1: 0.907
    auc_roc: 0.964
  test_data: "Holdout set: 2M transactions, Q1 2024"

ethical_considerations:
  - "May have higher false positive rates for new accounts"
  - "Regular retraining required to address concept drift"
  - "Human review required for transactions > $10,000"

limitations:
  - "Not suitable for cryptocurrency transactions"
  - "Performance degrades for transactions outside trained geographic regions"

contact:
  team: "ml-ops@company.com"
  owner: "Risk Engineering"
```

### Data Lineage

Track data origin, transformations, and usage throughout the ML pipeline.

```python
# Using OpenLineage for data lineage tracking
from openlineage.client import OpenLineageClient
from openlineage.client.run import RunEvent, RunState, Job, Run
from datetime import datetime
import uuid

client = OpenLineageClient(url="http://lineage:5000")

job = Job(
    namespace="production",
    name="fraud_detection_training",
    facets={},
)

run = Run(runId=str(uuid.uuid4()), facets={})

# Emit START event
client.emit(RunEvent(
    eventType=RunState.START,
    eventTime=datetime.now().isoformat(),
    run=run,
    job=job,
    inputs=[{
        "namespace": "s3://my-bucket",
        "name": "transactions/2024-01",
        "facets": {"schema": {"fields": ["id", "amount", "user_id"]}},
    }],
    outputs=[{
        "namespace": "s3://my-bucket",
        "name": "models/fraud-v3",
    }],
))

# Emit COMPLETE event with run stats
client.emit(RunEvent(
    eventType=RunState.COMPLETE,
    eventTime=datetime.now().isoformat(),
    run=Run(runId=run.runId, facets={
        "provenance": {"processingEngine": {"name": "spark", "version": "3.5"}},
    }),
    job=job,
))
```

### ML Metadata with MLflow

```python
import mlflow

# Automatic lineage tracking
with mlflow.start_run(run_name="production-deploy"):
    # Log input dataset
    mlflow.log_input(mlflow.data.from_numpy(X_train, source="s3://data/train.parquet"),
                     context="training")

    # Train
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X_train, y_train)

    # Log output
    mlflow.sklearn.log_model(model, "model")
    mlflow.set_tag("git_commit", "abc123def")
    mlflow.set_tag("training_framework", "sklearn")
    mlflow.set_tag("data_version", "v2024-01-15")
```

### Audit Logging

```python
import logging
import json
from datetime import datetime

audit_logger = logging.getLogger("ml_audit")
handler = logging.FileHandler("audit_log.json")
audit_logger.addHandler(handler)
handler.setFormatter(logging.Formatter("%(message)s"))

class MLEventAuditor:
    def __init__(self, logger):
        self.logger = logger

    def log_prediction(self, user_id, model_id, prompt_hash, response_summary, latency_ms):
        self.logger.info(json.dumps({
            "event": "prediction",
            "timestamp": datetime.utcnow().isoformat(),
            "user_id": user_id,
            "model_id": model_id,
            "prompt_hash": prompt_hash,
            "response_summary": response_summary,
            "latency_ms": latency_ms,
            "compliance_flags": [],
        }))

    def log_access(self, user_id, resource, action, granted):
        self.logger.info(json.dumps({
            "event": "access",
            "timestamp": datetime.utcnow().isoformat(),
            "user_id": user_id,
            "resource": resource,
            "action": action,
            "granted": granted,
        }))

    def log_data_access(self, user_id, dataset, purpose, pii_present):
        self.logger.info(json.dumps({
            "event": "data_access",
            "timestamp": datetime.utcnow().isoformat(),
            "user_id": user_id,
            "dataset": dataset,
            "purpose": purpose,
            "pii_present": pii_present,
            "retention_days": 90,
        }))

auditor = MLEventAuditor(audit_logger)
auditor.log_prediction("user-123", "fraud-v3", "abc123", "legitimate", 45)
```

### GDPR Compliance

```python
# Data anonymization for ML training
import hashlib
from datetime import datetime, timedelta

class GDPRCompliance:
    def anonymize_user_id(self, user_id: str) -> str:
        """One-way hash for pseudonymization."""
        return hashlib.sha256(f"salt:{user_id}".encode()).hexdigest()[:16]

    def redact_pii(self, text: str) -> str:
        """Remove PII from text before logging."""
        import re
        # NRIC pattern (Singapore)
        text = re.sub(r'[STFG]\d{7}[A-Z]', '[REDACTED_NRIC]', text)
        # Email
        text = re.sub(r'[\w.-]+@[\w.-]+.\w+', '[REDACTED_EMAIL]', text)
        # Phone
        text = re.sub(r'\+?[\d\s-]{8,15}', '[REDACTED_PHONE]', text)
        # Credit card
        text = re.sub(r'\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}', '[REDACTED_CARD]', text)
        return text

    def handle_deletion_request(self, user_id: str):
        """Right to be forgotten - delete all user data."""
        anonymized = self.anonymize_user_id(user_id)
        # Delete from vector DB
        # Delete from feature store
        # Delete from model training data
        # Retrain affected models
        return {"status": "completed", "anonymized_id": anonymized}

    def export_user_data(self, user_id: str) -> dict:
        """Right to data portability."""
        return {
            "user_id": user_id,
            "predictions": [...],  # from audit logs
            "features": [...],     # from feature store
            "models_used": [...],  # from model registry
        }

gdpr = GDPRCompliance()
anonymized_id = gdpr.anonymize_user_id("S1234567A")
redacted = gdpr.redact_pii("Contact S1234567A at john@example.com, card 4111-1111-1111-1111")
```

### EU AI Act Compliance

```python
class EUAIActCompliance:
    RISK_LEVELS = {
        "unacceptable": "prohibited",
        "high": "requires_conformity_assessment",
        "limited": "transparency_obligations",
        "minimal": "no_specific_requirements",
    }

    def classify_risk(self, use_case: str) -> str:
        classifications = {
            "credit_scoring": "high",
            "hiring_screening": "high",
            "biometric_identification": "high",
            "chatbot": "limited",
            "spam_filter": "minimal",
            "fraud_detection": "high",
            "content_moderation": "limited",
        }
        return classifications.get(use_case, "minimal")

    def generate_conformity_assessment(self, model_info: dict) -> dict:
        return {
            "model_id": model_info["id"],
            "risk_level": self.classify_risk(model_info["use_case"]),
            "required_actions": [
                "Bias testing across protected groups",
                "Human oversight mechanisms",
                "Transparency documentation",
                "Performance monitoring",
                "Incident reporting system",
            ],
            "technical_documentation": {
                "training_data_description": model_info.get("data_desc"),
                "model_architecture": model_info.get("architecture"),
                "evaluation_results": model_info.get("metrics"),
                "known_limitations": model_info.get("limitations", []),
            },
            "conformity_mark": "CE",
            "review_date": "2024-07-01",
        }

eu_compliance = EUAIActCompliance()
assessment = eu_compliance.generate_conformity_assessment({
    "id": "fraud-v3", "use_case": "credit_scoring",
    "architecture": "RandomForest", "data_desc": "Transaction logs 2022-2024",
})
```

---

## Quick Reference Matrix

| Category | Top Pick (Managed) | Top Pick (Open Source) | Budget Pick |
|----------|-------------------|----------------------|-------------|
| **Cloud Platform** | SageMaker | MLflow + K8s | Google Colab |
| **LLM API** | OpenAI GPT-4o | Llama 3.1 (self-host) | Groq (ultra-fast) |
| **Vector DB** | Pinecone | Qdrant | ChromaDB |
| **Embeddings** | OpenAI emb-3-large | sentence-transformers | Cohere emb-3-lite |
| **STT** | Deepgram | Whisper (self-host) | OpenAI Whisper API |
| **TTS** | ElevenLabs | Piper (self-host) | Google Cloud TTS |
| **Image Gen** | DALL-E 3 | Stable Diffusion | SDXL (self-host) |
| **Feature Store** | Tecton | Feast | Redis |
| **Experiment Tracking** | Weights & Biases | MLflow | DVC |
| **Monitoring** | Arize AI | Evidently | Prometheus + Grafana |
| **CI/CD** | GitHub Actions | Kubeflow Pipelines | ArgoCD |
| **Evaluation** | Braintrust | DeepEval + Ragas | lm-eval-harness |
| **Auth** | Auth0 | Keycloak | OAuth2 + JWT DIY |
| **Low-Code** | Make.com | Dify | Flowise |
| **IDE** | Cursor | Continue.dev | GitHub Copilot |

---

> **Last Updated:** July 2026
> **Maintained by:** Edureka AI/ML Cloud Tech Stack Team
> **License:** CC BY-SA 4.0
