# Edureka AI API Cookbooks — Comprehensive Quickstart Guide

> 17 AI APIs. Working Python code. Production-ready patterns.
> Last updated: July 2026

---

## Table of Contents

1. [OpenAI API](#1-openai-api)
2. [Anthropic Claude API](#2-anthropic-claude-api)
3. [Google Gemini API](#3-google-gemini-api)
4. [Groq API](#4-groq-api)
5. [Cohere API](#5-cohere-api)
6. [Mistral API](#6-mistral-api)
7. [Together AI API](#7-together-ai-api)
8. [Replicate API](#8-replicate-api)
9. [Pinecone API](#9-pinecone-api)
10. [Qdrant API](#10-qdrant-api)
11. [LangChain API](#11-langchain-api)
12. [LlamaIndex API](#12-llamaindex-api)
13. [HuggingFace API](#13-huggingface-api)
14. [ElevenLabs API](#14-elevenlabs-api)
15. [AssemblyAI API](#15-assemblyai-api)
16. [Firecrawl API](#16-firecrawl-api)
17. [Perplexity API](#17-perplexity-api)
18. [Cross-API Recipes](#18-cross-api-recipes)
19. [Glossary](#19-glossary)

---

## 1. OpenAI API

**Provider:** OpenAI  
**Docs:** https://platform.openai.com/docs  
**SDK:** `openai`

### Install

```bash
pip install openai
```

### Setup

```python
import openai

# Set API key globally
openai.api_key = "sk-..."

# Or use environment variable (recommended)
# export OPENAI_API_KEY="sk-..."
client = openai.OpenAI()  # reads OPENAI_API_KEY from env
```

### Example 1 — Chat Completions

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum entanglement in 3 sentences."}
    ],
    temperature=0.7,
    max_tokens=300
)

print(response.choices[0].message.content)
# Tokens used: response.usage.total_tokens
```

### Example 2 — Streaming Chat

```python
from openai import OpenAI

client = OpenAI()

stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Write a haiku about coding."}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()
```

### Example 3 — Embeddings

```python
from openai import OpenAI

client = OpenAI()

response = client.embeddings.create(
    model="text-embedding-3-small",
    input=["The quick brown fox", "jumps over the lazy dog"]
)

for i, embedding in enumerate(response.data):
    print(f"Text {i}: {len(embedding.embedding)} dimensions")
# text-embedding-3-small: 1536 dimensions
# text-embedding-3-large: 3072 dimensions
```

### Example 4 — Vision (Image Understanding)

```python
from openai import OpenAI
import base64

client = OpenAI()

# From URL
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What's in this image?"},
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/photo.jpg"}
                }
            ]
        }
    ],
    max_tokens=500
)
print(response.choices[0].message.content)

# From local file
with open("photo.jpg", "rb") as f:
    base64_image = base64.b64encode(f.read()).decode("utf-8")

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Describe this image in detail."},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image}"
                    }
                }
            ]
        }
    ]
)
print(response.choices[0].message.content)
```

### Example 5 — Audio Transcription & TTS

```python
from openai import OpenAI

client = OpenAI()

# Transcription (Whisper)
with open("audio.mp3", "rb") as f:
    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=f,
        response_format="text"
    )
print(transcript)

# Text-to-Speech
response = client.audio.speech.create(
    model="tts-1-hd",
    voice="alloy",
    input="Hello, welcome to the Edureka AI API Cookbooks!"
)
response.stream_to_file("output.mp3")
```

### Example 6 — Function Calling

```python
import json
from openai import OpenAI

client = OpenAI()

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "City name"},
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
                },
                "required": ["location"]
            }
        }
    }
]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}],
    tools=tools,
    tool_choice="auto"
)

msg = response.choices[0].message
if msg.tool_calls:
    args = json.loads(msg.tool_calls[0].function.arguments)
    print(f"Function: {msg.tool_calls[0].function.name}")
    print(f"Arguments: {args}")
    # {'location': 'Tokyo', 'unit': 'celsius'}
```

### Example 7 — Assistants API (Persistent)

```python
from openai import OpenAI

client = OpenAI()

# Create an assistant
assistant = client.beta.assistants.create(
    name="Data Analyst",
    instructions="You analyze data and provide insights. Use Python for calculations.",
    model="gpt-4o",
    tools=[{"type": "code_interpreter"}]
)

# Create a thread
thread = client.beta.threads.create()

# Add a message
client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="Analyze this dataset: [1,2,3,4,5,6,7,8,9,10]. Calculate mean, median, std."
)

# Run the assistant
run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=assistant.id
)

# Poll for completion
import time
while run.status != "completed":
    time.sleep(1)
    run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)

# Get response
messages = client.beta.threads.messages.list(thread_id=thread.id)
for msg in messages.data:
    print(f"[{msg.role}]: {msg.content[0].text.value}")
```

### Use Cases

- Conversational AI, chatbots, virtual assistants
- Content generation, summarization, translation
- Code generation and debugging
- Image analysis and OCR
- Speech-to-text and text-to-speech
- Structured data extraction from natural language
- Autonomous agents with tool use

### Pricing (as of mid-2026)

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Context Window |
|-------|----------------------|------------------------|----------------|
| gpt-4o | $2.50 | $10.00 | 128K |
| gpt-4o-mini | $0.15 | $0.60 | 128K |
| gpt-4-turbo | $10.00 | $30.00 | 128K |
| o1 | $15.00 | $60.00 | 200K |
| o1-mini | $3.00 | $12.00 | 128K |
| o3-mini | $1.10 | $4.40 | 200K |
| text-embedding-3-small | $0.02 | — | — |
| text-embedding-3-large | $0.13 | — | — |
| Whisper | $0.006/min | — | — |
| TTS (tts-1) | $15/1M chars | — | — |
| TTS HD (tts-1-hd) | $30/1M chars | — | — |

### Best Practices

- Use `gpt-4o-mini` for simple tasks to save costs; `gpt-4o` for complex reasoning
- Set `temperature=0` for deterministic outputs (factual tasks), higher for creative work
- Use streaming for long responses to improve perceived latency
- Cache embeddings — they're deterministic for the same input
- Use function calling instead of free-form JSON extraction for reliability
- Implement retry logic with exponential backoff for rate limits
- Store API keys in environment variables, never in source code
- Monitor token usage with `response.usage` to control costs

---

## 2. Anthropic Claude API

**Provider:** Anthropic  
**Docs:** https://docs.anthropic.com  
**SDK:** `anthropic`

### Install

```bash
pip install anthropic
```

### Setup

```python
import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env
```

### Example 1 — Basic Messages

```python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What are the 3 laws of thermodynamics? Explain simply."}
    ]
)
print(message.content[0].text)
print(f"Stop reason: {message.stop_reason}")
print(f"Input tokens: {message.usage.input_tokens}, Output: {message.usage.output_tokens}")
```

### Example 2 — System Prompt & Multi-turn

```python
import anthropic

client = anthropic.Anthropic()

conversation = [
    {"role": "user", "content": "Hi, I'm learning Python."}
]

# First turn
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    system="You are a patient Python tutor. Keep explanations clear and provide examples.",
    messages=conversation
)

assistant_reply = response.content[0].text
print(f"Claude: {assistant_reply}")

# Add to conversation
conversation.append({"role": "assistant", "content": assistant_reply})
conversation.append({"role": "user", "content": "How do I read a CSV file?"})

# Second turn
response2 = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    system="You are a patient Python tutor. Keep explanations clear and provide examples.",
    messages=conversation
)
print(f"Claude: {response2.content[0].text}")
```

### Example 3 — Streaming

```python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a short story about a robot learning to cook."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
print()
```

### Example 4 — Vision (Image Analysis)

```python
import anthropic
import base64

client = anthropic.Anthropic()

with open("diagram.png", "rb") as f:
    image_data = base64.standard_b64encode(f.read()).decode("utf-8")

message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/png",
                        "data": image_data
                    }
                },
                {
                    "type": "text",
                    "text": "Explain this architecture diagram in detail."
                }
            ]
        }
    ]
)
print(message.content[0].text)
```

### Example 5 — Tool Use

```python
import json
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "calculate",
        "description": "Evaluate a mathematical expression",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {"type": "string", "description": "Math expression like '2+2*3'"}
            },
            "required": ["expression"]
        }
    }
]

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What is 15 * (3 + 7)?"}]
)

for block in response.content:
    if block.type == "tool_use":
        result = eval(block.input["expression"])  # don't do this in prod!
        print(f"Tool call: {block.name}({block.input})")
        print(f"Result: {result}")
    elif block.type == "text":
        print(block.text)

# Feed result back
if response.stop_reason == "tool_use":
    tool_result = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        tools=tools,
        messages=[
            {"role": "user", "content": "What is 15 * (3 + 7)?"},
            {"role": "assistant", "content": response.content},
            {
                "role": "user",
                "content": [
                    {
                        "type": "tool_result",
                        "tool_use_id": response.content[-1].id,
                        "content": str(result)
                    }
                ]
            }
        ]
    )
    print(tool_result.content[0].text)
