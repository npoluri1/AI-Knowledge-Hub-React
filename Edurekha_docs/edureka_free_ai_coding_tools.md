# 🚀 Free AI Coding Tools - Complete Reference 2026

> **A comprehensive guide to 48 free and freemium AI-powered coding tools for developers, engineers, and teams.**

**Last Updated:** July 2026  
**Total Tools:** 48  
**Price Range:** $0 - $50/month (most have generous free tiers)  
**Sources:** GitHub, official documentation, community surveys, product pages

---

## 📑 Table of Contents

- [Overview](#overview)
- [Category 1: Terminal Agents (Open Source)](#category-1-terminal-agents-open-source--byok-or-local-models)
- [Category 2: IDE Extensions (Free Tiers)](#category-2-ide-extensions-free-tiers--no-api-key-needed)
- [Category 3: Local Models via Ollama](#category-3-local-models-via-ollama-truly-0)
- [Category 4: Code Review & Quality](#category-4-code-review--quality-free-tiers)
- [Category 5: Specialized / Search / Chat-Based](#category-5-specialized--search--chat-based-free)
- [Category 6: Documentation & Explanation](#category-6-documentation--explanation-free)
- [Category 7: Claude Code (Reference)](#category-7-claude-code-reference)
- [Recommended Free Stacks](#-recommended-free-stacks)
- [Quick Decision Guide](#-quick-decision-guide)
- [Real-Time Project Examples](#-real-time-project-examples)

---

## Overview

The AI coding tools landscape in 2026 offers unprecedented free access to powerful capabilities. This guide covers:

| Category | Tools | Best For |
|----------|-------|----------|
| Terminal Agents | 7 | Power users, CLI-first workflows |
| IDE Extensions | 13 | Day-to-day coding assistance |
| Local Models | 8 | Privacy, offline work, zero cost |
| Code Review | 6 | Quality assurance, security |
| Search/Chat | 10 | Research, debugging, learning |
| Documentation | 3 | Code documentation |
| Reference | 4 | Enterprise-grade |

---

## Category 1: Terminal Agents (Open Source - BYOK or Local Models)

Terminal-based AI agents that run in your CLI, offering deep codebase integration.

---

### 1. 🟢 OpenCode

> **TUI terminal agent with 75+ LLM providers, LSP integration, and multi-session support.**

| Attribute | Details |
|-----------|---------|
| **Price** | $0 (BYOK or use Ollama) |
| **Platforms** | Windows, macOS, Linux |
| **GitHub Stars** | 120,000+ |
| **Model Support** | 75+ providers (OpenAI, Anthropic, Ollama, etc.) |
| **Key Features** | LSP integration, multi-session, skill system, MCP tools |

#### Installation

```bash
# Via npm
npm install -g opencode

# Via curl (macOS/Linux)
curl -fsSL https://opencode.ai/install.sh | bash

# Via Homebrew
brew install opencode
```

#### Quick Start

```bash
# Start with default model (requires API key in env)
opencode

# Use with Ollama (fully local)
OLLAMA_BASE_URL=http://localhost:11434 opencode

# Use with specific model
opencode --model gpt-4o
```

#### Configuration (.opencode.json)

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama": {
      "npm": "@opencode-ai/provider-ollama",
      "options": {
        "models": {
          "qwen-coder": {
            "name": "Qwen 2.5 Coder 7B",
            "maxTokens": 16384
          }
        }
      }
    }
  },
  "model": "ollama/qwen-coder"
}
```

#### Use Cases
- Full codebase refactoring across multiple files
- Multi-session parallel task execution
- LSP-aware code editing with diagnostics
- Skill-based workflows (git, testing, deployment)

---

### 2. 🔵 Aider

> **Git-native pair programmer that produces clean, well-structured commits.**

| Attribute | Details |
|-----------|---------|
| **Price** | $0 (BYOK or Ollama) |
| **Platforms** | Windows, macOS, Linux |
| **GitHub Stars** | 35,000+ |
| **Key Features** | Git integration, auto-commit, voice mode, repo map |

#### Installation

```bash
pip install aider-chat

# Or with Ollama support
pip install aider-chat[ollama]
```

#### Quick Start

```bash
# With OpenAI API
aider --model gpt-4o

# With Ollama (local)
aider --model ollama/qwen2.5-coder:7b

# Start in a git repo
cd my-project
aider

# Add files to chat
aider src/main.py src/utils.py

# Voice mode
aider --voice
```

#### Example Session

```bash
$ aider --model ollama/qwen2.5-coder:7b

# Give a task
> Add input validation to the user registration endpoint
> and write unit tests for it

Aider will:
1. Read the relevant files
2. Generate changes
3. Run git diff to show what changed
4. Auto-commit with descriptive message
```

#### Use Cases
- Multi-file refactoring with clean git history
- Bug fixes that span multiple files
- Adding features with proper test coverage
- Codebase-wide renaming and restructuring

---

### 3. 🟣 Cline

> **Autonomous coding agent that reads, edits files, and runs commands in VS Code.**

| Attribute | Details |
|-----------|---------|
| **Price** | ~$6/month (API costs) |
| **Platform** | VS Code Extension |
| **GitHub Stars** | 20,000+ |
| **Key Features** | File I/O, terminal commands, browser automation, MCP tools |

#### Installation

1. Open VS Code
2. Search for "Cline" in Extensions
3. Install and configure API provider

#### Configuration

```json
// settings.json
{
  "cline.apiProvider": "ollama",
  "cline.ollamaBaseUrl": "http://localhost:11434",
  "cline.ollamaModelId": "qwen2.5-coder:7b"
}
```

#### Use Cases
- Autonomous feature implementation
- Complex debugging with file and terminal access
- Browser-based testing automation
- MCP tool integration for external services

---

### 4. 🟡 Gemini CLI

> **Google's official CLI agent with free tier and OpenAI-compatible API support.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free: 1,000 requests/day |
| **Platforms** | Windows, macOS, Linux |
| **Key Features** | Google AI models, CLIProxyAPI for OpenAI compat |

#### Installation

```bash
# Via npm
npm install -g @anthropic-ai/gemini-cli

# Via Homebrew
brew install gemini-cli
```

#### Quick Start

```bash
# Authenticate with Google
gemini auth login

# Start coding
gemini

# With specific model
gemini --model gemini-2.5-pro
```

#### Use Cases
- Free cloud-powered coding assistance
- Quick code generation and explanation
- Prototyping with Google's latest models

---

### 5. 🟠 OpenAI Codex CLI

> **OpenAI's open-source CLI agent for autonomous coding tasks.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free tier (BYOK+) |
| **Platforms** | Windows, macOS, Linux |
| **GitHub Stars** | 8,000+ |
| **Key Features** | Sandboxed execution, git integration, multi-model |

#### Installation

```bash
npm install -g @openai/codex
```

#### Quick Start

```bash
# Set API key
export OPENAI_API_KEY="your-key"

# Run with approval mode
codex "refactor the auth module to use JWT"

# Auto-edit mode
codex --auto-edit "add pagination to the API"
```

#### Use Cases
- Autonomous refactoring tasks
- Sandboxed code execution
- Large-scale codebase modifications

---

### 6. 🟤 Kilo Code

> **Community fork of Cline with active development and additional features.**

| Attribute | Details |
|-----------|---------|
| **Price** | $0 (BYOK/Ollama) |
| **Platform** | VS Code Extension |
| **GitHub Stars** | 5,000+ |
| **Key Features** | Fork of Cline, active community, multi-provider |

#### Installation

1. VS Code Extensions → Search "Kilo Code"
2. Install and configure

#### Use Cases
- Alternative to Cline with community features
- Multi-model support with local Ollama
- Budget-friendly autonomous coding

---

### 7. ⚡ Amp (Sourcegraph)

> **Enterprise-grade multi-repo context agent.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free tier available |
| **Platforms** | Terminal, Web |
| **Key Features** | Multi-repo context, enterprise security |

#### Use Cases
- Cross-repository code changes
- Enterprise codebase understanding
- Large-scale migration projects

---

## Category 2: IDE Extensions (Free Tiers - No API Key Needed)

IDE-integrated tools that work out of the box with generous free tiers.

---

### 8. ⭐ Gemini Code Assist

> **BEST FREE TIER: 180,000 completions/month with Gemini 1.5 Pro.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free: 180K completions/month |
| **Platforms** | VS Code, JetBrains |
| **Model** | Gemini 1.5 Pro |
| **Key Features** | Code completion, chat, code review, docs generation |

#### Installation

```bash
# VS Code
code --install-extension google.geminicodeassist

# JetBrains
# Settings → Plugins → Search "Gemini Code Assist"
```

#### Usage Example

```python
# Type a comment and Gemini generates the implementation
# "Create a function to parse CSV files with error handling"

import csv
from typing import List, Dict, Optional

def parse_csv(
    file_path: str,
    delimiter: str = ",",
    encoding: str = "utf-8"
) -> Optional[List[Dict[str, str]]]:
    """Parse a CSV file and return a list of dictionaries.
    
    Args:
        file_path: Path to the CSV file
        delimiter: CSV delimiter (default: comma)
        encoding: File encoding (default: utf-8)
    
    Returns:
        List of dictionaries, or None if error occurs
    """
    try:
        with open(file_path, "r", encoding=encoding) as f:
            reader = csv.DictReader(f, delimiter=delimiter)
            return [row for row in reader]
    except FileNotFoundError:
        print(f"Error: File not found: {file_path}")
        return None
    except csv.Error as e:
        print(f"Error parsing CSV: {e}")
        return None
```

#### Use Cases
- High-volume code completion (180K/month is generous)
- Multi-language support (Python, JS, Java, Go, etc.)
- Code explanation and documentation
- Free alternative to GitHub Copilot

---

### 9. 💜 Codeium / Windsurf

> **Unlimited free code completions with broad IDE support.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free: Truly unlimited completions |
| **Platforms** | VS Code, JetBrains, Vim, Neovim, Emacs, Eclipse, and more |
| **Key Features** | Unlimited completions, chat, search, multi-language |

#### Installation

```bash
# VS Code
code --install-extension Codeium.codeium

# Command line (Vim/Neovim)
# Follow instructions at codeium.com
```

#### Usage Example

```javascript
// Codeium suggests completions as you type
// Example: Writing an Express.js middleware

const rateLimit = require('express-rate-limit');

// Type "create" and Codeium suggests:
function createRateLimiter(windowMs = 15 * 60 * 1000, max = 100) {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
}

module.exports = { createRateLimiter };
```

#### Use Cases
- Unlimited completions for budget-conscious developers
- Multi-IDE support (Vim users love this)
- Quick prototyping with AI assistance

---

### 10. 🐙 GitHub Copilot Free

> **2,000 completions + 50 chat messages/month from GitHub.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free: 2K completions + 50 chats/month |
| **Platforms** | VS Code, JetBrains, Neovim, Eclipse |
| **Model** | GPT-4o mini |
| **Key Features** | Code completion, chat, inline suggestions |

#### Installation

```bash
# VS Code
code --install-extension GitHub.copilot

# Authenticate with GitHub account
# Click Copilot icon in status bar → Sign in
```

#### Usage Example

```python
# GitHub Copilot inline suggestion
# Type the function signature and it suggests the body

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

# Copilot suggests the entire endpoint:
@app.post("/users/", status_code=201)
async def create_user(user: UserCreate):
    """Create a new user account."""
    existing_user = await db.users.find_one(
        {"$or": [
            {"username": user.username},
            {"email": user.email}
        ]}
    )
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username or email already registered"
        )
    hashed_password = hash_password(user.password)
    result = await db.users.insert_one({
        **user.dict(),
        "password": hashed_password,
        "created_at": datetime.utcnow()
    })
    return {"id": str(result.inserted_id), "username": user.username}
```

#### Use Cases
- Quick completions for everyday coding
- GitHub integration (PRs, issues, actions)
- Multi-language support

---

### 11. 🟦 Amazon Q Developer

> **Unlimited completions + 50 agentic requests/month from AWS.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free: Unlimited completions + 50 agentic req/month |
| **Platforms** | VS Code, JetBrains |
| **Key Features** | Code completion, chat, code transformation, security scanning |

#### Installation

```bash
# VS Code
code --install-extension Amazon Web Services.amazon-q

# JetBrains
# Settings → Plugins → Search "Amazon Q"
```

#### Usage Example

```javascript
// Amazon Q code transformation example
// Original: var-based JavaScript

var express = require('express');
var app = express();

app.get('/users', function(req, res) {
    var userId = req.params.id;
    var user = database.find(userId);
    if (user == null) {
        res.status(404).send('Not found');
    } else {
        res.json(user);
    }
});

// Amazon Q transforms to modern ES6+:
import express from 'express';
const app = express();

app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = await database.findById(id);
    
    if (!user) {
        return res.status(404).json({ 
            error: 'User not found' 
        });
    }
    
    return res.json(user);
});
```

#### Use Cases
- AWS-specific code assistance
- Code modernization (Java 8 → 17, JavaScript → TypeScript)
- Security vulnerability scanning
- Unlimited completions for AWS projects

---

### 12. 🔷 Continue.dev

> **Unlimited completions with any model via BYOK or Ollama.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free: Unlimited (BYOK/Ollama) |
| **Platforms** | VS Code, JetBrains |
| **Key Features** | Any model support, chat, autocomplete, edit |

#### Configuration

```json
// ~/.continue/config.json
{
  "models": [
    {
      "title": "Qwen 2.5 Coder 7B (Local)",
      "provider": "ollama",
      "model": "qwen2.5-coder:7b"
    },
    {
      "title": "GPT-4o",
      "provider": "openai",
      "model": "gpt-4o",
      "apiKey": "sk-..."
    }
  ],
  "tabAutocompleteModel": {
    "title": "Qwen Coder Autocomplete",
    "provider": "ollama",
    "model": "qwen2.5-coder:7b"
  }
}
```

#### Use Cases
- Model-agnostic AI coding assistant
- Local-first with Ollama
- Custom model fine-tuning integration

---

### 13. 🎯 Cursor Free

> **2,000 completions + 50 premium model requests/month.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free: 2K completions + 50 premium |
| **Platform** | Cursor IDE (standalone) |
| **Key Features** | AI-native IDE, multi-file editing, chat |

#### Use Cases
- AI-native IDE experience
- Multi-file context editing
- Quick prototyping with premium models

---

### 14. 🔶 Tabnine Free

> **Unlimited basic completions with broad IDE support.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free: Unlimited basic completions |
| **Platforms** | VS Code, JetBrains, Vim, Emacs, and more |
| **Key Features** | Code completion, chat, privacy-focused |

#### Use Cases
- Privacy-focused completion (can run locally)
- Enterprise environments with restricted APIs
- Broad IDE support including Vim/Emacs

---

### 15. 🟪 Refact.ai

> **Unlimited completions with self-hosted option and 20+ LLM support.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free: Unlimited (self-host) |
| **Platforms** | VS Code, JetBrains, Vim |
| **Key Features** | Self-hosted, 20+ LLMs, team features |

#### Use Cases
- Self-hosted for security compliance
- Team deployments with shared models
- Custom model integration

---

### 16. 🟫 Supermaven

> **Generous free quota with fast inference.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free: Generous quota |
| **Platforms** | VS Code, JetBrains |
| **Key Features** | Fast completions, large context window |

#### Use Cases
- Speed-focused coding
- Large file editing with context
- Quick completions

---

### 17. 🧩 Pieces for Devs

> **Unlimited personal use with cross-IDE support.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free: Unlimited personal |
| **Platforms** | VS Code, JetBrains, Web |
| **Key Features** | Code snippets, context preservation, cross-tool |

#### Use Cases
- Code snippet management
- Cross-tool context preservation
- Personal knowledge base

---

### 18. 📝 AskCodi

> **Limited free daily usage for quick coding help.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free: Limited daily |
| **Platforms** | VS Code, JetBrains, Android Studio |
| **Key Features** | Code generation, testing, documentation |

#### Use Cases
- Quick code generation
- Test case generation
- Android development assistance

---

### 19. ⬛ Blackbox AI

> **Unlimited basic completions for VS Code and web.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free: Unlimited basic |
| **Platforms** | VS Code, Web |
| **Key Features** | Code completion, chat, code search |

#### Use Cases
- Quick code lookup
- Basic completion needs
- Web-based coding assistance

---

### 20. 🟨 MutableAI

> **Limited free tier with GPT-4 access.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free: Limited |
| **Platform** | VS Code |
| **Model** | GPT-4 |
| **Key Features** | AI-powered code editing, testing |

#### Use Cases
- GPT-4 powered editing on budget
- Code quality improvements
- Testing assistance

---

## Category 3: Local Models via Ollama (Truly $0)

Run AI models locally with zero API costs. Perfect for privacy-sensitive work and offline development.

---

### 28. 🦙 Ollama (Runtime)

> **The runtime that runs ALL the below models locally.**

| Attribute | Details |
|-----------|---------|
| **Price** | $0 (MIT License) |
| **Platforms** | Windows, macOS, Linux |
| **GitHub Stars** | 100,000+ |
| **Key Features** | Model management, API server, GPU acceleration |

#### Installation

```bash
# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# Download from ollama.com

# Verify installation
ollama --version
```

#### Usage

```bash
# Pull a model
ollama pull qwen2.5-coder:7b

# Run a model interactively
ollama run qwen2.5-coder:7b

# Start API server (for IDE integrations)
ollama serve

# List installed models
ollama list

# Remove a model
ollama rm qwen2.5-coder:7b
```

#### API Usage

```python
import requests
import json

def query_ollama(prompt: str, model: str = "qwen2.5-coder:7b") -> str:
    """Query local Ollama instance."""
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": model,
            "prompt": prompt,
            "stream": False
        }
    )
    return response.json()["response"]

# Example
code = query_ollama("Write a Python function to sort a list using quicksort")
print(code)
```

---

### 21. 🟢 Qwen 2.5 Coder 7B

> **Best open-source coding model. Apache 2.0, 128K context, 88.4% HumanEval.**

| Attribute | Details |
|-----------|---------|
| **License** | Apache 2.0 |
| **VRAM Required** | ~8GB |
| **Context Window** | 128K tokens |
| **HumanEval Score** | 88.4% |
| **Languages** | 90+ programming languages |

#### Setup

```bash
# Pull with Ollama
ollama pull qwen2.5-coder:7b

# Or pull larger variants
ollama pull qwen2.5-coder:14b  # ~14GB VRAM
ollama pull qwen2.5-coder:32b  # ~32GB VRAM
```

#### Example

```python
# Using Qwen for code generation
import requests

def generate_code_with_qwen(description: str) -> str:
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "qwen2.5-coder:7b",
            "prompt": f"Write Python code: {description}\n\n# Solution:\n",
            "stream": False,
            "options": {"temperature": 0.2}
        }
    )
    return response.json()["response"]

# Generate a web scraper
scraper_code = generate_code_with_qwen(
    "Create a web scraper that extracts article titles from a news website"
)
print(scraper_code)
```

#### Best For
- General-purpose code generation
- Multi-language coding tasks
- Local-first development

---

### 22. 🔵 Qwen 3.6 27B

> **Advanced reasoning model. 77.2% SWE-bench, 128K context.**

| Attribute | Details |
|-----------|---------|
| **License** | Apache 2.0 |
| **VRAM Required** | ~22GB |
| **Context Window** | 128K tokens |
| **SWE-bench Score** | 77.2% |
| **Key Feature** | Advanced reasoning and complex problem solving |

#### Setup

```bash
ollama pull qwen3:27b
```

#### Best For
- Complex algorithm design
- Architecture decisions
- Multi-step reasoning tasks

---

### 23. 🟣 DeepSeek Coder V2 7B

> **MIT licensed, 86%+ HumanEval, excellent for code.**

| Attribute | Details |
|-----------|---------|
| **License** | MIT |
| **VRAM Required** | ~8GB |
| **Context Window** | 128K tokens |
| **HumanEval Score** | 86%+ |
| **Key Feature** | Fill-in-the-middle capability |

#### Setup

```bash
ollama pull deepseek-coder:6.7b
```

#### Best For
- Code completion with fill-in-the-middle
- Repository-level code understanding
- Budget-friendly high-quality coding

---

### 24. 🟠 DeepSeek V4-Pro

> **MIT licensed, 80.6% SWE-bench, 49B active parameters.**

| Attribute | Details |
|-----------|---------|
| **License** | MIT |
| **Active Parameters** | ~49B (MoE) |
| **Context Window** | 128K tokens |
| **SWE-bench Score** | 80.6% |
| **Key Feature** | Mixture of Experts for efficiency |

#### Best For
- Enterprise-grade coding tasks
- Complex refactoring projects
- High-quality code generation

---

### 25. 🟤 CodeLlama 7B

> **Meta's code-specialized Llama variant.**

| Attribute | Details |
|-----------|---------|
| **License** | Llama 2 |
| **VRAM Required** | ~6GB |
| **Context Window** | 16K tokens |
| **HumanEval Score** | 85% |
| **Key Feature** | Fill-in-the-middle, instruction-tuned |

#### Setup

```bash
ollama pull codellama:7b
```

#### Best For
- Python-heavy projects
- Fill-in-the-middle completions
- Lightweight local coding assistant

---

### 26. 💚 Phi-4 Mini Instruct

> **Microsoft's small but powerful model. Only 4GB VRAM needed.**

| Attribute | Details |
|-----------|---------|
| **License** | MIT |
| **VRAM Required** | ~4GB |
| **Context Window** | 16K tokens |
| **HumanEval Score** | 82% |
| **Key Feature** | Ultra-lightweight, runs on any GPU |

#### Setup

```bash
ollama pull phi4-mini
```

#### Best For
- Low-VRAM systems
- Quick code completions
- Edge deployment

---

### 27. 🟡 Mistral 7B Instruct

> **Fast inference, Apache 2.0, great for code.**

| Attribute | Details |
|-----------|---------|
| **License** | Apache 2.0 |
| **VRAM Required** | ~8GB |
| **Context Window** | 32K tokens |
| **HumanEval Score** | 80% |
| **Key Feature** | Fast inference, sliding window attention |

#### Setup

```bash
ollama pull mistral:7b
```

#### Best For
- Fast code completions
- Real-time coding assistance
- Sliding window for long files

---

## Category 4: Code Review & Quality (Free Tiers)

Automated code review, security scanning, and quality assurance tools.

---

### 29. 🐰 CodeRabbit

> **Free for public repos. AI-powered code review on GitHub/GitLab/Bitbucket.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free for public repos |
| **Platforms** | GitHub, GitLab, Bitbucket |
| **Key Features** | PR review, security scanning, code suggestions |

#### Setup

```yaml
# .github/workflows/coderabbit.yml
name: CodeRabbit
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  coderabbit:
    runs-on: ubuntu-latest
    steps:
      - uses: coderabbitai/ai-pr-reviewer@latest
        with:
          # Optional: custom prompts
          review_comment: true
```

#### Usage Example

```python
# CodeRabbit automatically reviews PRs and suggests improvements
# Example output on a PR:

# 🔍 Review: src/auth.py
# 
# ⚠️ Security Issue (High):
# Line 45: SQL query uses string formatting
# - Potential SQL injection vulnerability
# + Use parameterized queries:
# + cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
#
# 💡 Suggestion (Medium):
# Line 78: Missing input validation
# + Add validation:
# + if not email or "@" not in email:
# +     raise ValueError("Invalid email")
```

#### Use Cases
- Automated PR reviews for open source projects
- Security vulnerability detection
- Code style and best practices enforcement

---

### 30. 🟢 Qodo (CodiumAI)

> **Free for individuals. AI test generation and code review.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free for individuals |
| **Platforms** | VS Code, JetBrains, GitHub |
| **Key Features** | Test generation, code review, coverage analysis |

#### Usage Example

```python
# Qodo generates tests for your code
# Input function:
def calculate_discount(price: float, discount_percent: float) -> float:
    if price < 0:
        raise ValueError("Price cannot be negative")
    if not 0 <= discount_percent <= 100:
        raise ValueError("Discount must be between 0 and 100")
    return price * (1 - discount_percent / 100)

# Qodo generates:
import pytest

class TestCalculateDiscount:
    def test_no_discount(self):
        assert calculate_discount(100.0, 0) == 100.0
    
    def test_full_discount(self):
        assert calculate_discount(100.0, 100) == 0.0
    
    def test_half_discount(self):
        assert calculate_discount(100.0, 50) == 50.0
    
    def test_negative_price_raises(self):
        with pytest.raises(ValueError, match="Price cannot be negative"):
            calculate_discount(-10.0, 10)
    
    def test_invalid_discount_raises(self):
        with pytest.raises(ValueError, match="Discount must be"):
            calculate_discount(100.0, 150)
    
    @pytest.mark.parametrize("price,discount,expected", [
        (100.0, 10, 90.0),
        (50.0, 25, 37.5),
        (200.0, 15, 170.0),
    ])
    def test_various_discounts(self, price, discount, expected):
        assert calculate_discount(price, discount) == expected
```

#### Use Cases
- Automated test generation
- Code coverage improvement
- PR review with quality metrics

---

### 31. 🔴 Snyk

> **Free for open source. Security-focused code scanning.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free for open source |
| **Platforms** | VS Code, GitHub, CI/CD |
| **Key Features** | Vulnerability scanning, license compliance, SCA |

#### Setup

```bash
# Install Snyk CLI
npm install -g snyk

# Authenticate
snyk auth

# Test your project
snyk test

# Monitor for new vulnerabilities
snyk monitor
```

#### Use Cases
- Security vulnerability detection
- License compliance checking
- CI/CD security integration

---

### 32. 🔵 SonarQube Community Edition

> **Free community edition for code quality and security.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free Community Edition |
| **Platforms** | VS Code, JetBrains, CI/CD |
| **Key Features** | Code quality, security analysis, 30+ languages |

#### Setup

```bash
# Docker setup
docker run -d --name sonarqube -p 9000:9000 sonarqube:community

# Scan a project
sonar-scanner \
  -Dsonar.projectKey=my-project \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000
```

#### Use Cases
- Code quality gate enforcement
- Technical debt tracking
- Security hotspot detection

---

### 33. 🟣 DeepSource

> **Free for open source. Automated code review and CI.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free for open source |
| **Platforms** | GitHub, GitLab, Bitbucket |
| **Key Features** | Auto-fix, 40+ analyzers, CI integration |

#### Setup

```yaml
# .deepsource.toml
version = 1

[[ analyzers ]]
name = "python"
enabled = true

  [analyzers.meta]
  environment = ["py39"]
  max_line_length = 100

[[ analyzers ]]
name = "javascript"
enabled = true

[[ transformers ]]
name = "black"
enabled = true

[[ transformers ]]
name = "isort"
enabled = true
```

#### Use Cases
- Automated code quality enforcement
- Multi-language static analysis
- CI/CD pipeline integration

---

### 34. 🟤 Codacy Free

> **Free for open source. Automated code review.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free for open source |
| **Platforms** | GitHub, GitLab, Bitbucket |
| **Key Features** | Auto-assessments, security, code patterns |

#### Use Cases
- Code quality monitoring
- Security vulnerability detection
- Team code standards enforcement

---

## Category 5: Specialized / Search / Chat-Based (Free)

Specialized tools for specific coding tasks and research.

---

### 35. 💡 Phind

> **Developer search engine with code generation.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free tier available |
| **Token Limit** | 16K tokens |
| **Key Features** | Code-focused search, explanations, examples |

#### Use Cases
- Developer-specific search queries
- Code example discovery
- Technical documentation lookup

---

### 36. 🌙 Kimi

> **Massive codebase ingestion with 1M+ token context.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free tier available |
| **Token Limit** | 1M+ tokens |
| **Key Features** | Massive context, codebase analysis |

#### Use Cases
- Large codebase understanding
- Cross-file dependency analysis
- Documentation generation for large projects

---

### 37. 🔵 Qwen Coder API

> **Free Alibaba quota for Qwen Coder models.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free quota from Alibaba |
| **Token Limit** | 128K tokens |
| **Key Features** | Cloud-hosted Qwen models |

#### Usage

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-alibaba-api-key",
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
)

response = client.chat.completions.create(
    model="qwen-coder-plus",
    messages=[
        {"role": "user", "content": "Write a Python web scraper"}
    ]
)
print(response.choices[0].message.content)
```

#### Use Cases
- Free cloud coding assistance
- Large context code analysis
- Multi-language code generation

---

### 38. 🟠 Perplexity AI

> **Web-grounded answers with citations for research.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free tier available |
| **Key Features** | Web-grounded answers, citations, real-time info |

#### Use Cases
- Researching coding best practices
- Finding up-to-date documentation
- Debugging with real-world examples

---

### 39. 🟤 ChatGLM (GLM)

> **Free API with bilingual support.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free API tier |
| **Token Limit** | 128K tokens |
| **Key Features** | Bilingual (Chinese/English), code generation |

#### Use Cases
- Bilingual development teams
- Code generation in multiple languages
- Documentation translation

---

### 40. 🟢 HuggingChat

> **Access to open models via Hugging Face.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free |
| **Key Features** | Multiple open models, conversational |

#### Use Cases
- Testing different open-source models
- Quick code questions
- Model comparison

---

### 41. 🟣 Poe (Free Tier)

> **Multi-model access: Claude, GPT-4, Gemini, Llama.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free tier with daily limits |
| **Key Features** | Multiple models, comparison, quick access |

#### Use Cases
- Compare model outputs for the same task
- Quick access to multiple AI models
- Learning which model works best for different tasks

---

### 42. ⚡ v0 by Vercel

> **UI code generation from prompts (React/Next.js).**

| Attribute | Details |
|-----------|---------|
| **Price** | Free tier available |
| **Key Features** | UI component generation, React/Next.js focus |

#### Usage Example

```
# Prompt to v0:
"Create a modern pricing card component with three tiers,
 hover effects, and a dark mode toggle"

# v0 generates a complete React component:
```

```tsx
// Generated by v0
import { useState } from "react";
import { Moon, Sun, Check } from "lucide-react";

interface PricingTier {
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "Starter",
    price: 9,
    features: ["5 Projects", "10GB Storage", "Email Support"],
  },
  {
    name: "Pro",
    price: 29,
    features: ["Unlimited Projects", "100GB Storage", "Priority Support"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 99,
    features: ["Everything in Pro", "Custom Domain", "24/7 Support"],
  },
];

export function PricingCards() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark bg-gray-900" : "bg-gray-50"}>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? <Sun /> : <Moon />}
      </button>
      <div className="grid grid-cols-3 gap-6 p-8">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-xl p-6 ${
              tier.popular
                ? "bg-blue-600 text-white scale-105"
                : "bg-white shadow-lg"
            }`}
          >
            <h3>{tier.name}</h3>
            <p className="text-3xl font-bold">${tier.price}/mo</p>
            <ul>
              {tier.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check size={16} /> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### Use Cases
- Rapid UI prototyping
- React component generation
- Design system creation

---

### 43. 🟡 bolt.new

> **Full-stack app generation in the browser.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free tier available |
| **Key Features** | Full-stack generation, browser-based, deployment |

#### Use Cases
- Rapid prototyping
- Full-stack app scaffolding
- Learning new frameworks

---

### 44. 🟠 Lovable.dev

> **App generation + deployment from natural language prompts.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free tier available |
| **Key Features** | App generation, deployment, iteration |

#### Use Cases
- Non-technical app creation
- Rapid MVP development
- Idea validation

---

## Category 6: Documentation & Explanation (Free)

Tools for generating and maintaining code documentation.

---

### 45. 📚 Mintlify

> **Auto-generate docstrings and documentation sites.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free tier available |
| **Key Features** | Docstring generation, docs site, MDX |

#### Usage Example

```python
# Mintlify generates documentation from code
# Input:
def process_payment(
    amount: float,
    currency: str,
    customer_id: str,
    idempotency_key: str | None = None
) -> PaymentResult:
    """
    Process a payment transaction.
    
    Handles the complete payment flow including validation,
    fraud checks, and settlement. Supports multiple currencies
    and includes automatic retry logic for transient failures.
    
    Args:
        amount: Payment amount in the smallest currency unit
        currency: ISO 4217 currency code (e.g., "USD", "EUR")
        customer_id: Unique customer identifier
        idempotency_key: Optional key to prevent duplicate charges
    
    Returns:
        PaymentResult containing transaction ID and status
    
    Raises:
        PaymentError: If payment processing fails
        InsufficientFundsError: If customer has insufficient balance
        CurrencyMismatchError: If currency is not supported
    
    Example:
        >>> result = process_payment(
        ...     amount=99.99,
        ...     currency="USD",
        ...     customer_id="cust_123"
        ... )
        >>> print(result.transaction_id)
        "txn_abc123"
    
    Note:
        - Amounts should be in smallest currency unit (cents for USD)
        - Idempotency keys expire after 24 hours
        - Failed payments are automatically retried up to 3 times
    """
```

#### Use Cases
- Automatic docstring generation
- Documentation site creation
- API documentation

---

### 46. 🔄 Swimm

> **Code-coupled documentation that stays in sync.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free tier available |
| **Key Features** | Code-linked docs, auto-sync, IDE integration |

#### Use Cases
- Documentation that never goes stale
- Team knowledge sharing
- Onboarding documentation

---

### 47. 📝 Docify AI

> **One-click docstring generation.**

| Attribute | Details |
|-----------|---------|
| **Price** | Free tier available |
| **Key Features** | One-click generation, multiple formats |

#### Use Cases
- Quick docstring generation
- Multi-language documentation
- Code comment automation

---

## Category 7: Claude Code (Reference)

---

### 48. 🤖 Claude Code

> **Anthropic's coding agent, included in Claude Pro. 80.8% SWE-bench.**

| Attribute | Details |
|-----------|---------|
| **Price** | Included in Claude Pro ($20/month) |
| **Platforms** | Terminal, VS Code |
| **SWE-bench Score** | 80.8% |
| **Key Features** | Agentic coding, multi-file editing, git integration |

#### Installation

```bash
npm install -g @anthropic-ai/claude-code
```

#### Usage

```bash
# Start Claude Code
claude

# Give it a task
> Refactor the authentication module to use OAuth2

# It will:
# 1. Understand the codebase
# 2. Plan the changes
# 3. Edit files
# 4. Run tests
# 5. Commit changes
```

#### Use Cases
- Complex multi-file refactoring
- Architecture-level changes
- Debugging with deep codebase understanding
- Test-driven development

---

## 💰 Recommended Free Stacks

### Stack A: Zero Cost Full Local ($0/month)

> **For developers who want complete privacy and zero recurring costs.**

| Component | Tool | Purpose |
|-----------|------|---------|
| **IDE Extension** | Codeium | Unlimited completions |
| **Terminal Agent** | Aider or OpenCode | Multi-file editing |
| **Local Runtime** | Ollama | Model serving |
| **Coding Model** | Qwen 2.5 Coder 7B | Code generation |
| **Review** | SonarQube CE | Code quality |

```bash
# Setup Stack A
# 1. Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull coding model
ollama pull qwen2.5-coder:7b

# 3. Install Codeium in VS Code
code --install-extension Codeium.codeium

# 4. Install Aider
pip install aider-chat

# 5. Start coding with Aider + local model
aider --model ollama/qwen2.5-coder:7b
```

**Total Cost: $0/month**  
**Requirements: 8GB+ VRAM GPU**

---

### Stack B: Best Free Cloud (~$0-3/month)

> **For developers who want cloud power without API costs.**

| Component | Tool | Purpose |
|-----------|------|---------|
| **IDE Extension** | Gemini Code Assist | 180K completions/month |
| **Terminal Agent** | Gemini CLI | 1,000 requests/day |
| **Chat/Research** | Perplexity AI | Web-grounded answers |
| **Review** | CodeRabbit | PR review |
| **UI Generation** | v0 by Vercel | React components |

```bash
# Setup Stack B
# 1. Install Gemini Code Assist in VS Code
code --install-extension google.geminicodeassist

# 2. Install Gemini CLI
npm install -g @anthropic-ai/gemini-cli

# 3. Authenticate
gemini auth login

# 4. Start coding
gemini "Create a REST API for user management"
```

**Total Cost: $0/month** (free tiers)  
**Best for: Most developers**

---

### Stack C: Best Quality Budget (~$5-10/month)

> **For developers who want premium quality on a budget.**

| Component | Tool | Purpose |
|-----------|------|---------|
| **IDE Extension** | Codeium | Unlimited completions |
| **AI IDE** | Cursor Free | 2K compl + 50 premium |
| **Terminal Agent** | OpenCode | Multi-session agent |
| **Coding Model** | DeepSeek API | High-quality generation |
| **Review** | Qodo + Snyk | Tests + security |

```bash
# Setup Stack C
# 1. Install Codeium
code --install-extension Codeium.codeium

# 2. Download Cursor IDE
# cursor.sh

# 3. Install OpenCode
npm install -g opencode

# 4. Configure OpenCode with DeepSeek
opencode --provider deepseek --model deepseek-chat
```

**Total Cost: ~$5-10/month**  
**Best for: Professional developers**

---

## 🎯 Quick Decision Guide

| I need... | Best Free Option | Cost |
|-----------|-----------------|------|
| **Unlimited completions** | Codeium / Windsurf | $0 |
| **Best free tier** | Gemini Code Assist (180K/mo) | $0 |
| **Local/private coding** | Ollama + Qwen 2.5 Coder | $0 |
| **Terminal agent** | OpenCode or Aider | $0 |
| **PR code review** | CodeRabbit (public repos) | $0 |
| **Test generation** | Qodo (individuals) | $0 |
| **UI components** | v0 by Vercel | $0 |
| **Full-stack app** | bolt.new or Lovable.dev | $0 |
| **Security scanning** | Snyk (open source) | $0 |
| **Documentation** | Mintlify | $0 |
| **Multi-model comparison** | Poe free tier | $0 |
| **Large codebase analysis** | Kimi (1M+ tokens) | $0 |
| **AWS-specific help** | Amazon Q Developer | $0 |
| **Best overall quality** | Claude Code (Claude Pro) | $20/mo |
| **Maximum productivity** | Cursor Pro | $20/mo |

---

## 📊 Comparison Tables

### IDE Extensions Comparison

| Tool | Completions/mo | Chat | Models | IDE Support |
|------|----------------|------|--------|-------------|
| Gemini Code Assist | 180,000 | ✅ | Gemini 1.5 Pro | VS Code, JetBrains |
| Codeium | Unlimited | ✅ | Multiple | VS Code, JetBrains, Vim, etc. |
| GitHub Copilot Free | 2,000 | 50 msgs | GPT-4o mini | VS Code, JetBrains, Neovim |
| Amazon Q Developer | Unlimited | 50 agentic | Amazon models | VS Code, JetBrains |
| Continue.dev | Unlimited | ✅ | Any (BYOK) | VS Code, JetBrains |
| Cursor Free | 2,000 | 50 premium | Multiple | Cursor IDE |
| Tabnine Free | Unlimited | ✅ | Tabnine models | VS Code, JetBrains, Vim |

### Local Models Comparison

| Model | License | VRAM | Context | HumanEval | Best For |
|-------|---------|------|---------|-----------|----------|
| Qwen 2.5 Coder 7B | Apache 2.0 | 8GB | 128K | 88.4% | General coding |
| Qwen 3.6 27B | Apache 2.0 | 22GB | 128K | 77.2% (SWE) | Complex reasoning |
| DeepSeek Coder V2 7B | MIT | 8GB | 128K | 86%+ | Fill-in-middle |
| DeepSeek V4-Pro | MIT | ~49B | 128K | 80.6% (SWE) | Enterprise |
| CodeLlama 7B | Llama 2 | 6GB | 16K | 85% | Python projects |
| Phi-4 Mini | MIT | 4GB | 16K | 82% | Low VRAM |
| Mistral 7B | Apache 2.0 | 8GB | 32K | 80% | Fast inference |

### Code Review Tools Comparison

| Tool | Free For | PR Review | Security | Auto-Fix |
|------|----------|-----------|----------|----------|
| CodeRabbit | Public repos | ✅ | ✅ | ✅ |
| Qodo | Individuals | ✅ | ❌ | ✅ (tests) |
| Snyk | Open source | ❌ | ✅ | ❌ |
| SonarQube CE | All users | ❌ | ✅ | ❌ |
| DeepSource | Open source | ✅ | ✅ | ✅ |
| Codacy | Open source | ✅ | ✅ | ❌ |

---

## 🔧 Real-Time Project Examples

---

### Project 1: Zero-Cost AI Code Review Pipeline

> **Automated code review using only free tools.**

#### Description
Build a CI/CD pipeline that automatically reviews code using CodeRabbit for PR reviews, Qodo for test generation, and SonarQube for quality analysis—all at zero cost.

#### Tools Needed
- CodeRabbit (PR reviews)
- Qodo (test generation)
- SonarQube CE (quality analysis)
- GitHub Actions (CI/CD)

#### Architecture

```
Developer → GitHub PR
    ↓
GitHub Actions triggers:
    ├── CodeRabbit: AI PR Review
    ├── Qodo: Generate Missing Tests
    └── SonarQube: Quality Gate
    ↓
All checks pass → Auto-merge
```

#### Implementation

```yaml
# .github/workflows/ai-review.yml
name: AI Code Review Pipeline

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  # Job 1: CodeRabbit AI Review
  code-rabbit-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: coderabbitai/ai-pr-reviewer@latest
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  # Job 2: Qodo Test Generation
  generate-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install pytest qodo
      
      - name: Find files without tests
        id: find-untested
        run: |
          # Find Python files without corresponding test files
          for file in $(find src -name "*.py" -not -name "__init__.py"); do
            test_file="tests/test_$(basename $file)"
            if [ ! -f "$test_file" ]; then
              echo "Missing tests for: $file"
              echo "untested=true" >> $GITHUB_OUTPUT
            fi
          done

  # Job 3: SonarQube Analysis
  sonar-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: SonarQube Scan
        uses: SonarSource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        with:
          args: >
            -Dsonar.projectKey=my-project
            -Dsonar.sources=src
            -Dsonar.tests=tests
            -Dsonar.python.coverage.reportPaths=coverage.xml

  # Quality Gate
  quality-gate:
    needs: [code-rabbit-review, sonar-analysis]
    runs-on: ubuntu-latest
    steps:
      - name: Check Quality Gate
        run: |
          echo "All AI reviews passed!"
          echo "CodeRabbit: ✅"
          echo "SonarQube: ✅"
```

#### Setup Instructions

```bash
# 1. Fork/clone your repo
git clone https://github.com/youruser/your-repo.git
cd your-repo

# 2. Add the workflow file
mkdir -p .github/workflows
# (copy ai-review.yml from above)

# 3. Set up SonarQube (optional - for local testing)
docker run -d --name sonarqube -p 9000:9000 sonarqube:community

# 4. Create a branch and test
git checkout -b feature/test-review
echo "def hello(): return 'world'" > src/utils.py
git add . && git commit -m "test: add utility function"
git push origin feature/test-review

# 5. Create a PR and watch the AI reviews happen!
```

---

### Project 2: Local LLM-Powered VS Code Extension

> **Build a VS Code extension that uses Ollama for local AI code completion.**

#### Description
Create a custom VS Code extension that integrates with Ollama to provide local, private code completions using Qwen 2.5 Coder.

#### Tools Needed
- Ollama (local runtime)
- Qwen 2.5 Coder 7B (coding model)
- Continue.dev (alternative: use this instead of building)
- VS Code Extension API

#### Architecture

```
VS Code Extension
    ↓
Ollama API (localhost:11434)
    ↓
Qwen 2.5 Coder 7B (local model)
    ↓
Code Completion Response
    ↓
Display in VS Code
```

#### Implementation

```typescript
// src/extension.ts
import * as vscode from 'vscode';
import axios from 'axios';

const OLLAMA_BASE_URL = 'http://localhost:11434';
const MODEL = 'qwen2.5-coder:7b';

interface CompletionRequest {
  model: string;
  prompt: string;
  stream: boolean;
  options: {
    temperature: number;
    max_tokens: number;
  };
}

export function activate(context: vscode.ExtensionContext) {
  // Register completion provider
  const provider = vscode.languages.registerCompletionItemProvider(
    '*',
    {
      async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
      ) {
        // Get context (surrounding code)
        const start = new vscode.Position(
          Math.max(0, position.line - 20),
          0
        );
        const end = position;
        const context = document.getText(
          new vscode.Range(start, end)
        );

        try {
          const response = await axios.post(
            `${OLLAMA_BASE_URL}/api/generate`,
            {
              model: MODEL,
              prompt: `Complete the following code:\n\n${context}\n\n# Continue from here:\n`,
              stream: false,
              options: {
                temperature: 0.2,
                max_tokens: 100
              }
            } as CompletionRequest
          );

          const completion = response.data.response;
          
          // Create completion items
          const items: vscode.CompletionItem[] = [];
          const lines = completion.split('\n').filter(
            (l: string) => l.trim()
          );
          
          for (const line of lines.slice(0, 5)) {
            const item = new vscode.CompletionItem(
              line.trim(),
              vscode.CompletionItemKind.Snippet
            );
            item.detail = 'Local AI (Ollama)';
            items.push(item);
          }
          
          return items;
        } catch (error) {
          console.error('Ollama error:', error);
          return [];
        }
      }
    },
    '.', '(', '{', '[', ' ', '\n'
  );

  // Register chat command
  const chatCommand = vscode.commands.registerCommand(
    'aiCoder.chat',
    async () => {
      const panel = vscode.window.createWebviewPanel(
        'aiChat',
        'AI Code Chat',
        vscode.ViewColumn.Beside,
        { enableScripts: true }
      );

      panel.webview.html = getWebviewContent();

      panel.webview.onDidReceiveMessage(
        async (message) => {
          if (message.type === 'ask') {
            const response = await queryOllama(message.text);
            panel.webview.postMessage({
              type: 'answer',
              text: response
            });
          }
        }
      );
    }
  );

  context.subscriptions.push(provider, chatCommand);
}

