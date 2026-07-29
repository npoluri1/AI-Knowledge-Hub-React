# Comprehensive Guide to Free AI Model APIs, Keys & Resources

> **Last Updated**: 2025 | **Total Providers**: 50+ | **All Free Tier Details Verified**

---

## Table of Contents

1. [Free LLM API Providers](#1-free-llm-api-providers)
2. [Free Embedding APIs](#2-free-embedding-apis)
3. [Free Speech APIs](#3-free-speech-apis)
4. [Free Image APIs](#4-free-image-apis)
5. [Free Vector Databases](#5-free-vector-databases)
6. [Free Cloud GPU](#6-free-cloud-gpu)
7. [Free Monitoring & Observability](#7-free-monitoring--observability)
8. [Free Authentication Services](#8-free-authentication-services)
9. [Free Hosting Platforms](#9-free-hosting-platforms)
10. [API Key Management Best Practices](#10-api-key-management-best-practices)

---

## 1. Free LLM API Providers

### 1.1 Groq

**Provider**: Groq (formerly GroqCloud)  
**URL**: https://console.groq.com  
**Free Tier**: Unlimited requests, generous rate limits  
**Key Feature**: Fastest inference speeds (uses custom LPU hardware)

#### How to Get API Key
1. Visit https://console.groq.com
2. Sign up with GitHub, Google, or email
3. Navigate to **API Keys** → **Create API Key**
4. Copy and store securely

#### Models Available (Free)
- `llama-3.3-70b-versatile` — Best general-purpose model
- `llama-3.1-8b-instant` — Fast, lightweight
- `llama3-70b-8192` — 8192 token context
- `llama3-8b-8192` — Compact version
- `mixtral-8x7b-32768` — Mixture of experts, large context
- `gemma2-9b-it` — Google's open model
- `meta-llama/llama-4-scout-17b-16e-instruct` — Latest Llama 4

#### Rate Limits
- **Free tier**: 30 requests/minute, 13,000 tokens/minute
- **Concurrent requests**: 5
- No daily limit on free tier

#### Code Example (Python)
```python
import os
from groq import Groq

# Set API key via environment variable
# export GROQ_API_KEY="gsk_your_key_here"

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "Explain quantum computing in simple terms."
        }
    ],
    model="llama-3.3-70b-versatile",
    temperature=0.5,
    max_tokens=1024,
    top_p=1,
    stop=None,
    stream=False,
)

print(chat_completion.choices[0].message.content)
```

#### Streaming Example
```python
import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

stream = client.chat.completions.create(
    messages=[
        {"role": "user", "content": "Write a short poem about AI."}
    ],
    model="llama-3.3-70b-versatile",
    stream=True,
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")

print()  # Newline after stream
```

#### OpenAI-Compatible Endpoint
```python
import requests

url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Authorization": "Bearer gsk_your_key_here",
    "Content-Type": "application/json"
}
data = {
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role": "user", "content": "Hello!"}],
}

response = requests.post(url, headers=headers, json=data)
print(response.json()["choices"][0]["message"]["content"])
```

---

### 1.2 Together AI

**Provider**: Together AI  
**URL**: https://api.together.xyz  
**Free Tier**: $25 free credits on signup  
**Key Feature**: Wide model selection, fine-tuning support

#### How to Get API Key
1. Visit https://api.together.xyz
2. Sign up (GitHub or email)
3. Go to **Settings** → **API Keys** → **Create New Key**
4. $25 free credits applied automatically

#### Models Available (Free Credits)
- `meta-llama/Llama-3.3-70B-Instruct-Turbo` — Latest Meta Llama
- `meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo` — Largest open model
- `mistralai/Mixtral-8x22B-Instruct-v0.1` — Mistral MoE
- `Qwen/Qwen2.5-72B-Instruct-Turbo` — Alibaba's best
- `deepseek-ai/DeepSeek-V3` — DeepSeek's flagship
- `google/gemma-2-27b-it` — Google's open model
- 100+ open source models available

#### Rate Limits
- **Free tier**: 60 requests/minute
- Tokens: Deducted from $25 credit balance
- Credits last weeks to months depending on usage

#### Code Example (Python)
```python
import os
from together import Together

# pip install together
# export TOGETHER_API_KEY="your_key_here"

client = Together(api_key=os.environ.get("TOGETHER_API_KEY"))

response = client.chat.completions.create(
    model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
    messages=[
        {"role": "system", "content": "You are a helpful coding assistant."},
        {"role": "user", "content": "Write a Python function to find prime numbers."}
    ],
    temperature=0.7,
    max_tokens=1024,
    stream=True,
)

for token in response:
    if token.choices[0].delta.content:
        print(token.choices[0].delta.content, end="")
```

#### OpenAI-Compatible Usage
```python
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("TOGETHER_API_KEY"),
    base_url="https://api.together.xyz/v1",
)

response = client.chat.completions.create(
    model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
    messages=[{"role": "user", "content": "Hello!"}],
)
print(response.choices[0].message.content)
```

---

### 1.3 OpenRouter

**Provider**: OpenRouter  
**URL**: https://openrouter.ai  
**Free Tier**: Free models available, $5 credit for paid models  
**Key Feature**: Unified API for 300+ models from multiple providers

#### How to Get API Key
1. Visit https://openrouter.ai
2. Sign up with GitHub/Google
3. Go to **Keys** → **Create Key**
4. $5 free credit applied automatically

#### Free Models (Always Free)
- `meta-llama/llama-3.3-70b-instruct:free`
- `qwen/qwen-2.5-72b-instruct:free`
- `google/gemma-2-9b-it:free`
- `mistralai/mistral-7b-instruct:free`
- `nousresearch/hermes-3-llama-3.1-405b:free`
- `deepseek/deepseek-chat:free` (limited)
- 50+ models with `:free` suffix

#### Rate Limits
- **Free models**: 20 requests/minute
- **Paid models** (with credit): 200 requests/minute
- Rate limits per model vary

#### Code Example (Python)
```python
import requests
import os

# export OPENROUTER_API_KEY="sk-or-v1-..."

response = requests.post(
    "https://openrouter.ai/api/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {os.environ.get('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://yourapp.com",
        "X-Title": "My AI App",
    },
    json={
        "model": "meta-llama/llama-3.3-70b-instruct:free",
        "messages": [
            {"role": "user", "content": "What is machine learning?"}
        ],
        "temperature": 0.7,
        "max_tokens": 512,
    }
)

print(response.json()["choices"][0]["message"]["content"])
```

#### OpenAI SDK Usage
```python
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

response = client.chat.completions.create(
    model="meta-llama/llama-3.3-70b-instruct:free",
    messages=[{"role": "user", "content": "Explain REST APIs"}],
)
print(response.choices[0].message.content)
```

---

### 1.4 Mistral AI

**Provider**: Mistral AI  
**URL**: https://console.mistral.ai  
**Free Tier**: Free playground access, API free tier with limits  
**Key Feature**: European AI company, strong open-source models

#### How to Get API Key
1. Visit https://console.mistral.ai
2. Sign up with email
3. Navigate to **API Keys** → **Create new key**
4. Free tier activated immediately

#### Models Available (Free Tier)
- `mistral-small-latest` — Fast, efficient
- `mistral-medium-latest` — Balanced
- `open-mistral-nemo` — Open model
- `codestral-latest` — Code generation (free trial)
- `mistral-embed` — Embeddings

#### Rate Limits
- **Free tier**: 1 request/second, 300,000 tokens/month
- Limited concurrency

#### Code Example (Python)
```python
import os
from mistralai import Mistral

# pip install mistralai
# export MISTRAL_API_KEY="your_key_here"

client = Mistral(api_key=os.environ.get("MISTRAL_API_KEY"))

chat_response = client.chat.complete(
    model="mistral-small-latest",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Write a haiku about coding."}
    ],
    temperature=0.7,
    max_tokens=256,
)

print(chat_response.choices[0].message.content)
```

#### Streaming Example
```python
import os
from mistralai import Mistral

client = Mistral(api_key=os.environ.get("MISTRAL_API_KEY"))

stream = client.chat.stream(
    model="mistral-small-latest",
    messages=[
        {"role": "user", "content": "Tell me about Python decorators."}
    ],
)

for chunk in stream:
    print(chunk.choices[0].delta.content, end="")
```

---

### 1.5 Google Gemini

**Provider**: Google (Google AI / Vertex AI)  
**URL**: https://aistudio.google.com  
**Free Tier**: Generous free usage via Google AI Studio  
**Key Feature**: 1M token context window, multimodal capabilities

#### How to Get API Key
1. Visit https://aistudio.google.com
2. Sign in with Google account
3. Click **Get API Key** → **Create API Key**
4. Select or create a Google Cloud project
5. Copy key (format: `AIza...`)

#### Models Available (Free)
- `gemini-2.0-flash` — Fast, multimodal (default recommended)
- `gemini-2.0-flash-lite` — Even faster, lighter
- `gemini-1.5-pro` — Most capable (limited free)
- `gemini-1.5-flash` — Fast + capable
- `gemini-2.0-flash-exp` — Experimental

#### Rate Limits
- **Free tier**: 15 requests/minute (RPM), 1 million tokens/day
- **Gemini 1.5 Flash**: 15 RPM, 1M tokens/day
- **Gemini 1.5 Pro**: 2 RPM, 32,000 tokens/day

#### Code Example (Python)
```python
import os
import google.generativeai as genai

# pip install google-generativeai
# export GOOGLE_API_KEY="AIza..."

genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

model = genai.GenerativeModel("gemini-2.0-flash")

response = model.generate_content(
    "Explain the difference between TCP and UDP.",
    generation_config=genai.GenerationConfig(
        temperature=0.7,
        max_output_tokens=1024,
        top_p=0.95,
        top_k=40,
    )
)

print(response.text)
```

#### Streaming Example
```python
import os
import google.generativeai as genai

genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

response = model.generate_content(
    "Write a short story about a robot.",
    stream=True,
)

for chunk in response:
    print(chunk.text, end="")
```

#### Chat History Example
```python
import os
import google.generativeai as genai

genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

chat = model.start_chat(history=[])

# First message
response = chat.send_message("My name is Alice.")
print(response.text)

# Follow-up (model remembers context)
response = chat.send_message("What's my name?")
print(response.text)  # Will say "Alice"
```

#### OpenAI-Compatible via Google GenAI SDK
```python
from google import genai

client = genai.Client(api_key=os.environ.get("GOOGLE_API_KEY"))

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Hello, how are you?",
)

print(response.text)
```

---

### 1.6 Cohere

**Provider**: Cohere  
**URL**: https://dashboard.cohere.com  
**Free Tier**: Free trial with API credits  
**Key Feature**: Best-in-class RAG, embeddings, and reranking

#### How to Get API Key
1. Visit https://dashboard.cohere.com
2. Sign up with email or GitHub
3. Go to **API Keys** section
4. Copy your trial API key

#### Models Available (Free Tier)
- `command-r` — Best for RAG and tool use
- `command-r-plus` — Most capable (limited free)
- `command-light` — Fast, lightweight
- `embed-english-v3.0` — Embeddings
- `rerank-english-v3.0` — Reranking

#### Rate Limits
- **Free tier**: 1,000 calls/month for production API
- Rate: 10 calls/minute

#### Code Example (Python)
```python
import os
import cohere

# pip install cohere
# export COHERE_API_KEY="your_key_here"

co = cohere.ClientV2(api_key=os.environ.get("COHERE_API_KEY"))

response = co.chat(
    model="command-r",
    messages=[
        {"role": "user", "content": "What are the benefits of using Python for data science?"}
    ],
)

print(response.message.content[0].text)
```

#### RAG Example
```python
import os
import cohere

co = cohere.ClientV2(api_key=os.environ.get("COHERE_API_KEY"))

# RAG with documents
response = co.chat(
    model="command-r",
    messages=[
        {
            "role": "user",
            "content": "What is the capital of France?"
        }
    ],
    documents=[
        {
            "title": "France Facts",
            "text": "Paris is the capital and largest city of France. It is known for the Eiffel Tower."
        },
        {
            "title": "French Geography",
            "text": "France is located in Western Europe and has several major cities."
        }
    ],
)

print(response.message.content[0].text)
```

---

### 1.7 AI21 Labs

**Provider**: AI21 Labs  
**URL**: https://www.ai21.com  
**Free Tier**: Free trial credits ($5)  
**Key Feature**: Strong instruction-following, long context

#### How to Get API Key
1. Visit https://studio.ai21.com
2. Sign up with email
3. Navigate to **API Key**
4. $5 free credits applied

#### Models Available
- `jamba-1.5-large` — Flagship, hybrid SSM-Transformer
- `jamba-1.5-mini` — Fast, efficient
- `jamba-instruct` — Best for chat
- `j2-ultra` — Largest Jurassic model
- `j2-mid` — Balanced
- `j2-light` — Fast

#### Code Example (Python)
```python
import os
from ai21 import AI21Client

# pip install ai21
# export AI21_API_KEY="your_key_here"

client = AI21Client(api_key=os.environ.get("AI21_API_KEY"))

response = client.chat.completions.create(
    model="jamba-1.5-mini",
    messages=[
        {"role": "user", "content": "Explain Docker in 3 sentences."}
    ],
    temperature=0.7,
)

print(response.choices[0].message.content)
```

---

### 1.8 DeepSeek

**Provider**: DeepSeek  
**URL**: https://platform.deepseek.com  
**Free Tier**: Very affordable, free tier available  
**Key Feature**: Exceptional code generation, competitive with GPT-4

#### How to Get API Key
1. Visit https://platform.deepseek.com
2. Sign up with email or phone
3. Go to **API Keys** → **Create new key**
4. Free credits applied to new accounts

#### Models Available
- `deepseek-chat` — General purpose (V3)
- `deepseek-reasoner` — Reasoning model (R1)
- `deepseek-coder` — Code-specialized

#### Rate Limits
- **Free tier**: 500M tokens free, then pay-as-you-go
- Deep pricing: ~$0.27/1M input tokens, ~$1.10/1M output tokens
- Rate: 60 requests/minute

#### Code Example (Python)
```python
import os
from openai import OpenAI

# DeepSeek uses OpenAI-compatible API
# export DEEPSEEK_API_KEY="sk-..."

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com",
)

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Write a merge sort algorithm in Python."}
    ],
    temperature=0.7,
    max_tokens=1024,
    stream=True,
)

for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

---

### 1.9 SambaNova

**Provider**: SambaNova  
**URL**: https://cloud.sambanova.ai  
**Free Tier**: Free API access  
**Key Feature**: Fast inference on custom hardware

#### How to Get API Key
1. Visit https://cloud.sambanova.ai
2. Sign up with email
3. Go to **API Keys** → **Generate Key**

#### Models Available
- `Meta-Llama-3.3-70B-Instruct` — Full Llama 3.3
- `DeepSeek-V3-0324` — DeepSeek latest
- `QwQ-32B` — Alibaba reasoning model

#### Code Example (Python)
```python
import os
from openai import OpenAI

# export SAMBANOVA_API_KEY="your_key"

client = OpenAI(
    api_key=os.environ.get("SAMBANOVA_API_KEY"),
    base_url="https://api.sambanova.ai/v1",
)

response = client.chat.completions.create(
    model="Meta-Llama-3.3-70B-Instruct",
    messages=[
        {"role": "user", "content": "Hello, who are you?"}
    ],
    temperature=0.7,
    max_tokens=512,
)

print(response.choices[0].message.content)
```

---

### 1.10 Hugging Face Inference API (Free LLM)

**Provider**: Hugging Face  
**URL**: https://huggingface.co  
**Free Tier**: Free inference for open models  
**Key Feature**: Largest model hub, thousands of free models

#### How to Get API Key
1. Visit https://huggingface.co
2. Create an account
3. Go to **Settings** → **Access Tokens** → **New token**
4. Create a "Read" token

#### Models Available
- `meta-llama/Llama-3.3-70B-Instruct` — Meta's latest
- `Qwen/Qwen2.5-72B-Instruct` — Alibaba
- `mistralai/Mistral-7B-Instruct-v0.3` — Mistral
- `microsoft/Phi-3-mini-4k-instruct` — Microsoft
- Any public model on the hub

#### Rate Limits
- **Free tier**: 300 requests/hour, 100,000 tokens/day
- Serverless inference only (cold starts possible)

#### Code Example (Python)
```python
import os
import requests

# export HUGGINGFACE_API_KEY="hf_..."

API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.3-70B-Instruct"
headers = {"Authorization": f"Bearer {os.environ.get('HUGGINGFACE_API_KEY')}"}

payload = {
    "inputs": "Explain the transformer architecture in 3 sentences.",
    "parameters": {
        "max_new_tokens": 256,
        "temperature": 0.7,
        "top_p": 0.95,
    }
}

response = requests.post(API_URL, headers=headers, json=payload)
print(response.json()[0]["generated_text"])
```

#### Using `huggingface_hub` Library
```python
import os
from huggingface_hub import InferenceClient

# export HUGGINGFACE_API_KEY="hf_..."

client = InferenceClient(token=os.environ.get("HUGGINGFACE_API_KEY"))

response = client.text_generation(
    "Write a Python decorator that logs execution time.",
    model="meta-llama/Llama-3.3-70B-Instruct",
    max_new_tokens=512,
    temperature=0.7,
)

print(response)
```

---

## 2. Free Embedding APIs

### 2.1 Cohere Embed

**Provider**: Cohere  
**URL**: https://dashboard.cohere.com  
**Free Tier**: 1,000 calls/month  
**Key Feature**: Best embedding quality, multilingual

#### Models
- `embed-english-v3.0` — English optimized
- `embed-multilingual-v3.0` — 100+ languages

#### Code Example
```python
import os
import cohere

co = cohere.ClientV2(api_key=os.environ.get("COHERE_API_KEY"))

response = co.embed(
    texts=["Hello world", "Machine learning is great"],
    model="embed-english-v3.0",
    input_type="search_document",
    embedding_types=["float"],
)

print(response.embeddings.float_[0])  # List of floats
```

---

### 2.2 Jina AI Embeddings

**Provider**: Jina AI  
**URL**: https://jina.ai/embeddings  
**Free Tier**: 1 million tokens free  
**Key Feature**: Best price-performance, long context

#### Code Example
```python
import requests
import os

# export JINA_API_KEY="jina_..."

url = "https://api.jina.ai/v1/embeddings"
headers = {
    "Authorization": f"Bearer {os.environ.get('JINA_API_KEY')}",
    "Content-Type": "application/json"
}

data = {
    "model": "jina-embeddings-v3",
    "input": ["Hello world", "This is a test"],
    "dimensions": 1024,
}

response = requests.post(url, headers=headers, json=data)
embeddings = response.json()["data"]
print(embeddings[0]["embedding"][:5])  # First 5 dimensions
```

---

### 2.3 Hugging Face Embeddings (Free)

#### Code Example
```python
import os
from sentence_transformers import SentenceTransformer

# Local model (no API needed)
model = SentenceTransformer("all-MiniLM-L6-v2")

sentences = ["This is a sentence", "This is another sentence"]
embeddings = model.encode(sentences)
print(embeddings.shape)  # (2, 384)
```

#### Via Inference API
```python
import os
import requests

# export HUGGINGFACE_API_KEY="hf_..."

API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
headers = {"Authorization": f"Bearer {os.environ.get('HUGGINGFACE_API_KEY')}"}

response = requests.post(
    API_URL,
    headers=headers,
    json={"inputs": ["Hello world", "Test sentence"]}
)

print(response.json())
```

---

## 3. Free Speech APIs

### 3.1 Groq Whisper

**Provider**: Groq  
**URL**: https://console.groq.com  
**Free Tier**: Free transcription  
**Key Feature**: Fastest Whisper inference

#### Code Example
```python
import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Transcribe audio file
with open("audio.mp3", "rb") as file:
    transcription = client.audio.transcriptions.create(
        file=("audio.mp3", file.read()),
        model="whisper-large-v3",
        language="en",
    )

print(transcription.text)
```

#### Faster-Whisper (Alternative)
```python
with open("audio.mp3", "rb") as file:
    transcription = client.audio.transcriptions.create(
        file=("audio.mp3", file.read()),
        model="whisper-large-v3-turbo",
    )

print(transcription.text)
```

---

### 3.2 AssemblyAI

**Provider**: AssemblyAI  
**URL**: https://www.assemblyai.com  
**Free Tier**: $50 free credits (one-time)  
**Key Feature**: Best transcription accuracy, speaker diarization

#### How to Get API Key
1. Visit https://www.assemblyai.com
2. Sign up with email
3. $50 free credits applied

#### Code Example
```python
import os
import assemblyai as aai

# pip install assemblyai
# export ASSEMBLYAI_API_KEY="your_key"

aai.settings.api_key = os.environ.get("ASSEMBLYAI_API_KEY")

config = aai.TranscriptionConfig(
    speaker_labels=True,
    auto_chapters=True,
    sentiment_analysis=True,
)

transcriber = aai.Transcriber()
transcript = transcriber.transcribe("audio.mp3", config=config)

print(transcript.text)

# Speaker-labeled transcript
for utterance in transcript.utterances:
    print(f"Speaker {utterance.speaker}: {utterance.text}")
```

---

### 3.3 Deepgram

**Provider**: Deepgram  
**URL**: https://console.deepgram.com  
**Free Tier**: $200 free credits  
**Key Feature**: Real-time streaming transcription

#### How to Get API Key
1. Visit https://console.deepgram.com
2. Sign up with email/GitHub
3. $200 free credits applied

#### Code Example
```python
import os
import requests

# export DEEPGRAM_API_KEY="your_key"

url = "https://api.deepgram.com/v1/listen"
headers = {
    "Authorization": f"Token {os.environ.get('DEEPGRAM_API_KEY')}",
    "Content-Type": "audio/mp3"
}

with open("audio.mp3", "rb") as f:
    audio_data = f.read()

response = requests.post(url, headers=headers, data=audio_data)
result = response.json()

print(result["results"]["channels"][0]["alternatives"][0]["transcript"])
```

---

## 4. Free Image APIs

### 4.1 Stability AI

**Provider**: Stability AI  
**URL**: https://platform.stability.ai  
**Free Tier**: 25 free credits on signup  
**Key Feature**: Best open-source image generation

#### How to Get API Key
1. Visit https://platform.stability.ai
2. Sign up and get 25 free credits

#### Code Example
```python
import os
import requests

# export STABILITY_API_KEY="sk-..."

url = "https://api.stability.ai/v2beta/stable-image/generate/sd3"

headers = {
    "Authorization": f"Bearer {os.environ.get('STABILITY_API_KEY')}",
    "Accept": "image/*",
}

data = {
    "prompt": "A serene landscape with mountains at sunset",
    "output_format": "png",
}

response = requests.post(url, headers=headers, files={"none": ""}, data=data)

if response.status_code == 200:
    with open("generated_image.png", "wb") as f:
        f.write(response.content)
    print("Image saved!")
else:
    print(f"Error: {response.status_code}")
    print(response.json())
```

---

### 4.2 Replicate

**Provider**: Replicate  
**URL**: https://replicate.com  
**Free Tier**: Limited free usage (pay-per-second after)  
**Key Feature**: Access to thousands of open-source models

#### How to Get API Key
1. Visit https://replicate.com
2. Sign up with GitHub
3. Go to **Account Settings** → **API Tokens**

#### Code Example (Image Generation)
```python
import os
import replicate

# pip install replicate
# export REPLICATE_API_TOKEN="r8_..."

output = replicate.run(
    "stability-ai/sdxl:latest",
    input={
        "prompt": "A futuristic city with flying cars, cyberpunk style",
        "width": 1024,
        "height": 1024,
        "num_outputs": 1,
        "guidance_scale": 7.5,
    }
)

print(output[0])  # URL to generated image
```

---

### 4.3 Hugging Face Inference (Image)

#### Code Example (Stable Diffusion)
```python
import os
from huggingface_hub import InferenceClient

client = InferenceClient(token=os.environ.get("HUGGINGFACE_API_KEY"))

image = client.text_to_image(
    "A beautiful sunset over the ocean",
    model="stabilityai/stable-diffusion-xl-base-1.0",
)

image.save("sunset.png")
```

---

## 5. Free Vector Databases

### 5.1 Pinecone

**Provider**: Pinecone  
**URL**: https://www.pinecone.io  
**Free Tier**: 100,000 vectors, 1GB storage  
**Key Feature**: Fully managed, no infrastructure

#### How to Get Started
1. Visit https://www.pinecone.io
2. Sign up → Free tier automatically activated
3. Get API key from console

#### Code Example
```python
import os
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer

# pip install pinecone sentence-transformers

pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))

# Create index
pc.create_index(
    name="my-index",
    dimension=384,
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1"),
)

# Get index
index = pc.Index("my-index")

# Generate embeddings locally
model = SentenceTransformer("all-MiniLM-L6-v2")

# Upsert vectors
texts = ["Hello world", "Machine learning", "Vector databases"]
vectors = model.encode(texts).tolist()

index.upsert(
    vectors=[
        (f"doc-{i}", vec, {"text": text})
        for i, (vec, text) in enumerate(zip(vectors, texts))
    ]
)

# Query
query_embedding = model.encode(["What is AI?"]).tolist()
results = index.query(
    vector=query_embedding[0],
    top_k=3,
    include_metadata=True,
)

for match in results["matches"]:
    print(f"Score: {match['score']:.3f} - {match['metadata']['text']}")
```

---

### 5.2 ChromaDB (Local)

**Provider**: Chroma  
**URL**: https://www.trychroma.com  
**Free Tier**: Free and open source (runs locally)  
**Key Feature**: Simplest vector DB, great for prototyping

#### Code Example
```python
import chromadb
from sentence_transformers import SentenceTransformer

# pip install chromadb sentence-transformers

client = chromadb.Client()  # In-memory
# client = chromadb.PersistentClient(path="./chroma_db")  # Persistent

collection = client.create_collection(
    name="my_documents",
    metadata={"hnsw:space": "cosine"}
)

model = SentenceTransformer("all-MiniLM-L6-v2")

documents = [
    "Python is a programming language",
    "Machine learning uses algorithms",
    "Databases store data efficiently",
]

embeddings = model.encode(documents).tolist()

collection.add(
    documents=documents,
    embeddings=embeddings,
    ids=[f"doc{i}" for i in range(len(documents))],
    metadatas=[{"source": "test"} for _ in documents],
)

# Query
query_embedding = model.encode(["What is programming?"]).tolist()
results = collection.query(
    query_embeddings=query_embedding,
    n_results=2,
)

print(results["documents"])
print(results["distances"])
```

---

### 5.3 Qdrant

**Provider**: Qdrant  
**URL**: https://qdrant.tech  
**Free Tier**: 1GB free cloud storage  
**Key Feature**: Fast filtering, payload support

#### Code Example
```python
import os
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer

# pip install qdrant-client sentence-transformers

# Cloud (free tier)
client = QdrantClient(
    url=os.environ.get("QDRANT_URL"),  # https://xxx.qdrant.io
    api_key=os.environ.get("QDRANT_API_KEY"),
)

# Or local
# client = QdrantClient(host="localhost", port=6333)

# Create collection
client.create_collection(
    collection_name="my_collection",
    vectors_config=VectorParams(size=384, distance=Distance.COSINE),
)

model = SentenceTransformer("all-MiniLM-L6-v2")

# Insert points
texts = ["Hello world", "Vector search is powerful"]
vectors = model.encode(texts).tolist()

points = [
    PointStruct(id=i, vector=vec, payload={"text": text})
    for i, (vec, text) in enumerate(zip(vectors, texts))
]

client.upsert(collection_name="my_collection", points=points)

# Search
query = model.encode(["What is vector search?"]).tolist()
results = client.search(
    collection_name="my_collection",
    query_vector=query[0],
    limit=3,
)

for result in results:
    print(f"Score: {result.score:.3f} - {result.payload['text']}")
```

---

### 5.4 Weaviate

**Provider**: Weaviate  
**URL**: https://weaviate.io  
**Free Tier**: Sandbox cluster (free for 14 days)  
**Key Feature**: Built-in vectorization, GraphQL API

#### Code Example
```python
import weaviate
from sentence_transformers import SentenceTransformer

# pip install weaviate-client sentence-transformers

# Local
client = weaviate.connect_to_local()

# Or cloud free sandbox
# client = weaviate.connect_to_weaviate_cloud(
#     cluster_url="https://xxx.weaviate.network",
#     auth_credentials=weaviate.auth.AuthApiKey("key")
# )

# Create collection with vectorizer
collection = client.collections.create(
    name="Document",
    vectorizer_config=weaviate.classes.config.Configure.Vectorizer.none(),
    vector_index_config=weaviate.classes.config.Configure.VectorIndex.hnsw(
        distance_metric=weaviate.classes.config.Distance.COSINE
    ),
)

model = SentenceTransformer("all-MiniLM-L6-v2")

# Insert data
texts = ["Hello world", "Machine learning is great"]
vectors = model.encode(texts).tolist()

with client.batch.dynamic() as batch:
    for text, vector in zip(texts, vectors):
        collection.data.insert(
            properties={"text": text},
            vector=vector,
        )

# Query
results = collection.query.near_vector(
    near_vector=model.encode(["What is AI?"])[0],
    limit=3,
)

for obj in results.objects:
    print(obj.properties["text"])
```

---

## 6. Free Cloud GPU

### 6.1 Google Colab

**Provider**: Google  
**URL**: https://colab.research.google.com  
**Free Tier**: Free GPU access (T4)  
**Key Feature**: Jupyter notebooks with GPU

#### Usage Tips
```python
# Check GPU
!nvidia-smi

# Install packages
!pip install transformers torch accelerate

# Use GPU
import torch
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")
```

#### Free Tier Limits
- **GPU**: T4 (16GB VRAM), intermittent availability
- **Runtime**: 12 hours max, disconnects after inactivity
- **RAM**: ~12GB
- **Storage**: ~100GB (temporary, lost on disconnect)
- **Pro**: $10/month for longer runtimes, better GPU

---

### 6.2 Kaggle Notebooks

**Provider**: Kaggle  
**URL**: https://www.kaggle.com/code  
**Free Tier**: 30 GPU hours/week  
**Key Feature**: P100 or T4 GPU, 16GB RAM

#### How to Access
1. Visit https://www.kaggle.com
2. Sign up and verify phone number
3. Go to **Account** → **Accelerator** → **GPU P100**
4. Create new notebook with GPU enabled

#### Free Tier Limits
- **GPU**: P100 (16GB) or T4 (16GB)
- **Weekly limit**: 30 hours GPU, 30 hours TPU
- **Storage**: 20GB per notebook
- **RAM**: 16GB

---

### 6.3 Lambda Labs

**Provider**: Lambda  
**URL**: https://lambdalabs.com  
**Free Tier**: Occasional free credits  
**Key Feature**: A100/H100 GPUs, professional grade

#### Code Example (Lambda Cloud API)
```python
import os
import requests

# export LAMBDA_API_KEY="your_key"

url = "https://cloud.lambdalabs.com/api/v1/instance-types"
headers = {"Authorization": f"Bearer {os.environ.get('LAMBDA_API_KEY')}"}

response = requests.get(url, headers=headers)
print(response.json())
```

---

### 6.4 RunPod

**Provider**: RunPod  
**URL**: https://runpod.io  
**Free Tier**: Free credits for new users  
**Key Feature**: Community cloud, competitive pricing

#### Code Example (RunPod API)
```python
import os
import requests

# export RUNPOD_API_KEY="your_key"

url = "https://api.runpod.io/graphql"
headers = {
    "Authorization": f"Bearer {os.environ.get('RUNPOD_API_KEY')}",
    "Content-Type": "application/json"
}

# List GPU types
query = """
{
  gpuTypes {
    id
    displayName
    lowestPrice
  }
}
"""

response = requests.post(url, headers=headers, json={"query": query})
print(response.json())
```

---

### 6.5 Lightning AI (formerly Lightning Studios)

**Provider**: Lightning AI  
**URL**: https://lightning.ai  
**Free Tier**: 22 GPU hours free  
**Key Feature**: IDE + compute, team collaboration

---

## 7. Free Monitoring & Observability

### 7.1 Langfuse

**Provider**: Langfuse  
**URL**: https://langfuse.com  
**Free Tier**: 50,000 observations/month  
**Key Feature**: Open-source LLM observability

#### How to Get Started
1. Visit https://cloud.langfuse.com (free cloud) or self-host
2. Sign up
3. Create project → Get public + secret keys

#### Code Example
```python
import os
from langfuse import Langfuse

# pip install langfuse

langfuse = Langfuse(
    public_key=os.environ.get("LANGFUSE_PUBLIC_KEY"),
    secret_key=os.environ.get("LANGFUSE_SECRET_KEY"),
    host="https://cloud.langfuse.com",
)

# Trace an LLM call
@langfuse.observe()
def chat_with_llm(message: str) -> str:
    # Your LLM call here
    from groq import Groq
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": message}],
    )
    return response.choices[0].message.content

result = chat_with_llm("What is Langfuse?")
print(result)

# Flush events
langfuse.flush()
```

---

### 7.2 LangSmith

**Provider**: LangChain  
**URL**: https://smith.langchain.com  
**Free Tier**: 5,000 traces/month  
**Key Feature**: Built for LangChain, deep tracing

#### Code Example
```python
import os
from langsmith import traceable

# pip install langsmith
# export LANGCHAIN_TRACING_V2="true"
# export LANGCHAIN_API_KEY="your_key"
# export LANGCHAIN_PROJECT="my-project"

@traceable(run_type="chain")
def my_llm_function(query: str) -> str:
    from groq import Groq
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": query}],
    )
    return response.choices[0].message.content

result = my_llm_function("Explain LangSmith")
```

---

### 7.3 Arize Phoenix

**Provider**: Arize AI  
**URL**: https://phoenix.arize.com  
**Free Tier**: Free and open source  
**Key Feature**: Local deployment, no vendor lock-in

#### Code Example
```python
# pip install arize-phoenix openinference-instrumentation-groq

import phoenix as px

# Start Phoenix server (local)
px.launch_app()

# Instrument your LLM calls
from openinference.instrumentation.groq import GroqInstrumentor
GroqInstrumentor().instrument()

# Now all Groq calls are automatically traced
# Visit http://localhost:6006 to view traces
```

---

## 8. Free Authentication Services

### 8.1 Auth0

**Provider**: Auth0 (Okta)  
**URL**: https://auth0.com  
**Free Tier**: 7,500 active users  
**Key Feature**: Enterprise-grade auth, MFA, social login

#### Code Example (Python)
```python
from auth0.management import Auth0

# pip install auth0-python

auth0 = Auth0(
    domain="your-domain.auth0.com",
    management_token="your_management_token",
)

# Get all users
users = auth0.users.list(page=0, per_page=20)
for user in users["users"]:
    print(user["email"])
```

#### Code Example (JavaScript/React)
```javascript
import { useAuth0 } from "@auth0/auth0-react";

function LoginButton() {
  const { loginWithRedirect } = useAuth0();
  return <button onClick={() => loginWithRedirect()}>Log In</button>;
}

function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  
  if (isLoading) return <div>Loading...</div>;
  
  return isAuthenticated ? (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  ) : null;
}
```

---

### 8.2 Firebase Auth

**Provider**: Google  
**URL**: https://firebase.google.com  
**Free Tier**: 10,000 phone authentications/month, unlimited email/password  
**Key Feature**: Deep Google integration, phone auth

#### Code Example (Python)
```python
import firebase_admin
from firebase_admin import auth

# pip install firebase-admin

# Initialize with service account
cred = firebase_admin.credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# Create user
user = auth.create_user(
    email="user@example.com",
    email_verified=True,
    password="securepassword123",
    display_name="Test User",
)
print(f"Created user: {user.uid}")

# Verify ID token
try:
    decoded_token = auth.verify_id_token(id_token)
    uid = decoded_token["uid"]
    print(f"User ID: {uid}")
except auth.InvalidIdTokenError:
    print("Invalid token")
```

---

### 8.3 Supabase Auth

**Provider**: Supabase  
**URL**: https://supabase.com  
**Free Tier**: 50,000 monthly active users  
**Key Feature**: Open source, built into Supabase, Row Level Security

#### Code Example (Python)
```python
from supabase import create_client

# pip install supabase

url = "https://your-project.supabase.co"
key = "your-anon-key"

supabase = create_client(url, key)

# Sign up
result = supabase.auth.sign_up(
    {
        "email": "user@example.com",
        "password": "securepassword123",
    }
)

# Sign in
result = supabase.auth.sign_in_with_password(
    {
        "email": "user@example.com",
        "password": "securepassword123",
    }
)

print(result.session.access_token)
```

#### Code Example (JavaScript)
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://your-project.supabase.co', 'your-anon-key')

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword123',
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword123',
})

// Get current user
const { data: { user } } = await supabase.auth.getUser()
console.log(user)
```

---

## 9. Free Hosting Platforms

### 9.1 Vercel

**Provider**: Vercel  
**URL**: https://vercel.com  
**Free Tier**: Generous for hobby projects  
**Key Feature**: Best Next.js hosting, instant deploys

#### Free Tier Limits
- **Bandwidth**: 100GB/month
- **Build minutes**: 6,000 minutes/month
- **Serverless functions**: 100GB-hours
- **Projects**: Unlimited
- **Custom domains**: Included

#### Deploy via CLI
```bash
npm i -g vercel
vercel login
vercel deploy
```

#### Code Example (Next.js config)
```javascript
// vercel.json
{
  "functions": {
    "api/**/*.js": {
      "maxDuration": 10
    }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" }
  ]
}
```

---

### 9.2 Railway

**Provider**: Railway  
**URL**: https://railway.app  
**Free Tier**: $5 free usage/month  
**Key Feature**: Full-stack apps, databases included

#### Free Tier Limits
- **Usage**: $5/month free credit
- **Projects**: Unlimited
- **Deployments**: Unlimited
- **Includes**: PostgreSQL, Redis, MongoDB

#### Deploy via CLI
```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

---

### 9.3 Fly.io

**Provider**: Fly.io  
**URL**: https://fly.io  
**Free Tier**: 3 shared VMs, 160GB bandwidth  
**Key Feature**: Global edge deployment, Docker-based

#### Free Tier Limits
- **Shared VM (1x256MB)**: 3 free
- **Bandwidth**: 160GB/month
- **Persistent storage**: 3GB
- **Postgres**: Free shared database

#### Deploy Example
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
fly launch

# Deploy
fly deploy
```

#### Code Example (Dockerfile)
```dockerfile
FROM node:20-slim

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

---

### 9.4 Render

**Provider**: Render  
**URL**: https://render.com  
**Free Tier**: Static sites, web services  
**Key Feature**: Easy setup, built-in SSL

#### Free Tier Limits
- **Static sites**: Unlimited, free
- **Web services**: 750 hours/month (512MB RAM)
- **PostgreSQL**: 90 days free
- **No credit card required**

#### Deploy Steps
1. Connect GitHub repo
2. Select branch
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Deploy

---

### 9.5 GitHub Pages

**Provider**: GitHub  
**URL**: https://pages.github.com  
**Free Tier**: Unlimited static hosting  
**Key Feature**: Built into GitHub, custom domains

#### Deploy
```bash
# Enable Pages in repo settings, then:
git checkout -b gh-pages
git push origin gh-pages
```

---

## 10. API Key Management Best Practices

### 10.1 Environment Variables

**Never hardcode API keys in source code.**

```bash
# .env file (add to .gitignore)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
GOOGLE_API_KEY=AIzaSyxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
COHERE_API_KEY=xxxxxxxxxxxxxxxx
```

```python
import os
from dotenv import load_dotenv

# pip install python-dotenv
load_dotenv()  # Loads .env file

api_key = os.environ.get("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY not set in environment")
```

### 10.2 .env File Structure

```
# .env
# ===== LLM APIs =====
GROQ_API_KEY=gsk_xxx
TOGETHER_API_KEY=xxx
GOOGLE_API_KEY=AIzaSyxxx
MISTRAL_API_KEY=xxx
DEEPSEEK_API_KEY=sk-xxx

# ===== Embedding APIs =====
COHERE_API_KEY=xxx
JINA_API_KEY=jina_xxx
HUGGINGFACE_API_KEY=hf_xxx

# ===== Speech APIs =====
ASSEMBLYAI_API_KEY=xxx
DEEPGRAM_API_KEY=xxx

# ===== Image APIs =====
STABILITY_API_KEY=sk-xxx
REPLICATE_API_TOKEN=r8_xxx

# ===== Vector DBs =====
PINECONE_API_KEY=xxx
QDRANT_API_KEY=xxx
QDRANT_URL=https://xxx.qdrant.io

# ===== Auth =====
AUTH0_DOMAIN=xxx.auth0.com
AUTH0_CLIENT_ID=xxx
FIREBASE_CREDENTIALS=path/to/serviceAccount.json

# ===== Monitoring =====
LANGFUSE_PUBLIC_KEY=pk_xxx
LANGFUSE_SECRET_KEY=sk_xxx
LANGCHAIN_API_KEY=ls_xxx
```

### 10.3 .gitignore Configuration

```gitignore
# .gitignore
.env
.env.local
.env.production
.env.*.local

# Never commit these
*.pem
*.key
serviceAccountKey.json
credentials.json

# IDE
.vscode/settings.json
.idea/workspace.xml

# OS
.DS_Store
Thumbs.db
```

### 10.4 Key Rotation Strategy

```python
import os
import time
import hashlib

class APIKeyManager:
    """Simple API key manager with rotation support."""
    
    def __init__(self):
        self.keys = {}  # key_name -> {key, created_at, expires_at}
    
    def add_key(self, name: str, key: str, expires_days: int = 90):
        self.keys[name] = {
            "key": key,
            "created_at": time.time(),
            "expires_at": time.time() + (expires_days * 86400),
            "usage_count": 0,
        }
    
    def get_key(self, name: str) -> str:
        if name not in self.keys:
            raise ValueError(f"Key '{name}' not found")
        
        key_info = self.keys[name]
        
        if time.time() > key_info["expires_at"]:
            print(f"WARNING: Key '{name}' has expired!")
            # Optionally return None or raise exception
        
        key_info["usage_count"] += 1
        return key_info["key"]
    
    def rotate_key(self, name: str, new_key: str):
        old_key = self.keys.get(name, {})
        old_expires = old_key.get("expires_at", time.time())
        remaining_days = max(0, (old_expires - time.time()) / 86400)
        
        self.add_key(name, new_key, expires_days=max(30, int(remaining_days)))
        print(f"Rotated key '{name}'. Usage: {old_key.get('usage_count', 0)} calls")


# Usage
manager = APIKeyManager()
manager.add_key("groq", "gsk_xxx", expires_days=90)
manager.add_key("together", "xxx", expires_days=60)

# Use keys
groq_key = manager.get_key("groq")
```

### 10.5 Key Validation Pattern

```python
import os
import re

def validate_api_keys():
    """Validate that all required API keys are set and properly formatted."""
    
    key_patterns = {
        "GROQ_API_KEY": r"^gsk_",
        "GOOGLE_API_KEY": r"^AIza",
        "MISTRAL_API_KEY": r"^[a-zA-Z0-9]{32,}$",
        "DEEPSEEK_API_KEY": r"^sk-",
        "HUGGINGFACE_API_KEY": r"^hf_",
        "OPENROUTER_API_KEY": r"^sk-or-",
        "COHERE_API_KEY": r"^[a-zA-Z0-9]{40,}$",
        "REPLICATE_API_TOKEN": r"^r8_",
        "PINECONE_API_KEY": r"^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
    }
    
    results = {}
    for key_name, pattern in key_patterns.items():
        value = os.environ.get(key_name, "")
        if not value:
            results[key_name] = "❌ NOT SET"
        elif re.match(pattern, value):
            results[key_name] = "✅ VALID"
        else:
            results[key_name] = "⚠️ FORMAT MISMATCH"
    
    print("\n" + "=" * 50)
    print("API Key Validation Report")
    print("=" * 50)
    for key, status in results.items():
        print(f"{key}: {status}")
    print("=" * 50 + "\n")
    
    return results


if __name__ == "__main__":
    validate_api_keys()
```

### 10.6 Secure Storage Patterns

```python
# Pattern 1: Using keyring (OS keychain)
import keyring

# Store
keyring.set_password("myapp", "groq_api_key", "gsk_xxx")

# Retrieve
key = keyring.get_password("myapp", "groq_api_key")

# Pattern 2: Using AWS Secrets Manager (production)
import boto3

def get_secret(secret_name: str) -> str:
    client = boto3.client("secretsmanager", region_name="us-east-1")
    response = client.get_secret_value(SecretId=secret_name)
    return response["SecretString"]

# Pattern 3: Using HashiCorp Vault (enterprise)
import hvac

client = hvac.Client(url="https://vault.example.com")
client.token = os.environ.get("VAULT_TOKEN")

secret = client.secrets.kv.v2.read_secret_version(path="myapp/api_keys")
groq_key = secret["data"]["data"]["groq_api_key"]
```

### 10.7 Quick Reference Card

| Provider | Key Prefix | Free Tier | Rate Limit |
|----------|-----------|-----------|------------|
| Groq | `gsk_` | Unlimited | 30 RPM |
| Together AI | varies | $25 credit | 60 RPM |
| OpenRouter | `sk-or-` | $5 credit | 20 RPM |
| Mistral | varies | 300K tokens/month | 1 RPS |
| Google Gemini | `AIza` | 1M tokens/day | 15 RPM |
| Cohere | varies | 1K calls/month | 10 RPM |
| DeepSeek | `sk-` | 500M tokens | 60 RPM |
| HuggingFace | `hf_` | 100K tokens/day | 300 RPH |
| Pinecone | UUID | 100K vectors | 100 RPM |
| Auth0 | varies | 7.5K users | Unlimited |
| Firebase | varies | 10K phone auth | Unlimited |
| Supabase | varies | 50K MAU | Unlimited |

---

## Quick Start Guide

### Minimal Setup (5 minutes)

```bash
# 1. Create .env file
cat > .env << 'EOF'
GROQ_API_KEY=gsk_your_key_here
GOOGLE_API_KEY=AIzaSy_your_key_here
PINECONE_API_KEY=your_key_here
EOF

# 2. Install core packages
pip install python-dotenv groq google-generativeai pinecone sentence-transformers

# 3. Create quick start script
cat > quick_start.py << 'EOF'
import os
from dotenv import load_dotenv

load_dotenv()

# Test Groq
from groq import Groq
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "Say hello!"}]
)
print(f"Groq: {response.choices[0].message.content}")

# Test Gemini
import google.generativeai as genai
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")
response = model.generate_content("Say hello!")
print(f"Gemini: {response.text}")

print("\n✅ All APIs working!")
EOF

python quick_start.py
```

---

## Cost Optimization Tips

1. **Start with Groq** — Free, fastest, great quality
2. **Use free models on OpenRouter** — No cost, many options
3. **Cache responses** — Don't re-fetch identical queries
4. **Batch requests** — Reduce API call count
5. **Monitor usage** — Use Langfuse (free) to track costs
6. **Set token limits** — `max_tokens` prevents runaway costs
7. **Use smaller models** — For simple tasks, use 7B models
8. **Implement retries with backoff** — Avoid wasting credits on rate limits

---

## Useful Links

- **Groq Console**: https://console.groq.com
- **Together AI**: https://api.together.xyz
- **OpenRouter**: https://openrouter.ai
- **Mistral AI**: https://console.mistral.ai
- **Google AI Studio**: https://aistudio.google.com
- **Cohere Dashboard**: https://dashboard.cohere.com
- **Hugging Face**: https://huggingface.co
- **Pinecone Console**: https://app.pinecone.io
- **Langfuse**: https://cloud.langfuse.com
- **Supabase**: https://supabase.com
- **Vercel**: https://vercel.com
- **Railway**: https://railway.app
- **Fly.io**: https://fly.io

---

*Guide maintained for educational purposes. Free tier limits change — always verify on provider's website.*