```

### Use Cases

- Long-document analysis (200K context window)
- Complex reasoning and coding tasks
- Tool-use agents and agentic workflows
- Content generation with nuanced tone control
- Document Q&A and summarization
- Multi-modal analysis (images + text)

### Pricing (as of mid-2026)

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Context Window |
|-------|----------------------|------------------------|----------------|
| claude-opus-4-20250514 | $15.00 | $75.00 | 200K |
| claude-sonnet-4-20250514 | $3.00 | $15.00 | 200K |
| claude-3-5-haiku-20241022 | $0.80 | $4.00 | 200K |

### Best Practices

- Claude responds well to detailed system prompts — invest in prompt engineering
- Use the `system` parameter rather than putting instructions in messages
- For long outputs, set generous `max_tokens` (up to 8192)
- Tool use is more reliable when you provide detailed descriptions and examples
- Use streaming for responses longer than a paragraph
- Claude is cautious by design — be explicit about what you want
- For code tasks, specify the language and desired format in the prompt

---

## 3. Google Gemini API

**Provider:** Google DeepMind  
**Docs:** https://ai.google.dev/docs  
**SDK:** `google-genai`

### Install

```bash
pip install google-genai
```

### Setup

```python
from google import genai

client = genai.Client()  # reads GEMINI_API_KEY from env
```

### Example 1 — Chat

```python
from google import genai

client = genai.Client()
model = "gemini-2.5-flash"

response = client.models.generate_content(
    model=model,
    contents="Explain the difference between TCP and UDP in simple terms."
)
print(response.text)
print(f"Tokens: {response.usage_metadata}")
```

### Example 2 — Multimodal (Image + Text)

```python
from google import genai
from pathlib import Path

client = genai.Client()

image = Part.from_bytes(
    data=Path("chart.png").read_bytes(),
    mime_type="image/png"
)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[
        image,
        "Analyze this chart. What trends do you see? Provide data points."
    ]
)
print(response.text)
```

### Example 3 — Function Calling

```python
from google import genai
from google.genai import types

client = genai.Client()

def search_products(query: str, max_price: float = 100.0):
    """Search for products matching a query under a price limit."""
    return {"results": [{"name": "Widget", "price": 29.99}, {"name": "Gadget", "price": 79.99}]}

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Find me a widget under $50",
    config=types.GenerateContentConfig(
        tools=[search_products]
    )
)

for part in response.candidates[0].content.parts:
    if part.function_call:
        print(f"Function: {part.function_call.name}")
        print(f"Args: {dict(part.function_call.args)}")
```

### Example 4 — Streaming

```python
from google import genai

client = genai.Client()

for chunk in client.models.generate_content_stream(
    model="gemini-2.5-flash",
    contents="Write a poem about artificial intelligence, one stanza at a time."
):
    print(chunk.text, end="", flush=True)
print()
```

### Example 5 — Grounding with Google Search

```python
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="What are the latest developments in nuclear fusion research?",
    config=types.GenerateContentConfig(
        tools=[types.Tool(google_search=types.GoogleSearch())]
    )
)
print(response.text)

# Show grounding metadata
if response.grounding_metadata:
    print("\nSources:")
    for source in response.grounding_metadata.grounding_chunks:
        print(f"  - {source.web.title}: {source.web.uri}")
```

### Use Cases

- Multimodal understanding (text, images, video, audio)
- Code generation and explanation
- Search-augmented generation
- Long-context analysis (1M+ tokens for Gemini 2.5 Pro)
- Function calling and structured output
- Real-time applications (low latency Flash models)

### Pricing (as of mid-2026)

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Context Window |
|-------|----------------------|------------------------|----------------|
| gemini-2.5-pro | $1.25 ($2.50 >200K) | $10.00 ($10.00 >200K) | 1M |
| gemini-2.5-flash | $0.15 ($0.30 >200K) | $0.60 ($1.20 >200K) | 1M |
| gemini-2.0-flash | $0.10 | $0.40 | 1M |
| Free tier: 15 RPM, 1M tokens/day for Flash models |

### Best Practices

- Use `gemini-2.5-flash` for speed/cost; `gemini-2.5-pro` for complex reasoning
- Free tier is generous — great for prototyping
- Grounding with Google Search gives factual, up-to-date answers
- Use `types.GenerateContentConfig` for structured output and safety settings
- Multimodal inputs work best with clear, specific questions
- For function calling, use type hints for automatic schema generation

---

## 4. Groq API

**Provider:** Groq  
**Docs:** https://console.groq.com/docs  
**SDK:** `groq` (OpenAI-compatible)

### Install

```bash
pip install groq
```

### Setup

```python
from groq import Groq

client = Groq()  # reads GROQ_API_KEY from env
```

### Example 1 — Chat Completions (Ultra-Fast)

```python
from groq import Groq

client = Groq()

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {"role": "user", "content": "Write a Python function to check if a number is prime."}
    ],
    temperature=0.7,
    max_tokens=1024
)
print(response.choices[0].message.content)
print(f"Tokens/sec: {response.x_groq.usage.run_time_tokens_per_second}")
```

### Example 2 — Streaming

```python
from groq import Groq

client = Groq()

stream = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "Explain REST APIs like I'm 5."}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()
```

### Example 3 — Whisper Transcription

```python
from groq import Groq

client = Groq()

with open("audio.mp3", "rb") as f:
    transcript = client.audio.transcriptions.create(
        model="whisper-large-v3",
        file=f,
        language="en",
        response_format="verbose_json"
    )
print(transcript.text)
print(f"Language: {transcript.language}, Duration: {transcript.duration}s")
```

### Example 4 — Vision

```python
from groq import Groq

client = Groq()

response = client.chat.completions.create(
    model="llama-3.2-90b-vision-preview",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What do you see in this image?"},
                {"type": "image_url", "image_url": {"url": "https://example.com/photo.jpg"}}
            ]
        }
    ]
)
print(response.choices[0].message.content)
```

### Example 5 — Structured Output

```python
from groq import Groq
import json

client = Groq()

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {"role": "user", "content": "List 3 programming languages with their year created and primary use case. Return as JSON array."}
    ],
    response_format={"type": "json_object"}
)
data = json.loads(response.choices[0].message.content)
print(json.dumps(data, indent=2))
```

### Available Models

| Model | Speed | Context | Best For |
|-------|-------|---------|----------|
| llama-3.3-70b-versatile | ~300 tok/s | 128K | General purpose |
| llama-3.1-8b-instant | ~700 tok/s | 128K | Fast, simple tasks |
| gemma2-9b-it | ~500 tok/s | 8K | Lightweight chat |
| whisper-large-v3 | ~realtime | — | Transcription |
| mixtral-8x7b-32768 | ~250 tok/s | 32K | Long context |

### Pricing (as of mid-2026)

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| llama-3.3-70b-versatile | $0.59 | $0.79 |
| llama-3.1-8b-instant | $0.05 | $0.08 |
| gemma2-9b-it | $0.10 | $0.10 |
| whisper-large-v3 | $0.111/min | — |
| Free tier: 30 RPM, 14,400 req/day |

### Best Practices

- Groq's main advantage is speed — use it when latency matters
- OpenAI-compatible API, so existing OpenAI code works with minimal changes
- Free tier is generous for prototyping
- Not suitable for very long outputs (output token limits)
- Use for rapid iteration, then switch to more powerful models for production
- Whisper transcription is extremely fast and affordable

---

## 5. Cohere API

**Provider:** Cohere  
**Docs:** https://docs.cohere.com  
**SDK:** `cohere`

### Install

```bash
pip install cohere
```

### Setup

```python
import cohere

co = cohere.Client()  # reads COHERE_API_KEY from env
```

### Example 1 — Chat

```python
import cohere

co = cohere.Client()

response = co.chat(
    model="command-a-03-2025",
    message="What are the key differences between microservices and monolithic architectures?",
    preamble="You are a senior software architect. Provide practical advice."
)
print(response.text)
```

### Example 2 — Embeddings

```python
import cohere

co = cohere.Client()

response = co.embed(
    model="embed-english-v3.0",
    texts=[
        "Machine learning is a subset of AI",
        "Deep learning uses neural networks",
        "Cooking pasta requires boiling water"
    ],
    input_type="search_document",
    embedding_types=["float"]
)

# embeddings are in response.embeddings.float
for i, emb in enumerate(response.embeddings.float):
    print(f"Text {i}: {len(emb)} dimensions")
```

### Example 3 — Rerank

```python
import cohere

co = cohere.Client()

documents = [
    "Python is a programming language",
    "The quick brown fox jumps over the lazy dog",
    "Machine learning algorithms require training data",
    "Photosynthesis converts sunlight to energy",
    "Neural networks are inspired by biological brains"
]

response = co.rerank(
    model="rerank-english-v3.0",
    query="What is machine learning?",
    documents=documents,
    top_n=3
)