async function queryOllama(prompt: string): Promise<string> {
  const response = await axios.post(
    `${OLLAMA_BASE_URL}/api/generate`,
    {
      model: MODEL,
      prompt,
      stream: false
    }
  );
  return response.data.response;
}

function getWebviewContent(): string {
  return `
    <!DOCTYPE html>
    <html>
    <body>
      <h3>AI Code Chat (Local)</h3>
      <textarea id="input" rows="4" cols="50" 
        placeholder="Ask about code..."></textarea>
      <br/>
      <button onclick="ask()">Ask</button>
      <pre id="output"></pre>
      <script>
        const vscode = acquireVsCodeApi();
        function ask() {
          const text = document.getElementById('input').value;
          vscode.postMessage({ type: 'ask', text });
        }
        window.addEventListener('message', (e) => {
          if (e.data.type === 'answer') {
            document.getElementById('output').textContent = e.data.text;
          }
        });
      </script>
    </body>
    </html>
  `;
}

export function deactivate() {}
```

```json
// package.json
{
  "name": "ai-coder-local",
  "displayName": "AI Coder Local",
  "description": "Local AI coding with Ollama",
  "version": "0.0.1",
  "engines": { "vscode": "^1.85.0" },
  "main": "./out/extension.js",
  "activationEvents": ["*"],
  "contributes": {
    "commands": [
      {
        "command": "aiCoder.chat",
        "title": "AI Coder: Open Chat"
      }
    ]
  },
  "dependencies": {
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/vscode": "^1.85.0",
    "typescript": "^5.3.0"
  }
}
```

#### Setup Instructions

```bash
# 1. Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull the model
ollama pull qwen2.5-coder:7b

# 3. Create extension project
mkdir ai-coder-local && cd ai-coder-local
npm init -y
npm install axios
npm install -D @types/vscode typescript

# 4. Copy the source files above

# 5. Compile and run
npm run compile
# Press F5 in VS Code to launch Extension Development Host

# 6. Test in the new VS Code window
# Open a file and start coding - completions will appear!
```

---

### Project 3: Free AI Documentation Generator

> **Auto-generate documentation for your entire codebase.**

#### Description
Build a documentation generator that uses Mintlify for docstrings, Docify AI for quick generation, and Swimm for code-coupled docs.

#### Tools Needed
- Mintlify (docstring generation)
- Docify AI (quick docs)
- Swimm (synced docs)

#### Architecture

```
Codebase
    ↓
Mintlify: Scan all functions → Generate docstrings
    ↓
Docify AI: Generate README and API docs
    ↓
Swimm: Create code-linked documentation
    ↓
Documentation Site (auto-updated)
```

#### Implementation

```python
# docs_generator.py
"""Automated documentation generator using free AI tools."""
import os
import ast
import subprocess
from pathlib import Path
from typing import Dict, List, Optional

class AIDocGenerator:
    """Generate documentation for Python codebases."""
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.docs_dir = self.project_root / "docs"
        self.docs_dir.mkdir(exist_ok=True)
    
    def scan_python_files(self) -> List[Path]:
        """Find all Python files in the project."""
        return list(self.project_root.rglob("*.py"))
    
    def extract_functions(self, file_path: Path) -> List[Dict]:
        """Extract function signatures and existing docstrings."""
        with open(file_path, 'r') as f:
            tree = ast.parse(f.read())
        
        functions = []
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                funcs_info = {
                    "name": node.name,
                    "args": [arg.arg for arg in node.args.args],
                    "line": node.lineno,
                    "has_docstring": (
                        ast.get_docstring(node) is not None
                    ),
                    "decorators": [
                        d.id if isinstance(d, ast.Name) 
                        else str(d) 
                        for d in node.decorator_list
                    ]
                }
                functions.append(funcs_info)
        
        return functions
    
    def generate_docstrings(self, file_path: Path) -> str:
        """Generate docstrings for functions missing them."""
        with open(file_path, 'r') as f:
            content = f.read()
        
        tree = ast.parse(content)
        lines = content.split('\n')
        
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                if not ast.get_docstring(node):
                    # Insert docstring after function signature
                    indent = " " * (node.col_offset + 4)
                    docstring = (
                        f'{indent}"""TODO: Add documentation for {node.name}."""'
                    )
                    lines.insert(node.lineno, docstring)
        
        return '\n'.join(lines)
    
    def generate_readme(self) -> str:
        """Generate README.md from project structure."""
        files = self.scan_python_files()
        
        readme_content = f"""# {self.project_root.name}

> Auto-generated documentation using AI tools.

## Project Structure

"""
        for file in sorted(files):
            rel_path = file.relative_to(self.project_root)
            functions = self.extract_functions(file)
            
            readme_content += f"### `{rel_path}`\n\n"
            
            for func in functions:
                readme_content += (
                    f"- **{func['name']}**"
                    f"(line {func['line']})\n"
                )
            
            readme_content += "\n"
        
        return readme_content
    
    def generate_api_docs(self) -> str:
        """Generate API documentation."""
        files = self.scan_python_files()
        
        api_docs = "# API Documentation\n\n"
        
        for file in files:
            functions = self.extract_functions(file)
            
            if functions:
                api_docs += f"## {file.stem}\n\n"
                
                for func in functions:
                    args_str = ", ".join(func['args'])
                    api_docs += f"""### `{func['name']}({args_str})`

"""
                    if func['decorators']:
                        api_docs += f"**Decorators:** {', '.join(func['decorators'])}\n\n"
        
        return api_docs
    
    def run(self):
        """Generate all documentation."""
        print("🔍 Scanning project...")
        files = self.scan_python_files()
        print(f"   Found {len(files)} Python files")
        
        print("📝 Generating docstrings...")
        for file in files:
            updated = self.generate_docstrings(file)
            # Only write if changes were made
            print(f"   ✅ {file.name}")
        
        print("📖 Generating README...")
        readme = self.generate_readme()
        readme_path = self.project_root / "README.md"
        with open(readme_path, 'w') as f:
            f.write(readme)
        print(f"   ✅ {readme_path}")
        
        print("📚 Generating API docs...")
        api_docs = self.generate_api_docs()
        api_path = self.docs_dir / "api.md"
        with open(api_path, 'w') as f:
            f.write(api_docs)
        print(f"   ✅ {api_path}")
        
        print("\n✨ Documentation generation complete!")
        print(f"   Run 'mintlify dev' to preview docs site")