for result in response.results:
    print(f"[{result.relevance_score:.3f}] {documents[result.index]}")
```

### Example 4 — Classify

```python
import cohere

co = cohere.Client()

response = co.classify(
    model="embed-english-v3.0",
    inputs=[
        "I love this product, it's amazing!",
        "This is terrible, worst purchase ever",
        "The weather is nice today",
        "Shipping was fast and quality is great"
    ],
    examples=[
        ("Great product!", "positive"),
        ("Terrible quality", "negative"),
        ("Meeting at 3pm", "neutral"),
        ("I'm very happy with this", "positive"),
    ]
)

for classification in response.classifications:
    print(f"'{classification.input}' -> {classification.prediction} ({classification.confidence:.2f})")
```

### Example 5 — Summarize

```python
import cohere

co = cohere.Client()

text = """
Artificial intelligence has seen remarkable progress in recent years. Large language
models like GPT-4, Claude, and Gemini have demonstrated unprecedented capabilities in
understanding and generating human-like text. These models are trained on vast corpora
of text data and can perform tasks ranging from translation to code generation. The
rise of AI has sparked both excitement about potential applications and concern about
job displacement, ethical implications, and the need for regulation. Companies like
OpenAI, Anthropic, Google, and Meta are investing billions in AI research, while
startups are finding niche applications in healthcare, education, finance, and more.
"""

response = co.summarize(
    model="summarize-english-v3.0",
    text=text,
    length="short",
    format="paragraph",
    additional_command="Focus on the business implications"
)
print(response.summary)
```

### Use Cases

- RAG (Retrieval-Augmented Generation) with embeddings + rerank
- Document classification and routing
- Text summarization
- Semantic search
- Content generation and rewriting

### Pricing (as of mid-2026)

| Feature | Price |
|---------|-------|
| Command A | $2.50/$10.00 per 1M tokens (input/output) |
| Command R+ | $2.50/$10.00 per 1M tokens |
| Embed v3 | $0.10 per 1M tokens |
| Rerank v3 | $2.00 per 1K searches |
| Classify | $0.10 per 1K classifies |
| Free trial: $5 credit |

### Best Practices

- Cohere's rerank is excellent for improving RAG retrieval quality
- Use `embed-english-v3.0` for English, `embed-multilingual-v3.0` for multilingual
- Specify `input_type` in embeddings (search_document vs search_query) for best results
- Rerank as a second pass after vector search dramatically improves relevance
- Classify is very cost-effective for categorization tasks

---

## 6. Mistral API

**Provider:** Mistral AI  
**Docs:** https://docs.mistral.ai  
**SDK:** `mistralai`

### Install

```bash
pip install mistralai
```

### Setup

```python
from mistralai import Mistral

client = Mistral()  # reads MISTRAL_API_KEY from env
```

### Example 1 — Chat Completions

```python
from mistralai import Mistral

client = Mistral()

response = client.chat.complete(
    model="mistral-large-latest",
    messages=[
        {"role": "system", "content": "You are a helpful coding assistant."},
        {"role": "user", "content": "Write a Python decorator that retries a function up to 3 times on failure."}
    ],
    temperature=0.3
)
print(response.choices[0].message.content)
```

### Example 2 — Function Calling

```python
from mistralai import Mistral
import json

client = Mistral()

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_stock_price",
            "description": "Get current stock price",
            "parameters": {
                "type": "object",
                "properties": {
                    "symbol": {"type": "string", "description": "Stock ticker symbol"}
                },
                "required": ["symbol"]
            }
        }
    }
]

response = client.chat.complete(
    model="mistral-large-latest",
    messages=[{"role": "user", "content": "What's the price of AAPL?"}],
    tools=tools,
    tool_choice="auto"
)

msg = response.choices[0].message
if msg.tool_calls:
    for tc in msg.tool_calls:
        print(f"Call: {tc.function.name}({tc.function.arguments})")
```

### Example 3 — Embeddings

```python
from mistralai import Mistral

client = Mistral()

response = client.embeddings.create(
    model="mistral-embed",
    input=["Hello world", "Goodbye world"]
)

for i, emb in enumerate(response.data):
    print(f"Embedding {i}: {len(emb.embedding)} dimensions")
# mistral-embed: 1024 dimensions
```

### Example 4 — Streaming

```python
from mistralai import Mistral

client = Mistral()

stream = client.chat.complete_stream(
    model="mistral-large-latest",
    messages=[{"role": "user", "content": "Explain quantum computing in simple terms."}]
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()
```

### Available Models

| Model | Parameters | Context | Best For |
|-------|-----------|---------|----------|
| mistral-large-latest | — | 128K | Complex reasoning |
| mistral-small-latest | — | 32K | Fast, cost-effective |
| codestral-latest | — | 256K | Code generation |
| open-mistral-7b | 7B | 32K | Lightweight |
| mistral-embed | — | 8K | Embeddings |

### Pricing (as of mid-2026)

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| mistral-large-latest | $2.00 | $6.00 |
| mistral-small-latest | $0.10 | $0.30 |
| codestral-latest | $0.30 | $0.90 |
| mistral-embed | $0.10 | — |

### Best Practices

- Mistral models are strong at coding tasks — consider Codestral for code generation
- OpenAI-compatible API pattern, easy to switch from OpenAI
- `mistral-small` is very cost-effective for simpler tasks
- European company — consider for GDPR-sensitive applications
- Free tier available for experimentation

---

## 7. Together AI API

**Provider:** Together AI  
**Docs:** https://docs.together.ai  
**SDK:** `together` (OpenAI-compatible)

### Install

```bash
pip install together
```

### Setup

```python
from together import Together

client = Together()  # reads TOGETHER_API_KEY from env
```

### Example 1 — Chat with Open-Source Models

```python
from together import Together

client = Together()

response = client.chat.completions.create(
    model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
    messages=[
        {"role": "user", "content": "Compare and contrast SQL and NoSQL databases."}
    ],
    temperature=0.7,
    max_tokens=1024
)
print(response.choices[0].message.content)
```

### Example 2 — Embeddings

```python
from together import Together

client = Together()

response = client.embeddings.create(
    model="togetherputerai/bge-large-en-v1.5-v0.5",
    input=["First document text", "Second document text"]
)

for i, emb in enumerate(response.data):
    print(f"Embedding {i}: {len(emb.embedding)} dimensions")
```

### Example 3 — Image Generation

```python
from together import Together

client = Together()

response = client.images.generate(
    model="black-forest-labs/FLUX.1.1-pro",
    prompt="A serene Japanese garden with cherry blossoms, digital art, highly detailed",
    width=1024,
    height=1024,
    steps=28,
    n=1
)

print(response.data[0].url)
```

### Example 4 — Streaming with Multiple Models

```python
from together import Together

client = Together()

models = [
    "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    "Qwen/Qwen2.5-72B-Instruct-Turbo"
]

for model in models:
    print(f"\n--- {model} ---")
    stream = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": "What is the meaning of life? (one sentence)"}],
        stream=True
    )
    for chunk in stream:
        if chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="", flush=True)
    print()
```

### Popular Models Available

- meta-llama/Llama-3.3-70B-Instruct-Turbo
- Qwen/Qwen2.5-72B-Instruct-Turbo
- deepseek-ai/DeepSeek-R1
- mistralai/Mistral-7B-Instruct-v0.3
- black-forest-labs/FLUX.1.1-pro (image gen)
- stabilityai/stable-diffusion-xl-base-1.0

### Pricing (per 1M tokens, varies by model)

| Model | Input | Output |
|-------|-------|--------|
| Llama-3.3-70B | $0.88 | $0.88 |
| Llama-3.1-8B | $0.10 | $0.10 |
| DeepSeek-R1 | $0.55 | $2.19 |
| FLUX.1.1-pro | — | $0.04/image |

### Best Practices

- Great for accessing open-source models without managing infrastructure
- OpenAI-compatible API — easy migration
- Pricing is competitive for open-source inference
- Use Turbo variants for lower latency
- Check model availability — new models added frequently
- Serverless inference means no GPU management

---

## 8. Replicate API

**Provider:** Replicate  
**Docs:** https://replicate.com/docs  
**SDK:** `replicate`

### Install

```bash
pip install replicate
```

### Setup

```python
import replicate
# Set REPLICATE_API_TOKEN environment variable, or:
# replicate.Client(api_token="r8_...")
```

### Example 1 — Run Any Open-Source Model

```python
import replicate

output = replicate.run(
    "meta/meta-llama-3.1-70b-instruct",
    input={
        "prompt": "Write a haiku about machine learning",
        "max_tokens": 256,
        "temperature": 0.7
    }
)
print("".join(output))
```

### Example 2 — Image Generation (Stable Diffusion)

```python
import replicate

output = replicate.run(
    "stability-ai/stable-diffusion-3",
    input={
        "prompt": "A cyberpunk cityscape at night, neon lights, rain, detailed",
        "num_outputs": 1,
        "aspect_ratio": "16:9",
        "output_format": "webp"
    }
)
for url in output:
    print(url)
    # Download: requests.get(url)