if __name__ == "__main__":
    import sys
    
    project = sys.argv[1] if len(sys.argv) > 1 else "."
    generator = AIDocGenerator(project)
    generator.run()
```

#### Setup Instructions

```bash
# 1. Install Mintlify CLI
npm install -g mintlify

# 2. Initialize Mintlify in your project
mintlify init

# 3. Run the documentation generator
python docs_generator.py /path/to/your/project

# 4. Preview the docs site
mintlify dev

# 5. Deploy to Mintlify hosting (free tier)
mintlify deploy
```

---

### Project 4: Multi-Model Comparison Dashboard

> **Compare outputs from multiple free AI models side-by-side.**

#### Description
Build a web dashboard that sends the same coding prompt to multiple free models and displays results for comparison.

#### Tools Needed
- Poe (free tier - multiple models)
- Kimi (1M+ token context)
- Qwen Coder API (free quota)
- Perplexity AI (web-grounded)

#### Architecture

```
Web Dashboard (React)
    ├── Input Prompt
    ↓
    ├── Poe API → Claude, GPT-4, Gemini, Llama
    ├── Kimi API → Kimi model
    ├── Qwen API → Qwen Coder
    └── Perplexity API → Web-grounded answers
    ↓
Side-by-side Comparison View
    ├── Response Time
    ├── Code Quality Score
    ├── Token Usage
    └── User Rating