```

### Example 3 — Run with Webhook

```python
import replicate

prediction = replicate.predictions.create(
    model="meta/meta-llama-3.1-70b-instruct",
    input={
        "prompt": "Explain the CAP theorem",
        "max_tokens": 1024
    },
    webhook="https://your-server.com/webhook",
    webhook_events_filter=["completed"]
)
print(f"Prediction ID: {prediction.id}")
print(f"Status: {prediction.status}")
```

### Example 4 — Fine-tuning

```python
import replicate

# Create a fine-tuning training
training = replicate.trainings.create(
    model="stability-ai/sdxl",
    version="39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    destination="your-username/my-fine-tuned-model",
    input={
        "input_images": "your-bucket/training-images.zip",
        "trigger_word": "MYSTYLE",
        "max_train_steps": 1500,
        "learning_rate": 0.0001
    }
)
print(f"Training started: {training.id}")
```

### Use Cases

- Run any open-source model (LLaMA, Stable Diffusion, Whisper, etc.)
- Image generation and manipulation
- Video generation
- Audio processing
- Model fine-tuning
- Serverless GPU inference without infrastructure

### Pricing

- Pay per second of GPU time
- NVIDIA T4: ~$0.000225/sec (~$0.81/hr)
- NVIDIA A40: ~$0.000465/sec (~$1.67/hr)
- NVIDIA A100 (80GB): ~$0.001050/sec (~$3.78/hr)
- Free tier: $5 monthly credit
- No charge when models aren't running

### Best Practices

- Use `replicate.run()` for synchronous, `replicate.predictions.create()` for async
- Webhooks are better than polling for production
- Models auto-sleep when not in use — you only pay for compute time
- Check model pages for required input parameters
- Pin model versions for reproducibility
- Great for prototyping with state-of-the-art open-source models

---

## 9. Pinecone API

**Provider:** Pinecone  
**Docs:** https://docs.pinecone.io  
**SDK:** `pinecone-client`

### Install

```bash
pip install pinecone-client
```

### Setup

```python
from pinecone import Pinecone

pc = Pinecone()  # reads PINECONE_API_KEY from env
index = pc.Index("my-index")
```

### Example 1 — Create Index & Upsert

```python
from pinecone import Pinecone, ServerlessSpec

pc = Pinecone()

# Create index
pc.create_index(
    name="products",
    dimension=1536,
    metric="cosine",
    spec=ServerlessSpec(
        cloud="aws",
        region="us-east-1"
    )
)

index = pc.Index("products")

# Upsert vectors
vectors = [
    {"id": "doc1", "values": [0.1]*1536, "metadata": {"category": "electronics", "price": 29.99}},
    {"id": "doc2", "values": [0.2]*1536, "metadata": {"category": "clothing", "price": 49.99}},
    {"id": "doc3", "values": [0.3]*1536, "metadata": {"category": "electronics", "price": 99.99}}
]
index.upsert(vectors=vectors)
```

### Example 2 — Query with Metadata Filtering

```python
import numpy as np
from pinecone import Pinecone

pc = Pinecone()
index = pc.Index("products")

query_vector = [0.15] * 1536

# Simple query
results = index.query(
    vector=query_vector,
    top_k=5,
    include_metadata=True
)

for match in results.matches:
    print(f"ID: {match.id}, Score: {match.score:.4f}, Metadata: {match.metadata}")

# Filtered query
results = index.query(
    vector=query_vector,
    top_k=5,
    include_metadata=True,
    filter={"category": {"$eq": "electronics"}, "price": {"$lt": 50.0}}
)

for match in results.matches:
    print(f"ID: {match.id}, Score: {match.score:.4f}, Price: {match.metadata['price']}")
```

### Example 3 — Namespaces

```python
from pinecone import Pinecone

pc = Pinecone()
index = pc.Index("products")

# Upsert to specific namespaces
index.upsert(
    vectors=[
        {"id": "user1_doc", "values": [0.1]*1536, "metadata": {"source": "upload"}},
    ],
    namespace="user-123"
)

index.upsert(
    vectors=[
        {"id": "user2_doc", "values": [0.2]*1536, "metadata": {"source": "api"}},
    ],
    namespace="user-456"
)

# Query within a namespace
results = index.query(
    vector=[0.1]*1536,
    top_k=5,
    namespace="user-123"
)

# Delete entire namespace
index.delete(delete_all=True, namespace="user-123")

# List stats per namespace
stats = index.describe_index_stats()
print(stats.namespaces)
```

### Example 4 — Fetch & Update

```python
from pinecone import Pinecone

pc = Pinecone()
index = pc.Index("products")

# Fetch by IDs
fetched = index.fetch(ids=["doc1", "doc2"])
for id, vector in fetched.vectors.items():
    print(f"{id}: metadata={vector.metadata}")

# Update metadata
index.update(
    id="doc1",
    metadata={"category": "electronics", "price": 24.99, "on_sale": True}
)

# Delete
index.delete(ids=["doc3"])
```

### Use Cases

- Vector search for RAG applications
- Semantic search engines
- Recommendation systems
- Anomaly detection
- Multi-tenant applications (namespaces)
- Hybrid search (vector + metadata filtering)

### Pricing (Serverless, as of mid-2026)

| Tier | Storage | Reads | Writes | Price |
|------|---------|-------|--------|-------|
| Starter | 2GB | — | — | Free |
| Standard | Pay-as-you-go | $0.0001/1K reads | $1/1M writes | ~$70/mo for 10GB |
| Enterprise | Custom | Custom | Custom | Custom |

### Best Practices

- Use `cosine` metric for most text similarity use cases
- Use `dotproduct` for models that output normalized embeddings
- Metadata filtering reduces search scope and improves speed
- Namespaces provide logical separation without separate indexes
- Batch upserts for better throughput (up to 1000 vectors/batch)
- Use `include_metadata=True` only when you need metadata (saves bandwidth)

---

## 10. Qdrant API

**Provider:** Qdrant  
**Docs:** https://qdrant.tech/documentation/  
**SDK:** `qdrant-client`

### Install

```bash
pip install qdrant-client
```

### Setup

```python
from qdrant_client import QdrantClient

# Cloud
client = QdrantClient(
    url="https://your-cluster.qdrant.io",
    api_key="your-api-key"
)

# Local
client = QdrantClient(url="http://localhost:6333")
```

### Example 1 — Create Collection & Upsert

```python
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct

client = QdrantClient(url="http://localhost:6333")

# Create collection
client.create_collection(
    collection_name="documents",
    vectors_config=VectorParams(
        size=1536,
        distance=Distance.COSINE
    )
)

# Upsert points
client.upsert(
    collection_name="documents",
    points=[
        PointStruct(
            id=1,
            vector=[0.1]*1536,
            payload={"text": "Machine learning is great", "category": "tech", "year": 2024}
        ),
        PointStruct(
            id=2,
            vector=[0.2]*1536,
            payload={"text": "Cooking tips for beginners", "category": "lifestyle", "year": 2025}
        ),
        PointStruct(
            id=3,
            vector=[0.3]*1536,
            payload={"text": "Deep learning fundamentals", "category": "tech", "year": 2024}
        )
    ]
)
```

### Example 2 — Search with Filters

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue, Range

client = QdrantClient(url="http://localhost:6333")

# Simple search
results = client.search(
    collection_name="documents",
    query_vector=[0.15]*1536,
    limit=5
)

for result in results:
    print(f"ID: {result.id}, Score: {result.score:.4f}, Payload: {result.payload}")

# Filtered search
results = client.search(
    collection_name="documents",
    query_vector=[0.15]*1536,
    query_filter=Filter(
        must=[
            FieldCondition(key="category", match=MatchValue(value="tech")),
            FieldCondition(key="year", range=Range(gte=2024))
        ]
    ),
    limit=5
)

for result in results:
    print(f"ID: {result.id}, Score: {result.score:.4f}, Text: {result.payload['text']}")
```

### Example 3 — Payload Indexing

```python
from qdrant_client import QdrantClient
from qdrant_client.models import PayloadSchemaType

client = QdrantClient(url="http://localhost:6333")

# Create payload index for faster filtering
client.create_payload_index(
    collection_name="documents",
    field_name="category",
    field_schema=PayloadSchemaType.KEYWORD
)

client.create_payload_index(
    collection_name="documents",
    field_name="year",
    field_schema=PayloadSchemaType.INTEGER
)

# Now filtered searches are much faster
```

### Example 4 — Scroll & Delete

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue

client = QdrantClient(url="http://localhost:6333")

# Scroll through points
points, next_offset = client.scroll(
    collection_name="documents",
    limit=10,
    with_payload=True
)

# Delete by filter
client.delete(
    collection_name="documents",
    points_selector=Filter(
        must=[
            FieldCondition(key="category", match=MatchValue(value="lifestyle"))
        ]
    )
)

# Get collection info
info = client.get_collection("documents")
print(f"Points: {info.points_count}, Status: {info.status}")
```

### Use Cases

- High-performance vector search
- Multi-modal search (text, images, audio)
- Real-time recommendation engines
- Anomaly detection with payload filtering
- On-premise vector search (self-hosted option)

### Pricing (Qdrant Cloud, as of mid-2026)

| Tier | Memory | Price |
|------|--------|-------|
| Free | 1GB | $0/month |
| Standard | 2GB | ~$25/month |
| Performance | 8GB+ | ~$90+/month |
| Self-hosted | Unlimited | Free (open-source) |

### Best Practices

- Use payload indexing for fields you filter on frequently
- Qdrant supports on-premise deployment — good for data sovereignty
- Use `distance=Distance.COSINE` for normalized embeddings
- Use `distance=Distance.DOT` for un-normalized vectors
- Batch operations for bulk inserts (100-500 points per batch)
- Use point IDs as strings (UUIDs) for easier management
- Collection alias feature for zero-downtime migrations

---

## 11. LangChain API

**Provider:** LangChain  
**Docs:** https://python.langchain.com  
**SDK:** `langchain`, `langchain-openai`, `langchain-community`

### Install

```bash
pip install langchain langchain-openai langchain-community
```

### Setup

```python
import os
os.environ["OPENAI_API_KEY"] = "sk-..."
```

### Example 1 — Basic Chain

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4o", temperature=0.7)
prompt = ChatPromptTemplate.from_template(
    "You are a helpful assistant. Answer this question: {question}"
)
parser = StrOutputParser()

chain = prompt | llm | parser
result = chain.invoke({"question": "What is the difference between REST and GraphQL?"})
print(result)
```

### Example 2 — RAG Pipeline

```python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# Create vector store from documents
from langchain_core.documents import Document

docs = [
    Document(page_content="Python was created by Guido van Rossum in 1991.", metadata={"source": "wiki"}),
    Document(page_content="JavaScript was created by Brendan Eich in 1995.", metadata={"source": "wiki"}),
    Document(page_content="Rust was developed by Mozilla and first released in 2015.", metadata={"source": "wiki"}),
]

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = FAISS.from_documents(docs, embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

prompt = ChatPromptTemplate.from_template("""
Answer based on the context. If context doesn't contain the answer, say so.

Context: {context}
Question: {question}
""")

llm = ChatOpenAI(model="gpt-4o")

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

answer = rag_chain.invoke("When was Python created?")
print(answer)
```

### Example 3 — Agent with Tools

```python
from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate

@tool
def calculator(expression: str) -> str:
    """Calculate a mathematical expression."""
    return str(eval(expression))

@tool
def get_word_count(text: str) -> str:
    """Count words in text."""
    return str(len(text.split()))

llm = ChatOpenAI(model="gpt-4o")
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant with access to tools."),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}")
])

agent = create_tool_calling_agent(llm, [calculator, get_word_count], prompt)
executor = AgentExecutor(agent=agent, tools=[calculator, get_word_count], verbose=True)

result = executor.invoke({"input": "What is 15% of 847, and how many words is this question?"})
print(result["output"])
```

### Example 4 — Conversation Memory

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

prompt = ChatPromptTemplate.from_messages([
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])

llm = ChatOpenAI(model="gpt-4o")
chain = prompt | llm

# Session-based memory
store = {}

def get_session_history(session_id):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

chain_with_history = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="history"
)

# Use
config = {"configurable": {"session_id": "user-123"}}
result1 = chain_with_history.invoke({"input": "My name is Alice."}, config=config)
print(result1.content)

result2 = chain_with_history.invoke({"input": "What's my name?"}, config=config)
print(result2.content)
```

### Use Cases

- RAG pipelines with document retrieval
- Multi-step reasoning agents
- Conversational AI with memory
- Document processing and analysis
- Code generation agents
- Data extraction pipelines

### Pricing

- LangChain itself is free and open-source
- You pay for the underlying LLM providers
- LangSmith (observability platform):
  - Developer: Free (5K runs/mo)
  - Plus: $39/mo (10K runs/mo)
  - Enterprise: Custom

### Best Practices

- Use LCEL (LangChain Expression Language) with the pipe `|` operator for chains
- Prefer `RunnablePassthrough` for cleaner chain composition
- Use `FAISS` for local vector search, Pinecone/Qdrant for production
- Always add error handling with `try/except` in tool definitions
- Use LangSmith for debugging and monitoring in production
- Keep prompts in templates, not hardcoded in code
- Structure chains for testability — each component should be independently testable

---

## 12. LlamaIndex API

**Provider:** LlamaIndex  
**Docs:** https://docs.llamaindex.ai  
**SDK:** `llama-index`

### Install

```bash
pip install llama-index llama-index-llms-openai llama-index-embeddings-openai
```

### Setup

```python
import os
os.environ["OPENAI_API_KEY"] = "sk-..."
```

### Example 1 — Basic Query Engine

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

# Load documents from a directory
documents = SimpleDirectoryReader("./data").load_data()

# Build index
index = VectorStoreIndex.from_documents(documents)

# Query
query_engine = index.as_query_engine()
response = query_engine.query("What are the main topics covered in these documents?")
print(response)

# Show source nodes
for node in response.source_nodes:
    print(f"Score: {node.score:.4f} | {node.text[:100]}...")
```

### Example 2 — Custom LLM & Embeddings

```python
from llama_index.core import VectorStoreIndex, Settings
from llama_index.llms_anthropic import Anthropic
from llama_index.embeddings_openai import OpenAIEmbedding

# Configure globally
Settings.llm = Anthropic(model="claude-sonnet-4-20250514", temperature=0)
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")
Settings.chunk_size = 1024
Settings.chunk_overlap = 20

from llama_index.core import SimpleDirectoryReader

documents = SimpleDirectoryReader("./data").load_data()
index = VectorStoreIndex.from_documents(documents)

query_engine = index.as_query_engine()
response = query_engine.query("Summarize the key findings.")
print(response)
```

### Example 3 — Router Query Engine

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.core.query_engine import RouterQueryEngine
from llama_index.core.selectors import LLMSingleSelector

# Build two different indexes
technical_docs = SimpleDirectoryReader("./technical").load_data()
business_docs = SimpleDirectoryReader("./business").load_data()

tech_index = VectorStoreIndex.from_documents(technical_docs)
biz_index = VectorStoreIndex.from_documents(business_docs)

# Create tools
tech_tool = QueryEngineTool(
    query_engine=tech_index.as_query_engine(),
    metadata=ToolMetadata(name="technical_docs", description="Technical documentation about architecture, APIs, and implementation")
)

biz_tool = QueryEngineTool(
    query_engine=biz_index.as_query_engine(),
    metadata=ToolMetadata(name="business_docs", description="Business docs about strategy, revenue, and market analysis")
)

# Router automatically picks the right source
router = RouterQueryEngine(
    selector=LLMSingleSelector.from_defaults(),
    query_engine_tools=[tech_tool, biz_tool]
)

response = router.query("What is the system architecture?")
print(response)
```

### Example 4 — RAG with Chat History

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.memory import ChatMemoryBuffer

documents = SimpleDirectoryReader("./data").load_data()
index = VectorStoreIndex.from_documents(documents)

# Create chat engine with memory
chat_engine = index.as_chat_engine(
    chat_mode="condense_plus_context",
    memory=ChatMemoryBuffer.from_defaults(token_limit=4096),
    verbose=True
)

# Multi-turn conversation
response1 = chat_engine.chat("What documents do you have?")
print(response1)

response2 = chat_engine.chat("Tell me more about the first topic.")
print(response2)

response3 = chat_engine.chat("How does that relate to the second topic?")
print(response3)
```

### Use Cases

- Document Q&A and semantic search
- Multi-document analysis and synthesis
- Research agents with source routing
- Conversational document exploration
- Structured data indexing (SQL, CSV, JSON)
- Knowledge graph construction

### Pricing

- LlamaIndex is free and open-source
- You pay for underlying LLM/embedding providers
- LlamaCloud (managed): Free tier available, then pay-as-you-go

### Best Practices

- Use appropriate chunk sizes (512-1024 tokens for most use cases)
- Set chunk_overlap to 10-20% of chunk_size for context continuity
- RouterQueryEngine is powerful for multi-source applications
- Use `SentenceSplitter` for better semantic chunking than `TokenTextSplitter`
- LlamaIndex's `Response` objects include source nodes — always check them for grounding
- Use `Settings` for global configuration instead of passing to each component

---

## 13. HuggingFace API

**Provider:** Hugging Face  
**Docs:** https://huggingface.co/docs/api-inference  
**SDK:** `huggingface_hub`, `requests`

### Install

```bash
pip install huggingface_hub requests
```

### Setup

```python
from huggingface_hub import InferenceClient

client = InferenceClient()  # reads HF_TOKEN from env
```

### Example 1 — Text Generation (Serverless Inference)