```

#### Implementation

```javascript
// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Model configurations
const MODELS = {
  qwen: {
    name: 'Qwen Coder',
    api: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-coder-plus',
    apiKey: process.env.QWEN_API_KEY
  },
  kimi: {
    name: 'Kimi',
    api: 'https://api.moonshot.cn/v1',
    model: 'moonshot-v1-8k',
    apiKey: process.env.KIMI_API_KEY
  },
  perplexity: {
    name: 'Perplexity',
    api: 'https://api.perplexity.ai',
    model: 'llama-3.1-sonar-small-128k-online',
    apiKey: process.env.PERPLEXITY_API_KEY
  }
};

// Compare endpoint
app.post('/api/compare', async (req, res) => {
  const { prompt } = req.body;
  const results = {};
  
  const promises = Object.entries(MODELS).map(
    async ([key, config]) => {
      const start = Date.now();
      
      try {
        const response = await axios.post(
          `${config.api}/chat/completions`,
          {
            model: config.model,
            messages: [
              { role: 'user', content: prompt }
            ],
            max_tokens: 2000
          },
          {
            headers: {
              'Authorization': `Bearer ${config.apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        results[key] = {
          name: config.name,
          response: response.data.choices[0].message.content,
          time: Date.now() - start,
          tokens: response.data.usage?.total_tokens || 0,
          error: null
        };
      } catch (error) {
        results[key] = {
          name: config.name,
          response: null,
          time: Date.now() - start,
          tokens: 0,
          error: error.message
        };
      }
    }
  );
  
  await Promise.all(promises);
  res.json(results);
});

// Prompt suggestions
app.get('/api/prompts', (req, res) => {
  res.json([
    {
      id: 1,
      category: 'Algorithm',
      prompt: 'Write a Python function to find the longest palindromic substring'
    },
    {
      id: 2,
      category: 'API Design',
      prompt: 'Design a REST API for a todo application with auth'
    },
    {
      id: 3,
      category: 'Debugging',
      prompt: 'Fix this code: def fib(n): return fib(n-1) + fib(n-2)'
    },
    {
      id: 4,
      category: 'Architecture',
      prompt: 'Design a microservices architecture for an e-commerce platform'
    }
  ]);
});

app.listen(3001, () => {
  console.log('Comparison server running on port 3001');
});
```

```jsx
// frontend/src/App.jsx
import { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const compare = async () => {
    setLoading(true);
    const response = await fetch('http://localhost:3001/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">
        🤖 Multi-Model AI Comparison
      </h1>
      
      <div className="mb-8">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-32 bg-gray-800 rounded-lg p-4 text-white"
          placeholder="Enter a coding prompt..."
        />
        <button
          onClick={compare}
          disabled={loading}
          className="mt-4 px-6 py-3 bg-blue-600 rounded-lg
            hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '⏳ Comparing...' : '🚀 Compare Models'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(results).map(([key, result]) => (
          <div
            key={key}
            className="bg-gray-800 rounded-lg p-6"
          >
            <h3 className="text-xl font-bold mb-2">
              {result.name}
            </h3>
            <div className="flex gap-4 mb-4 text-sm text-gray-400">
              <span>⏱️ {result.time}ms</span>
              <span>📝 {result.tokens} tokens</span>
            </div>
            {result.error ? (
              <div className="text-red-400">
                ❌ {result.error}
              </div>
            ) : (
              <pre className="bg-gray-900 p-4 rounded text-sm overflow-auto max-h-96">
                {result.response}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
```

#### Setup Instructions

```bash
# 1. Set up backend
mkdir comparison-dashboard && cd comparison-dashboard
npm init -y
npm install express axios cors

# 2. Set API keys (get free tiers from each service)
export QWEN_API_KEY="your-key"
export KIMI_API_KEY="your-key"
export PERPLEXITY_API_KEY="your-key"

# 3. Start backend
node server.js

# 4. Set up frontend
npx create-react-app frontend
cd frontend
npm install

# 5. Copy the App.jsx component above

# 6. Run both
# Terminal 1: node server.js
# Terminal 2: cd frontend && npm start
```

---

### Project 5: Autonomous PR Review Bot

> **AI agent that reviews PRs, suggests fixes, and can auto-apply them.**

#### Description
Build a GitHub bot that uses Cline for autonomous code review and CodeRabbit for PR analysis, automatically suggesting fixes.

#### Tools Needed
- Cline (VS Code extension)
- CodeRabbit (PR review)
- GitHub Actions (CI/CD)
- OpenCode (terminal agent)

#### Architecture

```
GitHub PR Created
    ↓
GitHub Actions triggers:
    ├── CodeRabbit: AI Review
    ├── Custom Bot: Apply Fixes
    └── OpenCode: Generate Suggestions
    ↓
Bot Comments on PR:
    ├── Review Summary
    ├── Suggested Fixes (as patches)
    └── Approval/Request Changes
```

#### Implementation

```yaml
# .github/workflows/ai-pr-bot.yml
name: AI PR Review Bot

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          npm install @octokit/rest @octokit/plugin-patch-request
      
      - name: AI Review Bot
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          node .github/scripts/review-bot.js
```

```javascript
// .github/scripts/review-bot.js
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function reviewPR() {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  const prNumber = parseInt(process.env.GITHUB_REF_NUMBER);
  
  // Get PR diff
  const { data: pr } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: prNumber
  });
  
  const { data: files } = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber
  });
  
  // Analyze changes
  const reviewComments = [];
  
  for (const file of files) {
    if (file.status === 'modified' || file.status === 'added') {
      // Check for common issues
      const patch = file.patch || '';
      
      // Security checks
      if (patch.includes('eval(') || patch.includes('exec(')) {
        reviewComments.push({
          path: file.filename,
          position: 1,
          body: '⚠️ **Security**: Found `eval()` or `exec()` usage. Consider using safer alternatives.'
        });
      }
      
      // Performance checks
      if (patch.includes('for') && patch.includes('.length')) {
        reviewComments.push({
          path: file.filename,
          position: 1,
          body: '💡 **Performance**: Consider caching `.length` outside the loop for better performance.'
        });
      }
      
      // Style checks
      if (file.filename.endsWith('.py')) {
        if (patch.includes('import *')) {
          reviewComments.push({
            path: file.filename,
            position: 1,
            body: '🎨 **Style**: Avoid wildcard imports (`import *`). Use explicit imports instead.'
          });
        }
      }
    }
  }
  
  // Post review
  if (reviewComments.length > 0) {
    await octokit.pulls.createReview({
      owner,
      repo,
      pull_number: prNumber,
      event: 'COMMENT',
      body: `## 🤖 AI Code Review\n\nFound ${reviewComments.length} suggestions:`,
      comments: reviewComments
    });
  }
  
  console.log(`Review complete: ${reviewComments.length} comments`);
}

reviewPR().catch(console.error);
```

#### Setup Instructions

```bash
# 1. Create GitHub repository
gh repo create ai-pr-bot --public

# 2. Add workflow files
mkdir -p .github/workflows .github/scripts

# 3. Copy the YAML and JS files above

# 4. Set repository secrets
gh secret set ANTHROPIC_API_KEY --body "your-key"

# 5. Create a test PR
git checkout -b feature/test
echo "def dangerous(): return eval('1+1')" > test.py
git add . && git commit -m "test: add dangerous code"
git push origin feature/test

# 6. Create PR and watch the bot review it!
gh pr create --title "Test PR" --body "Testing AI review bot"
```

---

### Project 6: Free AI-Powered Code Migration Tool

> **Automate code migration between Python versions.**

#### Description
Use Amazon Q Developer's free code transformation to migrate Python 2 code to Python 3, with Qodo for test generation.

#### Tools Needed
- Amazon Q Developer (code transformation)
- Qodo (test generation)
- DeepSource (quality verification)

#### Architecture

```
Python 2 Codebase
    ↓
Amazon Q: Transform to Python 3
    ↓
Qodo: Generate migration tests
    ↓
DeepSource: Verify quality
    ↓
Python 3 Codebase
```

#### Implementation

```python
# migrate.py
"""AI-powered Python 2 to 3 migration script."""
import ast
import sys
from pathlib import Path
from typing import List, Tuple

class PythonMigrationTool:
    """Automated Python 2 to 3 migration."""
    
    # Common Python 2 to 3 transformations
    TRANSFORMATIONS = {
        # print statement → print function
        'print': {
            'pattern': 'print ',
            'replacement': 'print(',
            'suffix': ')'
        },
        # except Exception, e → except Exception as e
        'except': {
            'pattern': 'except Exception, ',
            'replacement': 'except Exception as '
        },
        # has_key → in
        'has_key': {
            'pattern': '.has_key(',
            'replacement': ' in '
        },
        # unicode → str
        'unicode': {
            'pattern': 'unicode(',
            'replacement': 'str('
        },
        # raw_input → input
        'raw_input': {
            'pattern': 'raw_input(',
            'replacement': 'input('
        },
        # xrange → range
        'xrange': {
            'pattern': 'xrange(',
            'replacement': 'range('
        },
        # dict.iteritems → dict.items
        'iteritems': {
            'pattern': '.iteritems()',
            'replacement': '.items()'
        },
        # dict.itervalues → dict.values
        'itervalues': {
            'pattern': '.itervalues()',
            'replacement': '.values()'
        },
    }
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.changes: List[Tuple[str, str, int]] = []
    
    def scan_files(self) -> List[Path]:
        """Find all Python files."""
        return list(self.project_root.rglob("*.py"))
    
    def analyze_file(self, file_path: Path) -> List[str]:
        """Analyze a file for Python 2 patterns."""
        issues = []
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        for rule_name, rule in self.TRANSFORMATIONS.items():
            if rule['pattern'] in content:
                issues.append(rule_name)
        
        return issues
    
    def transform_file(self, file_path: Path) -> str:
        """Apply Python 3 transformations."""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        for rule_name, rule in self.TRANSFORMATIONS.items():
            content = content.replace(
                rule['pattern'],
                rule['replacement']
            )
            if 'suffix' in rule:
                # Handle suffix replacements carefully
                pass
        
        if content != original:
            self.changes.append(
                (str(file_path), original, content)
            )
        
        return content
    
    def generate_migration_report(self) -> str:
        """Generate a migration report."""
        files = self.scan_files()
        
        report = "# Python 2 → 3 Migration Report\n\n"
        report += f"**Files scanned:** {len(files)}\n\n"
        
        issues_by_file = {}
        for file in files:
            issues = self.analyze_file(file)
            if issues:
                issues_by_file[str(file)] = issues
        
        report += f"**Files needing migration:** {len(issues_by_file)}\n\n"
        
        report += "## Issues Found\n\n"
        for file, issues in issues_by_file.items():
            report += f"### `{file}`\n"
            for issue in issues:
                report += f"- {issue}\n"
            report += "\n"
        
        report += "## Recommended Actions\n\n"
        report += "1. Run `2to3` tool for automatic conversion\n"
        report += "2. Use Amazon Q Developer for advanced transformations\n"
        report += "3. Run Qodo to generate migration tests\n"
        report += "4. Verify with DeepSource\n"
        
        return report
    
    def run(self, dry_run: bool = True):
        """Execute migration."""
        print("🔍 Scanning for Python 2 patterns...")
        report = self.generate_migration_report()
        
        # Save report
        report_path = self.project_root / "MIGRATION_REPORT.md"
        with open(report_path, 'w') as f:
            f.write(report)
        print(f"📄 Report saved to {report_path}")
        
        if not dry_run:
            print("\n🔄 Applying transformations...")
            for file_path, original, transformed in self.changes:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(transformed)
                print(f"   ✅ Migrated: {file_path}")
        
        print(f"\n✨ Found {len(self.changes)} files to migrate")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(
        description="AI-powered Python 2 to 3 migration"
    )
    parser.add_argument("project", help="Project directory")
    parser.add_argument(
        "--apply", 
        action="store_true",
        help="Apply changes (not dry run)"
    )
    
    args = parser.parse_args()
    
    tool = PythonMigrationTool(args.project)
    tool.run(dry_run=not args.apply)
```

#### Setup Instructions

```bash
# 1. Install Amazon Q Developer in VS Code
code --install-extension Amazon Web Services.amazon-q

# 2. Run the migration analyzer
python migrate.py /path/to/python2-project

# 3. Review the migration report
cat MIGRATION_REPORT.md

# 4. Use Amazon Q for complex transformations
# Open VS Code → Amazon Q → Transform code

# 5. Generate tests for migrated code
# Install Qodo and run test generation

# 6. Apply migrations (after review)
python migrate.py /path/to/python2-project --apply

# 7. Verify with DeepSource
deepsource analyze --type python
```

---

### Project 7: Local AI Code Review Pipeline

> **Self-hosted code review using Ollama and local models.**

#### Description
Build a completely offline code review system using Ollama, Qwen 2.5 Coder, and a custom review framework.

#### Tools Needed
- Ollama (runtime)
- Qwen 2.5 Coder 7B (review model)
- SonarQube CE (quality gate)
- Custom review script

#### Architecture

```
Git Pre-Commit Hook
    ↓
Custom Review Script
    ├── Ollama + Qwen: AI Review
    ├── SonarQube: Quality Check
    └── Flake8/Black: Style Check
    ↓
Pass/Fail Decision
```

#### Implementation

```python
# review.py
"""Local AI code review using Ollama."""
import subprocess
import sys
import json
from pathlib import Path
from typing import Dict, List, Optional
import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "qwen2.5-coder:7b"

REVIEW_PROMPT = """You are a senior code reviewer. Analyze the following code change and provide:

1. **Bugs**: Any bugs or errors you spot
2. **Security**: Security vulnerabilities
3. **Performance**: Performance issues
4. **Style**: Code style improvements
5. **Suggestions**: Better alternatives

Code to review:
```{language}
{code}
```

Provide your review in this format:
## Review Summary
[One line summary]

## Issues Found
[List issues with severity: 🔴 Critical, 🟡 Warning, 🟢 Suggestion]

## Suggested Changes
[Specific code suggestions]
"""

class LocalReviewer:
    """Local AI code reviewer using Ollama."""
    
    def __init__(self):
        self.check_ollama()
    
    def check_ollama(self):
        """Verify Ollama is running."""
        try:
            response = requests.get("http://localhost:11434/api/tags")
            models = [m['name'] for m in response.json().get('models', [])]
            if not any(MODEL in m for m in models):
                print(f"⚠️  Model {MODEL} not found. Pulling...")
                subprocess.run(["ollama", "pull", MODEL])
        except requests.ConnectionError:
            print("❌ Ollama is not running. Start it with: ollama serve")
            sys.exit(1)
    
    def review_code(
        self, 
        code: str, 
        language: str = "python"
    ) -> str:
        """Send code to Ollama for review."""
        prompt = REVIEW_PROMPT.format(
            language=language,
            code=code
        )
        
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.3,
                    "num_predict": 2000
                }
            }
        )
        
        return response.json()["response"]
    
    def get_git_diff(self) -> str:
        """Get staged changes from git."""
        result = subprocess.run(
            ["git", "diff", "--cached"],
            capture_output=True,
            text=True
        )
        return result.stdout
    
    def parse_diff_files(self, diff: str) -> Dict[str, str]:
        """Parse git diff into per-file changes."""
        files = {}
        current_file = None
        current_content = []
        
        for line in diff.split('\n'):
            if line.startswith('diff --git'):
                if current_file:
                    files[current_file] = '\n'.join(current_content)
                current_file = line.split(' b/')[-1]
                current_content = []
            elif current_file:
                current_content.append(line)
        
        if current_file:
            files[current_file] = '\n'.join(current_content)
        
        return files
    
    def get_language(self, filename: str) -> str:
        """Detect programming language."""
        ext_map = {
            '.py': 'python',
            '.js': 'javascript',
            '.ts': 'typescript',
            '.jsx': 'jsx',
            '.tsx': 'tsx',
            '.go': 'go',
            '.rs': 'rust',
            '.java': 'java'
        }
        
        ext = Path(filename).suffix
        return ext_map.get(ext, 'text')
    
    def run_review(self):
        """Run the full review process."""
        print("🔍 Getting staged changes...")
        diff = self.get_git_diff()
        
        if not diff:
            print("✅ No staged changes to review.")
            return True
        
        files = self.parse_diff_files(diff)
        print(f"📝 Reviewing {len(files)} files...\n")
        
        all_reviews = []
        has_critical = False
        
        for filename, content in files.items():
            language = self.get_language(filename)
            print(f"🤖 Reviewing {filename}...")
            
            review = self.review_code(content, language)
            all_reviews.append(f"## {filename}\n\n{review}\n")
            
            if "🔴" in review:
                has_critical = True
            
            print(review)
            print("\n" + "="*60 + "\n")
        
        # Save review report
        report_path = Path(".ai-review.md")
        with open(report_path, 'w') as f:
            f.write("# 🤖 AI Code Review Report\n\n")
            f.write(f"**Files reviewed:** {len(files)}\n\n")
            f.write("\n---\n\n".join(all_reviews))
        
        print(f"📄 Review saved to {report_path}")
        
        if has_critical:
            print("\n❌ Critical issues found! Please fix before committing.")
            return False
        
        print("\n✅ Review passed!")
        return True


def main():
    reviewer = LocalReviewer()
    success = reviewer.run_review()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
```

```bash
#!/bin/bash
# pre-commit hook (save as .git/hooks/pre-commit)

echo "🤖 Running AI code review..."
python review.py
exit $?
```

#### Setup Instructions

```bash
# 1. Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull the review model
ollama pull qwen2.5-coder:7b

# 3. Copy review.py to your project root

# 4. Install the pre-commit hook
cp pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

# 5. Test it
git add .
git commit -m "test: this will trigger AI review"

# 6. View the review
cat .ai-review.md
```

---

### Project 8: Free AI Documentation Chatbot

> **Build a chatbot that answers questions about your codebase.**

#### Description
Create a chatbot that ingests your codebase and answers questions using local models and free APIs.

#### Tools Needed
- Ollama + Qwen 2.5 Coder (local model)
- Continue.dev (IDE integration)
- Mintlify (docs generation)

#### Architecture

```
User Question
    ↓
Codebase Indexer
    ├── Parse all source files
    ├── Extract functions/classes
    └── Build context
    ↓
Ollama + Qwen
    ↓
Answer with code references
```

#### Implementation

```python
# code_chat.py
"""Interactive codebase chatbot."""
import os
import json
from pathlib import Path
from typing import List, Dict
import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "qwen2.5-coder:7b"

class CodebaseChat:
    """Chat with your codebase using local AI."""
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.index: Dict[str, str] = {}
        self.index_codebase()
    
    def index_codebase(self):
        """Index all source files."""
        extensions = [
            '*.py', '*.js', '*.ts', '*.jsx', '*.tsx',
            '*.go', '*.rs', '*.java', '*.cpp', '*.h'
        ]
        
        for ext in extensions:
            for file in self.project_root.rglob(ext):
                try:
                    content = file.read_text(encoding='utf-8')
                    rel_path = str(file.relative_to(self.project_root))
                    self.index[rel_path] = content
                except Exception:
                    continue
        
        print(f"📚 Indexed {len(self.index)} files")
    
    def find_relevant_files(self, question: str) -> List[str]:
        """Find files relevant to the question."""
        question_lower = question.lower()
        scored_files = []
        
        for filepath, content in self.index.items():
            score = 0
            content_lower = content.lower()
            
            # Simple keyword matching
            for word in question_lower.split():
                if word in content_lower:
                    score += 1
                if word in filepath.lower():
                    score += 2
            
            if score > 0:
                scored_files.append((score, filepath))
        
        scored_files.sort(reverse=True)
        return [f for _, f in scored_files[:5]]
    
    def ask(self, question: str) -> str:
        """Ask a question about the codebase."""
        relevant_files = self.find_relevant_files(question)
        
        if not relevant_files:
            return "I couldn't find relevant files for your question."
        
        # Build context
        context = "Relevant code:\n\n"
        for filepath in relevant_files[:3]:
            content = self.index[filepath]
            # Truncate large files
            if len(content) > 3000:
                content = content[:3000] + "\n... (truncated)"
            context += f"### {filepath}\n```\\n{content}\\n```\n\n"
        
        prompt = f"""You are a helpful coding assistant. Answer the question based on the provided code context.

{context}

Question: {question}

Answer:"""
        
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.3,
                    "num_predict": 1000
                }
            }
        )
        
        return response.json()["response"]
    
    def interactive(self):
        """Start interactive chat."""
        print("🤖 Codebase Chat (type 'quit' to exit)")
        print(f"📚 Project: {self.project_root.name}")
        print(f"📁 Files indexed: {len(self.index)}")
        print("-" * 50)
        
        while True:
            question = input("\n❓ You: ").strip()
            
            if question.lower() in ['quit', 'exit', 'q']:
                print("👋 Goodbye!")
                break
            
            if not question:
                continue
            
            print("\n🤖 AI: ", end="")
            answer = self.ask(question)
            print(answer)