```python
from huggingface_hub import InferenceClient

client = InferenceClient()

response = client.text_generation(
    model="meta-llama/Llama-3.3-70B-Instruct",
    prompt="Explain the difference between supervised and unsupervised learning:",
    max_new_tokens=256,
    temperature=0.7
)
print(response)
```

### Example 2 — Chat Completion

```python
from huggingface_hub import InferenceClient

client = InferenceClient()

messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is transformers architecture in deep learning?"}
]

response = client.chat_completion(
    model="meta-llama/Llama-3.3-70B-Instruct",
    messages=messages,
    max_tokens=512,
    temperature=0.7
)
print(response.choices[0].message.content)
```

### Example 3 — Embeddings

```python
from huggingface_hub import InferenceClient

client = InferenceClient()

embeddings = client.feature_extraction(
    model="sentence-transformers/all-MiniLM-L6-v2",
    inputs=["Hello world", "How are you?"]
)
print(f"Embeddings shape: {len(embeddings)} texts, {len(embeddings[0])} dimensions")
```

### Example 4 — Image Generation

```python
from huggingface_hub import InferenceClient

client = InferenceClient()

image = client.text_to_image(
    model="stabilityai/stable-diffusion-xl-base-1.0",
    prompt="A peaceful mountain landscape at sunset, oil painting style"
)
image.save("generated.png")
```

### Example 5 — Using Any HF Model via API

```python
import requests

API_URL = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english"
headers = {"Authorization": "Bearer hf_..."}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

result = query({
    "inputs": "I love this product! It's absolutely amazing!",
    "parameters": {"top_k": 3}
})
print(result)
```

### Available Free Models (Serverless API)

| Task | Model | Price |
|------|-------|-------|
| Text Generation | Llama-3.3-70B, Mistral-7B | Free (rate limited) |
| Embeddings | all-MiniLM-L6-v2 | Free |
| Image Generation | SDXL, Flux | Free (rate limited) |
| Translation | Helsinki-NLP/opus-mt-* | Free |
| Summarization | facebook/bart-large-cnn | Free |
| Sentiment | distilbert-base-uncased-finetuned-sst-2 | Free |

### Pricing (Inference Endpoints)

- Serverless Inference API: Free tier (rate limited)
- Dedicated Inference Endpoints:
  - Nvidia T4: ~$0.06/hr
  - Nvidia A10G: ~$1.50/hr
  - Nvidia A100: ~$4.13/hr

### Best Practices

- Free tier is rate-limited — good for prototyping, not production
- Use `huggingface_hub` for a Pythonic interface
- For production, use Inference Endpoints for guaranteed availability
- Models auto-load on first request (may have cold start latency)
- Check model cards for specific input requirements
- HuggingFace has 500K+ models — use filters and benchmarks to find the best one

---

## 14. ElevenLabs API

**Provider:** ElevenLabs  
**Docs:** https://elevenlabs.io/docs  
**SDK:** `elevenlabs`

### Install

```bash
pip install elevenlabs
```

### Setup

```python
from elevenlabs.client import ElevenLabs
from elevenlabs import Voice, VoiceSettings

client = ElevenLabs()  # reads ELEVEN_API_KEY from env
```

### Example 1 — Text to Speech

```python
from elevenlabs.client import ElevenLabs
from elevenlabs import play, save

client = ElevenLabs()

# Basic TTS
audio = client.generate(
    text="Welcome to the Edureka API Cookbook. Today we're exploring text-to-speech technology.",
    voice="Rachel",
    model="eleven_multilingual_v2"
)

save(audio, "output.mp3")
# Or play directly:
# play(audio)
```

### Example 2 — Streaming TTS

```python
from elevenlabs.client import ElevenLabs

client = ElevenLabs()

# Stream audio for lower latency
audio_stream = client.generate(
    text="This text is being streamed in real-time for faster playback.",
    voice="Adam",
    model="eleven_multilingual_v2",
    stream=True
)

with open("streamed_output.mp3", "wb") as f:
    for chunk in audio_stream:
        f.write(chunk)
```

### Example 3 — Voice Cloning

```python
from elevenlabs.client import ElevenLabs

client = ElevenLabs()

# Clone a voice from audio samples
cloned_voice = client.clone(
    name="My Custom Voice",
    description="A voice cloned from my own recordings",
    files=[
        "sample1.mp3",
        "sample2.mp3",
        "sample3.mp3"
    ]
)

# Use the cloned voice
audio = client.generate(
    text="This is my cloned voice speaking.",
    voice=cloned_voice
)

from elevenlabs import save
save(audio, "cloned_output.mp3")
```

### Example 4 — List & Manage Voices

```python
from elevenlabs.client import ElevenLabs

client = ElevenLabs()

# List all voices
voices = client.voices.get_all()
for voice in voices.voices:
    print(f"Name: {voice.name}, ID: {voice.voice_id}, Labels: {voice.labels}")

# Get voice details
voice_info = client.voices.get("pNInz6obpgDQGcFmaJgB")
print(f"Available models: {[m.name for m in voice_info.models]}")
```

### Example 5 — Sound Effects

```python
from elevenlabs.client import ElevenLabs

client = ElevenLabs()

audio = client.text_to_sound_effects.generate(
    text="A thunderstorm with rain hitting a metal roof",
    duration_seconds=5.0
)

from elevenlabs import save
save(audio, "sfx.mp3")
```

### Available Voices (Popular)

| Voice | Gender | Style |
|-------|--------|-------|
| Rachel | Female | Young, American |
| Adam | Male | Deep, American |
| Antoni | Male | Well-rounded |
| Elli | Female | Young, American |
| Josh | Male | Deep, British |
| Arnold | Male | Deep, American |
| Domi | Female | Strong |
| Grace | Female | Warm, American |

### Pricing (as of mid-2026)

| Plan | Characters/mo | Price | Features |
|------|--------------|-------|----------|
| Free | 10,000 | $0 | 3 custom voices, 19 languages |
| Starter | 30,000 | $5/mo | 10 custom voices |
| Creator | 100,000 | $22/mo | 30 custom voices, professional voice cloning |
| Pro | 500,000 | $99/mo | 160 custom voices, sound effects |
| Scale | 2M | $330/mo | Unlimited voices |
| Enterprise | Custom | Custom | SLA, priority support |

### Best Practices

- Use `eleven_multilingual_v2` for multilingual content
- Voice cloning needs at least 1 minute of clean audio
- Stream audio for real-time applications to reduce perceived latency
- Use SSML for fine-grained control over pronunciation and pacing
- `eleven_turbo_v2_5` is faster and cheaper for English-only use cases
- Store voice IDs for consistent voice usage across your app

---

## 15. AssemblyAI API

**Provider:** AssemblyAI  
**Docs:** https://www.assemblyai.com/docs  
**SDK:** `assemblyai`

### Install

```bash
pip install assemblyai
```

### Setup

```python
import assemblyai as aai

aai.settings.api_key = "your-api-key"
# Or read from ASSEMBLYAI_API_KEY env var
```

### Example 1 — Basic Transcription

```python
import assemblyai as aai

aai.settings.api_key = "your-api-key"

config = aai.TranscriptionConfig(
    audio_url="https://example.com/audio.mp3",
    speaker_labels=True,
    auto_chapters=True
)

transcriber = aai.Transcriber()
transcript = transcriber.transcribe(config)

print(transcript.text)

# Speaker-labeled transcript
for utterance in transcript.utterances:
    print(f"Speaker {utterance.speaker}: {utterance.text}")
```

### Example 2 — Transcribe from File

```python
import assemblyai as aai

aai.settings.api_key = "your-api-key"

transcriber = aai.Transcriber()

# Transcribe local file
transcript = transcriber.transcribe("meeting_recording.mp3")

if transcript.status == aai.TranscriptStatus.completed:
    print(transcript.text)

    # Auto-generated summary
    if transcript.summary:
        print(f"\nSummary: {transcript.summary}")

    # Sentiment analysis per sentence
    if transcript.sentiment_analysis:
        for sentiment in transcript.sentiment_analysis:
            print(f"[{sentiment.sentiment}] {sentiment.text}")
else:
    print(f"Transcription failed: {transcript.error}")
```

### Example 3 — Real-time Transcription

```python
import assemblyai as aai

aai.settings.api_key = "your-api-key"

def on_transcript(transcript):
    if transcript.event_type == aai.RealtimeTranscriptType.FINAL_TRANSCRIPT:
        print(f"Final: {transcript.text}")
    elif transcript.event_type == aai.RealtimeTranscriptType.PARTIAL_TRANSCRIPT:
        print(f"Partial: {transcript.text}", end="\r")

config = aai.RealtimeTranscriptConfig(
    word_boost=["AI", "machine learning", "neural network"],
    encoding=aai.AudioEncoding.PCM_S16LE,
    sample_rate=16000
)

transcriber = aai.RealtimeTranscriber(
    on_transcript=on_transcript,
    config=config
)

# Connect to microphone (requires pyaudio)
transcriber.connect()
```