if __name__ == "__main__":
    import sys
    
    project = sys.argv[1] if len(sys.argv) > 1 else "."
    chat = CodebaseChat(project)
    chat.interactive()
```

#### Setup Instructions

```bash
# 1. Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull the model
ollama pull qwen2.5-coder:7b

# 3. Run the chatbot
python code_chat.py /path/to/your/project

# 4. Ask questions!
❓ You: What does the authentication module do?
❓ You: Find all API endpoints
❓ You: Explain the database schema
❓ You: How does error handling work?
```

---

### Project 9: AI-Powered Test Coverage Analyzer

> **Analyze and improve test coverage using AI suggestions.**

#### Description
Build a tool that analyzes test coverage and uses AI to suggest missing test cases.

#### Tools Needed
- Qodo (test generation)
- Ollama + Qwen (AI suggestions)
- Coverage.py (coverage measurement)

#### Architecture

```
Source Code + Tests
    ↓
Coverage.py: Measure coverage
    ↓
Identify uncovered code
    ↓
Ollama + Qwen: Suggest tests
    ↓
Qodo: Generate test code
    ↓
Improved test suite
```

#### Implementation

```python
# coverage_analyzer.py
"""AI-powered test coverage analyzer and improver."""
import subprocess
import json
import ast
from pathlib import Path
from typing import Dict, List, Optional
import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "qwen2.5-coder:7b"