### Example 4 — LeMUR (Long-form Understanding)

```python
import assemblyai as aai

aai.settings.api_key = "your-api-key"

transcriber = aai.Transcriber()
transcript = transcriber.transcribe("long_podcast.mp3")

# Use LeMUR for Q&A over the transcript
result = transcript.lemur.task(
    question="What are the main topics discussed in this podcast?",
    final_model=aai.LemurModel.claude_3_5_sonnet
)
print(result.response)
```

### Example 5 — Batch Transcription with Webhooks

```python
import assemblyai as aai

aai.settings.api_key = "your-api-key"

config = aai.TranscriptionConfig(
    audio_url="https://example.com/audio.mp3",
    webhook_url="https://your-server.com/webhook",
    webhook_events=[aai.WebhookEvent.transcript_completed]
)

transcriber = aai.Transcriber()
transcript = transcriber.submit(config)
print(f"Submitted: ID={transcript.id}")
# Webhook will be called when transcription completes
```

### Available Features

| Feature | Description |
|---------|-------------|
| Transcription | High-accuracy speech-to-text |
| Speaker Diarization | Identify different speakers |
| Auto Chapters | Auto-detect topic changes |
| Summarization | AI-generated summaries |
| Sentiment Analysis | Per-sentence sentiment |
| Entity Detection | Named entity recognition |
| PII Redaction | Automatically redact sensitive info |
| Custom Vocabulary | Boost domain-specific terms |
| Real-time | Live streaming transcription |

### Pricing (as of mid-2026)

| Feature | Price |
|---------|-------|
| Standard transcription | $0.015/min |
| Premium transcription | $0.031/min |
| Speaker diarization | +$0.01/min |
| Summarization | +$0.015/transcript |
| Sentiment analysis | +$0.02/transcript |
| Real-time | $0.065/hr |
| LeMUR | $0.004/1K tokens |
| Free tier: 100 hours included with credit |

### Best Practices

- Use `speaker_labels=True` for meeting/podcast transcription
- Custom vocabulary significantly improves domain-specific accuracy
- For webhooks, always verify the response with the transcript ID
- AssemblyAI has excellent accuracy for English — consider for transcription-heavy apps
- Use `auto_chapters=True` for long-form content navigation
- LeMUR is powerful for analysis without sending raw transcripts to external LLMs

---

## 16. Firecrawl API

**Provider:** Firecrawl  
**Docs:** https://docs.firecrawl.dev  
**SDK:** `firecrawl-py`

### Install

```bash
pip install firecrawl-py
```

### Setup

```python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="your-api-key")
```

### Example 1 — Scrape URL to Markdown

```python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="your-api-key")

result = app.scrape_url("https://example.com/article", params={
    "formats": ["markdown", "html"],
    "onlyMainContent": True
})

print(result["markdown"])
print(f"Title: {result['metadata']['title']}")
```

### Example 2 — Crawl Entire Site

```python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="your-api-key")

# Crawl and get all pages
crawl_result = app.crawl_url(
    "https://docs.example.com",
    params={
        "limit": 100,
        "scrapeOptions": {
            "formats": ["markdown"],
            "onlyMainContent": True
        }
    },
    poll_interval=5
)

for page in crawl_result["data"]:
    print(f"URL: {page['metadata']['source_url']}")
    print(f"Content length: {len(page['markdown'])} chars")
    print("---")
```

### Example 3 — Map (Discover URLs)

```python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="your-api-key")

# Discover all URLs on a site
map_result = app.map_url("https://example.com", params={
    "search": "api documentation"
})

for url in map_result["links"]:
    print(url)
```

### Example 4 — Batch Scrape

```python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="your-api-key")

# Scrape multiple URLs at once
urls = [
    "https://example.com/page1",
    "https://example.com/page2",
    "https://example.com/page3"
]

batch_result = app.batch_scrape_urls(urls, params={
    "formats": ["markdown"]
})

for page in batch_result["data"]:
    print(f"URL: {page['metadata']['source_url']}")
    print(f"Content: {page['markdown'][:200]}...")
    print("---")
```

### Example 5 — Extract Structured Data

```python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="your-api-key")

result = app.scrape_url("https://example.com/products", params={
    "formats": ["markdown"],
    "extract": {
        "schema": {
            "type": "object",
            "properties": {
                "product_name": {"type": "string"},
                "price": {"type": "string"},
                "description": {"type": "string"},
                "in_stock": {"type": "boolean"}
            }
        }
    }
})

print(result["extract"])
# {'product_name': 'Widget', 'price': '$29.99', 'description': '...', 'in_stock': True}
```

### Use Cases

- Web scraping for LLM training data
- RAG pipeline data collection
- Competitive monitoring
- Content aggregation
- Structured data extraction from websites
- Documentation indexing

### Pricing (as of mid-2026)

| Plan | Credits/mo | Price | Features |
|------|-----------|-------|----------|
| Free | 500 | $0 | Basic scraping |
| Hobby | 3,000 | $19/mo | Crawl, batch scrape |
| Growth | 30,000 | $99/mo | Full crawl, extract, webhooks |
| Scale | 300,000 | $399/mo | Priority, dedicated support |
| Enterprise | Custom | Custom | SLA, custom limits |

### Best Practices

- Use `onlyMainContent=True` to skip navigation, footers, etc.
- For LLM-ready data, Firecrawl's markdown output is cleaner than most scrapers
- Batch scrape for multiple URLs to save credits
- Use `map_url` to discover site structure before crawling
- Respect robots.txt — Firecrawl handles this by default
- Use `extract` with a schema for structured data extraction
- Cache results to avoid re-scraping unchanged pages

---

## 17. Perplexity API

**Provider:** Perplexity AI  
**Docs:** https://docs.perplexity.ai  
**SDK:** `openai` (OpenAI-compatible)

### Install

```bash
pip install openai
```

### Setup

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-perplexity-api-key",
    base_url="https://api.perplexity.ai"
)
```

### Example 1 — Basic Search-Augmented Chat

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-perplexity-api-key",
    base_url="https://api.perplexity.ai"
)

response = client.chat.completions.create(
    model="sonar-pro",
    messages=[
        {"role": "user", "content": "What are the latest developments in AI regulation in the EU as of 2026?"}
    ]
)
print(response.choices[0].message.content)

# Citations are included in the response
if hasattr(response, 'citations'):
    print("\nSources:")
    for citation in response.citations:
        print(f"  - {citation}")
```

### Example 2 — Search with Domain Filtering

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-perplexity-api-key",
    base_url="https://api.perplexity.ai"
)

response = client.chat.completions.create(
    model="sonar-pro",
    messages=[
        {"role": "user", "content": "Explain the RISC-V architecture and its advantages over ARM."}
    ],
    extra_body={
        "search_domain_filter": ["arxiv.org", "wikipedia.org"],
        "return_citations": True
    }
)
print(response.choices[0].message.content)
```

### Example 3 — Streaming

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-perplexity-api-key",
    base_url="https://api.perplexity.ai"
)

stream = client.chat.completions.create(
    model="sonar-pro",
    messages=[
        {"role": "user", "content": "Compare React, Vue, and Svelte for a new project in 2026."}
    ],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()
```

### Example 4 — RAG with Perplexity

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-perplexity-api-key",
    base_url="https://api.perplexity.ai"
)

# Use Perplexity as a RAG source
def search_and_answer(query: str) -> dict:
    response = client.chat.completions.create(
        model="sonar-pro",
        messages=[
            {"role": "system", "content": "Provide detailed, factual answers with citations."},
            {"role": "user", "content": query}
        ],
        extra_body={
            "return_citations": True
        }
    )
    return {
        "answer": response.choices[0].message.content,
        "citations": getattr(response, 'citations', []),
        "tokens": response.usage.total_tokens
    }

result = search_and_answer("What are the best practices for deploying ML models in production?")
print(f"Answer: {result['answer']}")
print(f"Citations: {result['citations']}")
```

### Available Models

| Model | Description | Context |
|-------|-------------|---------|
| sonar-pro | Advanced search-augmented LLM | 200K |
| sonar | Lightweight search-augmented LLM | 200K |
| sonar-reasoning-pro | Search + deep reasoning | 200K |
| sonar-reasoning | Lightweight reasoning + search | 200K |

### Pricing (as of mid-2026)

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| sonar-pro | $3.00 | $15.00 |
| sonar | $1.00 | $1.00 |
| sonar-reasoning-pro | $3.00 | $15.00 |
| sonar-reasoning | $1.00 | $1.00 |

### Best Practices

- Perplexity excels at factual, current-information queries (search-augmented)
- Use `sonar-pro` for complex questions, `sonar` for simple lookups
- Always use `return_citations=True` for traceable answers
- Use domain filters to focus search on trusted sources
- Excellent as a RAG component — Perplexity handles retrieval for you
- Great for real-time information that static LLMs can't answer
- Consider Perplexity as a replacement for custom vector search + LLM setups

---

## 18. Cross-API Recipes

### Recipe 1 — Full RAG Pipeline (OpenAI + Pinecone)

```python
from openai import OpenAI
from pinecone import Pinecone
import hashlib