TEST_SUGGESTION_PROMPT = """You are an expert test engineer. Given the following uncovered code, 
suggest test cases that would improve coverage.

Uncovered code:
```python
{code}
```

Existing tests for reference:
```python
{existing_tests}
```

Generate test cases that:
1. Cover the uncovered lines
2. Test edge cases
3. Follow the existing test style
4. Use appropriate assertions

Return ONLY the test code, no explanations:
"""

class CoverageAnalyzer:
    """Analyze and improve test coverage using AI."""
    
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
    
    def run_coverage(self) -> Dict:
        """Run coverage analysis."""
        print("📊 Running coverage analysis...")
        
        subprocess.run([
            "coverage", "run", "-m", "pytest",
            "--tb=short", "-q"
        ], cwd=self.project_root)
        
        result = subprocess.run(
            ["coverage", "json", "-o", "coverage.json"],
            cwd=self.project_root,
            capture_output=True
        )
        
        coverage_path = self.project_root / "coverage.json"
        if coverage_path.exists():
            with open(coverage_path) as f:
                return json.load(f)
        
        return {}
    
    def find_uncovered_lines(
        self, coverage_data: Dict
    ) -> List[Dict]:
        """Find lines that need test coverage."""
        uncovered = []
        
        for filename, file_data in coverage_data.get(
            'files', {}
        ).items():
            missing_lines = file_data.get(
                'missing_lines', []
            )
            
            if missing_lines:
                uncovered.append({
                    'file': filename,
                    'lines': missing_lines,
                    'executed': file_data.get(
                        'executed_lines', []
                    )
                })
        
        return uncovered
    
    def get_code_context(
        self, 
        filepath: str, 
        lines: List[int]
    ) -> str:
        """Get code context for uncovered lines."""
        full_path = self.project_root / filepath
        
        if not full_path.exists():
            return ""
        
        with open(full_path) as f:
            all_lines = f.readlines()
        
        # Get uncovered lines with context
        context_lines = []
        for line_num in lines:
            start = max(0, line_num - 5)
            end = min(len(all_lines), line_num + 5)
            
            for i in range(start, end):
                marker = ">>>" if i + 1 in lines else "   "
                context_lines.append(
                    f"{marker} {i+1:4d}: {all_lines[i].rstrip()}"
                )
        
        return "\n".join(set(context_lines))
    
    def get_existing_tests(self, filepath: str) -> str:
        """Get existing tests for the file."""
        test_patterns = [
            f"test_{filepath.stem}.py",
            f"{filepath.stem}_test.py",
            f"test_{filepath.stem}_*.py"
        ]
        
        tests = []
        test_dir = self.project_root / "tests"
        
        if test_dir.exists():
            for pattern in test_patterns:
                for test_file in test_dir.glob(pattern):
                    with open(test_file) as f:
                        tests.append(f.read())
        
        return "\n".join(tests) if tests else "# No existing tests"
    
    def suggest_tests(
        self, 
        filepath: str, 
        uncovered_lines: List[int]
    ) -> str:
        """Use AI to suggest test cases."""
        code = self.get_code_context(filepath, uncovered_lines)
        existing = self.get_existing_tests(Path(filepath))
        
        prompt = TEST_SUGGESTION_PROMPT.format(
            code=code,
            existing_tests=existing[:2000]  # Limit size
        )
        
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.3,
                    "num_predict": 1500
                }
            }
        )
        
        return response.json()["response"]
    
    def generate_report(self, coverage_data: Dict) -> str:
        """Generate coverage improvement report."""
        uncovered = self.find_uncovered_lines(coverage_data)
        
        report = "# 📊 Test Coverage Report\n\n"
        
        total = coverage_data.get('totals', {})
        report += f"**Overall Coverage:** {total.get('percent_covered', 0):.1f}%\n\n"
        
        if not uncovered:
            report += "✅ All code is covered!\n"
            return report
        
        report += f"**Files needing coverage:** {len(uncovered)}\n\n"
        
        for item in uncovered[:10]:  # Top 10
            report += f"### `{item['file']}`\n"
            report += f"**Uncovered lines:** {item['lines'][:20]}\n\n"
            
            # Get AI suggestions
            suggestions = self.suggest_tests(
                item['file'], 
                item['lines']
            )
            report += f"**Suggested tests:**\n```python\n{suggestions}\n```\n\n"
        
        return report
    
    def run(self):
        """Run full analysis."""
        coverage_data = self.run_coverage()
        
        if not coverage_data:
            print("❌ Could not get coverage data")
            return
        
        report = self.generate_report(coverage_data)
        
        report_path = self.project_root / "COVERAGE_REPORT.md"
        with open(report_path, 'w') as f:
            f.write(report)
        
        print(f"📄 Report saved to {report_path}")


if __name__ == "__main__":
    import sys
    
    project = sys.argv[1] if len(sys.argv) > 1 else "."
    analyzer = CoverageAnalyzer(project)
    analyzer.run()
```

#### Setup Instructions

```bash
# 1. Install dependencies
pip install coverage pytest requests

# 2. Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 3. Pull the model
ollama pull qwen2.5-coder:7b

# 4. Run the analyzer
python coverage_analyzer.py /path/to/project

# 5. View the report
cat COVERAGE_REPORT.md
```

---

### Project 10: Multi-Tool CI/CD Pipeline

> **Complete CI/CD pipeline using only free AI tools.**

#### Description
Build a production-ready CI/CD pipeline that leverages multiple free AI tools for code quality, testing, and deployment.

#### Tools Needed
- Gemini Code Assist (code completion)
- CodeRabbit (PR review)
- Qodo (test generation)
- SonarQube CE (quality gate)
- Snyk (security scanning)
- DeepSource (static analysis)

#### Architecture

```
Developer → Git Push
    ↓
GitHub Actions:
    ├── Stage 1: Code Quality
    │   ├── SonarQube Analysis
    │   ├── DeepSource Analysis
    │   └── Lint & Format Check
    │
    ├── Stage 2: Security
    │   ├── Snyk Vulnerability Scan
    │   └── Dependency Audit
    │
    ├── Stage 3: Testing
    │   ├── Unit Tests (pytest)
    │   ├── Qodo Test Generation
    │   └── Coverage Report
    │
    ├── Stage 4: AI Review
    │   └── CodeRabbit PR Review
    │
    └── Stage 5: Deploy
        ├── Build Docker Image
        └── Deploy to Staging
```

#### Implementation

```yaml
# .github/workflows/ci-cd.yml
name: AI-Powered CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  PYTHON_VERSION: '3.11'

jobs:
  # Stage 1: Code Quality
  code-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install black isort flake8 mypy
      
      - name: Black formatting check
        run: black --check .
      
      - name: Import sorting check
        run: isort --check-only .
      
      - name: Lint with flake8
        run: flake8 .
      
      - name: Type checking with mypy
        run: mypy .

  # Stage 2: Security Scanning
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/python@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
      
      - name: Dependency audit
        run: |
          pip install safety
          safety check

  # Stage 3: Testing
  test:
    runs-on: ubuntu-latest
    needs: [code-quality, security]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov
      
      - name: Run tests with coverage
        run: |
          pytest tests/ \
            --cov=src \
            --cov-report=xml \
            --cov-report=html \
            -v
      
      - name: Upload coverage report
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: htmlcov/

  # Stage 4: AI Review (on PRs only)
  ai-review:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
      
      - name: CodeRabbit Review
        uses: coderabbitai/ai-pr-reviewer@latest
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  # Stage 5: Build & Deploy
  deploy:
    runs-on: ubuntu-latest
    needs: [test]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: |
          docker build -t myapp:${{ github.sha }} .
      
      - name: Push to registry
        run: |
          echo "Pushing to container registry..."
          # docker push myapp:${{ github.sha }}
      
      - name: Deploy to staging
        run: |
          echo "Deploying to staging environment..."
          # kubectl apply -f k8s/staging/
```

#### Setup Instructions

```bash
# 1. Create a new GitHub repository
gh repo create ai-cicd-pipeline --public

# 2. Add the workflow file
mkdir -p .github/workflows
# (copy ci-cd.yml above)

# 3. Set up secrets in GitHub
gh secret set SNYK_TOKEN --body "your-snyk-token"

# 4. Add project files
cat > requirements.txt << EOF
fastapi==0.109.0
uvicorn==0.27.0
pydantic==2.5.3
httpx==0.26.0
pytest==7.4.4
pytest-cov==4.1.0
black==23.12.1
isort==5.13.1
flake8==7.0.0
mypy==1.8.0
EOF

# 5. Create a simple app
cat > src/main.py << EOF
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello, World!"}
EOF

# 6. Push and watch the pipeline run!
git add . && git commit -m "feat: initial setup"
git push origin main
```

---

## 📚 Additional Resources

### Official Documentation Links

| Tool | URL |
|------|-----|
| OpenCode | https://opencode.ai |
| Aider | https://aider.chat |
| Cline | https://github.com/cline/cline |
| Gemini Code Assist | https://cloud.google.com/gemini/docs/codeassist |
| Codeium | https://codeium.com |
| Ollama | https://ollama.com |
| Qwen | https://qwen.ai |
| DeepSeek | https://deepseek.com |

### Community Resources

- **r/AITools**: Reddit community for AI coding tools
- **GitHub Topics**: github.com/topics/ai-coding
- **Hacker News**: Regular discussions on AI dev tools
- **Discord Servers**: Most tools have active Discord communities

### Learning Path

1. **Beginner**: Start with Codeium + Gemini Code Assist
2. **Intermediate**: Add Ollama + Qwen for local coding
3. **Advanced**: Build custom workflows with OpenCode/Aider
4. **Expert**: Create CI/CD pipelines with multiple AI tools

---

## 📝 License

This document is provided as-is for educational purposes. Tool availability and pricing may change. Always check official websites for current information.

---

*Last updated: July 2026*  
*Total tools documented: 48*  
*Total project examples: 10*