openai_client = OpenAI()
pc = Pinecone()
index = pc.Index("knowledge-base")

# 1. Chunk and embed documents
def chunk_text(text, chunk_size=500, overlap=50):
    chunks = []
    words = text.split()
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i+chunk_size])
        chunks.append(chunk)
    return chunks

# 2. Embed and upsert
def index_document(doc_id, text, metadata=None):
    chunks = chunk_text(text)
    vectors = []
    for i, chunk in enumerate(chunks):
        emb = openai_client.embeddings.create(
            model="text-embedding-3-small",
            input=chunk
        ).data[0].embedding
        vectors.append({
            "id": f"{doc_id}_chunk_{i}",
            "values": emb,
            "metadata": {"text": chunk, "doc_id": doc_id, **(metadata or {})}
        })
    index.upsert(vectors=vectors)
    return len(vectors)

# 3. Query
def query_knowledge_base(query, top_k=5):
    emb = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=query
    ).data[0].embedding

    results = index.query(vector=emb, top_k=top_k, include_metadata=True)
    context = "\n\n".join(m.metadata["text"] for m in results.matches)

    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": f"Answer based on this context:\n{context}"},
            {"role": "user", "content": query}
        ]
    )
    return response.choices[0].message.content

# Usage
# index_document("doc1", "Your long document text here...")
# answer = query_knowledge_base("What is X?")
```

### Recipe 2 — Multi-Model Router (Claude + GPT-4o)

```python
from anthropic import Anthropic
from openai import OpenAI

claude = Anthropic()
openai = OpenAI()

def smart_query(question: str) -> dict:
    """Route to the best model based on task type."""

    # Quick classification
    classifier = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": f"Classify this question as 'coding', 'creative', 'analysis', or 'general': {question}"
        }],
        temperature=0
    )
    category = classifier.choices[0].message.content.strip().lower()

    if category == "coding":
        response = claude.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2048,
            system="You are an expert programmer. Provide clean, efficient code.",
            messages=[{"role": "user", "content": question}]
        )
        return {"model": "claude", "answer": response.content[0].text}
    elif category == "creative":
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": question}],
            temperature=0.9
        )
        return {"model": "gpt-4o", "answer": response.choices[0].message.content}
    else:
        response = claude.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2048,
            messages=[{"role": "user", "content": question}]
        )
        return {"model": "claude", "answer": response.content[0].text}
```

### Recipe 3 — Voice Agent (AssemblyAI + Claude + ElevenLabs)

```python
import assemblyai as aai
from anthropic import Anthropic
from elevenlabs.client import ElevenLabs
from elevenlabs import play

aai.settings.api_key = "your-aai-key"
claude = Anthropic()
elevenlabs = ElevenLabs()

# 1. Transcribe audio
transcriber = aai.Transcriber()
transcript = transcriber.transcribe("user_recording.mp3")
user_text = transcript.text

# 2. Generate response
response = claude.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    system="You are a helpful voice assistant. Keep responses concise.",
    messages=[{"role": "user", "content": user_text}]
)
assistant_text = response.content[0].text

# 3. Convert to speech
audio = elevenlabs.generate(
    text=assistant_text,
    voice="Rachel",
    model="eleven_multilingual_v2"
)
play(audio)
```

### Recipe 4 — Web Knowledge Builder (Firecrawl + Pinecone + OpenAI)

```python
from firecrawl import FirecrawlApp
from openai import OpenAI
from pinecone import Pinecone

firecrawl = FirecrawlApp(api_key="your-fc-key")
openai_client = OpenAI()
pc = Pinecone()
index = pc.Index("web-knowledge")

def build_knowledge_from_url(url: str, namespace: str = "default"):
    """Scrape a website and index it for RAG."""
    # Scrape
    result = firecrawl.scrape_url(url, params={
        "formats": ["markdown"],
        "onlyMainContent": True
    })

    text = result["markdown"]
    source = result["metadata"]["source_url"]

    # Chunk
    chunks = [text[i:i+1000] for i in range(0, len(text), 800)]

    # Embed & upsert
    vectors = []
    for i, chunk in enumerate(chunks):
        emb = openai_client.embeddings.create(
            model="text-embedding-3-small",
            input=chunk
        ).data[0].embedding
        vectors.append({
            "id": f"{namespace}_{i}",
            "values": emb,
            "metadata": {"text": chunk, "source": source}
        })

    index.upsert(vectors=vectors, namespace=namespace)
    return f"Indexed {len(vectors)} chunks from {source}"
```

### Recipe 5 — Cost-Optimized Pipeline (Groq + Cohere + GPT-4o-mini)

```python
from groq import Groq
import cohere
from openai import OpenAI

groq_client = Groq()
co = cohere.Client()
openai_client = OpenAI()

def cost_optimized_rag(query: str, documents: list[str]) -> str:
    """
    Use Cohere embed+rerank for retrieval,
    Groq for fast generation, GPT-4o-mini as fallback.
    """

    # 1. Embed documents with Cohere
    doc_embeddings = co.embed(
        model="embed-english-v3.0",
        texts=documents,
        input_type="search_document"
    ).embeddings.float

    # 2. Embed query
    query_embedding = co.embed(
        model="embed-english-v3.0",
        texts=[query],
        input_type="search_query"
    ).embeddings.float[0]

    # 3. Find initial candidates (simple cosine similarity)
    import numpy as np
    similarities = np.dot(doc_embeddings, query_embedding)
    top_indices = np.argsort(similarities)[-5:][::-1]
    candidates = [documents[i] for i in top_indices]

    # 4. Rerank with Cohere
    reranked = co.rerank(
        model="rerank-english-v3.0",
        query=query,
        documents=candidates,
        top_n=3
    )
    context = "\n\n".join(documents[r.index] for r in reranked.results)

    # 5. Generate with Groq (fast) or GPT-4o-mini (fallback)
    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": f"Answer using this context:\n{context}"},
                {"role": "user", "content": query}
            ],
            max_tokens=1024
        )
        return response.choices[0].message.content
    except Exception:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": f"Answer using this context:\n{context}"},
                {"role": "user", "content": query}
            ]
        )
        return response.choices[0].message.content
```

---

## 19. Glossary

| Term | Definition |
|------|-----------|
| **Token** | A piece of a word (~4 chars English). Models are priced per token. |
| **Embedding** | A numerical vector representing text meaning (e.g., 1536 dimensions). |
| **Temperature** | Controls randomness. 0 = deterministic, 1+ = creative/random. |
| **Context Window** | Maximum tokens a model can process in one request. |
| **RAG** | Retrieval-Augmented Generation — search docs, then generate with context. |
| **Fine-tuning** | Training a model on custom data to specialize its behavior. |
| **Function Calling** | LLM outputs structured function calls instead of free text. |
| **Streaming** | Receiving response tokens one by one instead of all at once. |
| **Vector DB** | Database optimized for storing and searching embedding vectors. |
| **Chunking** | Splitting long documents into smaller pieces for embedding. |
| **Reranking** | Re-ordering search results with a more powerful model for precision. |
| **Diarization** | Identifying different speakers in audio transcription. |
| **Latency** | Time from request to first response token (TTFT). |
| **Throughput** | Tokens generated per second. |
| **Grounding** | Anchoring LLM outputs to verifiable sources. |
| **Namespace** | Logical partition within a vector database index. |
| **Payload** | Metadata attached to a vector in a vector database. |
| **Webhook** | HTTP callback triggered when an async operation completes. |
| **Cold Start** | Initial latency when loading a model or service for the first time. |
| **Rate Limiting** | Restricting API calls per time window (per minute, per day, etc.). |

---

## Quick Reference: Choosing the Right API

| Need | Recommended API | Alternative |
|------|----------------|-------------|
| General chat/assistant | OpenAI GPT-4o | Claude Sonnet |
| Coding tasks | Claude Sonnet | Codestral |
| Ultra-fast inference | Groq | Mistral Small |
| Multimodal (image+text) | Gemini | GPT-4o |
| Search-augmented answers | Perplexity | Gemini + Google Search |
| Embeddings | OpenAI (best quality) | Cohere (multilingual) |
| Vector search | Pinecone | Qdrant |
| RAG pipeline | LangChain + Pinecone | LlamaIndex |
| Open-source models | Together AI | Replicate |
| Text-to-speech | ElevenLabs | OpenAI TTS |
| Audio transcription | AssemblyAI | Groq Whisper |
| Web scraping for AI | Firecrawl | Custom + BeautifulSoup |
| Document Q&A | LlamaIndex | LangChain |
| Classification/routing | Cohere Classify | OpenAI + prompts |
| Summarization | Cohere Summarize | Claude |

---

*This guide is maintained by Edureka. Prices and features subject to change. Always check provider documentation for current details.*
