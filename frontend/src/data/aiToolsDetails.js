export const TOOL_DETAILS = {
  "GitHub Copilot": {
    usage: "GitHub Copilot is an AI pair programmer that suggests code completions in real time. Install the VS Code extension, sign in with your GitHub account, and start typing. Copilot suggests entire lines or blocks of code as you type. Use Copilot Chat for conversational help: select code and ask questions, explain code, or generate tests. Supports Python, JavaScript, TypeScript, Go, Ruby, and 15+ languages. Use /fix to diagnose bugs, /tests to generate test suites, and /doc to auto-generate documentation.",
    code: `# Install in VS Code: Extensions -> search "GitHub Copilot" -> Install\n\n# Terminal usage with GitHub CLI:\ngh extension install github/gh-copilot\ngithub copilot suggest "sort a list of numbers in Python"\ngithub copilot explain "what does this awk command do: awk '{print $1}' file.txt"\n\n# Python example - Copilot will suggest completions:\ndef fibonacci(n):\n    # Copilot suggests:\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\n# JavaScript example with inline suggestions:\nasync function fetchUserData(userId) {\n    const response = await fetch(\`/api/users/\${userId}\`);\n    if (!response.ok) throw new Error("Failed to fetch user");\n    return await response.json();\n}`,
    projects: [
      "Build a REST API with auto-generated route handlers and middleware",
      "Create a full test suite for an existing codebase using /tests command",
      "Build a CLI tool with argument parsing where Copilot suggests the parsing logic"
    ]
  },
  "Cursor": {
    usage: "Cursor is an AI-native code editor (fork of VS Code) that deeply understands your codebase. Open a project folder and Cursor indexes your files for context. Use Cmd/Ctrl+K to edit code inline with natural language instructions. Use Cmd/Ctrl+L to open the Chat panel and ask questions about your codebase. Use Cmd+I for Composer mode to make multi-file edits. Enable Codebase Indexing in Settings for project-wide context. Use @files and @codebase mentions in chat to reference specific files or the entire project.",
    code: `# Cursor is a standalone desktop app - download from cursor.com\n\n# Keyboard shortcuts:\n# Cmd/Ctrl + K    -> Inline edit (highlight code, describe changes)\n# Cmd/Ctrl + L    -> Open Chat panel\n# Cmd/Ctrl + I    -> Composer (multi-file edits)\n# Cmd/Ctrl + .    -> Toggle AI model selection\n\n# Example: Inline edit workflow\n# 1. Select a function in your editor\n# 2. Press Cmd+K\n# 3. Type: "Add error handling with try/catch and log errors"\n# 4. Cursor applies the changes with a diff preview\n\n# Composer example for multi-file changes:\n# "Create a new user settings page with a form that updates\n#  preferences via the existing /api/settings endpoint"\n# -> Creates SettingsPage.jsx, SettingsForm.jsx, updates routing`,
    projects: [
      "Refactor a monolith into microservices using Cursor Composer mode",
      "Build an authentication system with auth middleware, routes, and UI",
      "Migrate a JavaScript project to TypeScript with type annotations"
    ]
  },
  "Claude Code": {
    usage: "Claude Code is a terminal-based AI coding agent by Anthropic. Install via npm, navigate to your project directory, and run claude to start an interactive session. Claude Code reads your codebase, makes file edits, runs commands, and manages git operations. Use it for debugging, refactoring, writing tests, and building features. All changes can be reviewed and reverted via git. It can read/write files, run shell commands, search code, and interact with your development environment.",
    code: `# Install Claude Code\nnpm install -g @anthropic-ai/claude-code\n\n# Start in your project directory\ncd my-project\nclaude\n\n# Interactive session:\n> Read the README and explain the project architecture\n> Fix the bug in src/utils/parser.ts where it fails on empty input\n> Add unit tests for the UserService class\n> /init  -- Initialize Claude Code for this project\n\n# Non-interactive mode:\nclaude -p "What does this project do?" --output-format json\n\n# Pipe file contents:\ncat src/app.js | claude -p "Find security vulnerabilities in this code"\n\n# Configuration in .claude/settings.json:\n{\n  "permissions": {\n    "allow": ["Read", "Write", "Bash(npm test)", "Bash(git *)"],\n    "deny": ["Bash(rm -rf)"]\n  }\n}`,
    projects: [
      "Automate code review and refactoring across a large monorepo",
      "Build a full-stack feature from a GitHub issue description end-to-end",
      "Set up CI/CD pipeline configuration and test infrastructure"
    ]
  },
  "Aider": {
    usage: "Aider is a git-aware AI pair programming tool that runs in your terminal. Install via pip, then run aider in your project directory. Aider automatically commits changes with descriptive messages. Use --edit-mode whole to rewrite entire files or --edit-mode diff for surgical edits. Aider sends your entire repo context to the AI and applies edits to your working files. Use /add to include files in context, /drop to remove them, and /run to execute commands.",
    code: `# Install aider\npip install aider-chat\n\n# Basic usage with Claude (recommended):\nexport ANTHROPIC_API_KEY=your-key\ncd my-project\naider\n\n# Use with OpenAI:\nexport OPENAI_API_KEY=your-key\naider --model gpt-4o\n\n# Add files to the chat context:\naider src/app.py src/models/user.py\n\n# Non-interactive:\naider --message "add a login endpoint" src/routes.py\n\n# Use /commands inside the REPL:\n# /add src/utils.py       -- Add file to chat\n# /drop src/utils.py      -- Remove file from chat\n# /run python test.py     -- Run a shell command\n# /undo                   -- Undo last change\n# /diff                   -- Show current changes\n# /commit                 -- Commit changes now`,
    projects: [
      "Refactor a legacy Python codebase with incremental AI-assisted changes",
      "Build a complete Django REST API from scratch using pair programming",
      "Fix a backlog of GitHub issues by feeding them to aider one by one"
    ]
  },
  "Replit Agent": {
    usage: "Replit Agent builds full-stack applications from natural language prompts. Open replit.com, create a new Repl, and select Agent as the template. Describe what you want to build and the Agent will create the project structure, write code, install dependencies, and deploy. Agent handles frontend, backend, database setup, and configuration. You can chat with the Agent to refine features, fix bugs, and iterate. The app runs instantly with a shareable URL.",
    code: `# Replit Agent is accessed through the web IDE at replit.com\n\n# Example prompt to start a project:\n"Build a task management app with:\n - User authentication (email/password)\n - Create, edit, delete tasks\n - Task categories and priority levels\n - Calendar view for due dates\n - Use React for frontend, Express.js for backend, PostgreSQL for database"\n\n# Agent will generate:\n# package.json, requirements.txt\n# src/ directory with components\n# Database schema and migrations\n# API routes and controllers\n\n# Follow-up prompts:\n"Add drag-and-drop for task reordering"\n"Create an admin dashboard with user analytics"\n"Add email notifications for upcoming due dates"\n\n# Deploy with built-in hosting:\n# Replit auto-deploys to your-app.username.repl.co`,
    projects: [
      "Build a SaaS project management tool with team collaboration features",
      "Create a marketplace platform with user listings and payment integration",
      "Build a real-time collaborative whiteboard app with WebSocket support"
    ]
  },
  "Bolt.new": {
    usage: "Bolt.new by StackBlitz is a full-stack app builder that runs entirely in the browser using WebContainers. Type a prompt describing your app and Bolt generates a complete working application with frontend, backend, database, and deployment config. It runs a Node.js environment in your browser with no local setup needed. Edit generated code, add features via chat, and deploy instantly. Supports React, Vue, Svelte, Next.js, and many frameworks.",
    code: `# Bolt.new is accessed at bolt.new in your browser\n\n# Example prompts:\n"Build a real-time chat application with:\n - Socket.io for WebSocket connections\n - User authentication with JWT\n - Public and private chat rooms\n - Message history stored in SQLite\n - React frontend with Tailwind CSS"\n\n# Bolt creates a complete project:\n# /src/components (ChatRoom.jsx, MessageList.jsx, UserLogin.jsx)\n# /src/server (index.js, routes.js)\n# package.json, tailwind.config.js\n\n# Iterate with follow-up messages:\n"Add emoji picker to the message input"\n"Add typing indicators"\n"Make it mobile responsive with a bottom navigation"\n\n# Click "Deploy" -> chooses Netlify or Cloudflare Pages`,
    projects: [
      "Build a full-stack e-commerce store with Stripe integration and admin panel",
      "Create a social media dashboard that aggregates feeds from multiple platforms",
      "Build a collaborative document editor with real-time sync using CRDTs"
    ]
  },
  "v0": {
    usage: "v0 by Vercel generates React UI components and full pages from text prompts or images. Access it at v0.dev, describe a UI component and v0 generates production-ready code using shadcn/ui, Tailwind CSS, and Next.js. You can paste screenshots to recreate designs, iterate via chat, and copy code directly. v0 generates both the JSX markup and the Tailwind styling.",
    code: `# Access v0 at https://v0.dev\n\n# Example prompt:\n"a pricing page with three tiers (Starter, Pro, Enterprise),\n toggle between monthly and annual billing,\n the Pro tier highlighted as popular"\n\n# v0 generates a complete React component:\nimport { useState } from "react";\nimport { Button } from "@/components/ui/button";\nimport { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";\nimport { Switch } from "@/components/ui/switch";\n\nexport function PricingPage() {\n  const [annual, setAnnual] = useState(false);\n  const plans = [\n    { name: "Starter", price: annual ? 19 : 29, features: ["5 projects", "10GB storage"] },\n    { name: "Pro", price: annual ? 49 : 69, features: ["Unlimited projects", "100GB storage"], popular: true },\n    { name: "Enterprise", price: annual ? 99 : 149, features: ["Everything in Pro", "Custom integrations"] }\n  ];\n\n  return (\n    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8">\n      <div className="flex items-center justify-center gap-2 mb-8">\n        <span className="text-sm">Monthly</span>\n        <Switch checked={annual} onCheckedChange={setAnnual} />\n        <span className="text-sm">Annual (save 30%)</span>\n      </div>\n      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">\n        {plans.map((plan) => (\n          <Card key={plan.name} className={plan.popular ? "border-2 border-white scale-105" : ""}>\n            <CardHeader>\n              <CardTitle>{plan.name}</CardTitle>\n              <div className="text-4xl font-bold">${plan.price}<span className="text-sm">/mo</span></div>\n            </CardHeader>\n            <CardContent>\n              <ul className="space-y-2">{plan.features.map(f => <li key={f}>{f}</li>)}</ul>\n              <Button className="w-full mt-4">Get Started</Button>\n            </CardContent>\n          </Card>\n        ))}\n      </div>\n    </div>\n  );\n}`,
    projects: [
      "Generate a complete SaaS landing page with hero, features, pricing, and testimonials",
      "Build a design system by generating and iterating on a reusable component library",
      "Create a data dashboard with charts, tables, and filter controls from a mockup"
    ]
  },
  "Lovable": {
    usage: "Lovable is a full-stack app builder that converts natural language into working web applications. Describe your app at lovable.dev and it generates the entire codebase with React, Supabase, and Tailwind. Lovable handles authentication, database, and deployment. You can iterate via chat, connect to GitHub, and deploy to custom domains. It uses a visual preview so you see changes in real time.",
    code: `# Access Lovable at https://lovable.dev\n\n# Example prompt:\n"Build a recipe sharing platform where users can:\n - Sign up / log in with Google OAuth\n - Create recipes with title, ingredients, steps, and photos\n - Browse recipes with search and filter by cuisine\n - Like and save recipes to personal collections\n Use Supabase for auth and database, deploy to Lovable hosting"\n\n# Lovable generates:\n# /src/pages (Dashboard, RecipeDetail, CreateRecipe, Auth)\n# /src/components (RecipeCard, SearchBar, IngredientList)\n# /src/lib (supabase.ts, api.ts)\n# supabase/migrations/ (Database schema)\n\n# Iterate via chat:\n"Add a commenting system on recipe pages"\n"Add nutrition information calculation"\n"Create an admin panel for content moderation"`,
    projects: [
      "Build a freelancer marketplace with project listings, bids, and escrow payments",
      "Create a personal finance tracker with budget dashboards and spending insights",
      "Build an event management platform with RSVP, ticketing, and calendar integration"
    ]
  },
  "Devin": {
    usage: "Devin by Cognition AI is an autonomous software engineer that plans, writes code, debugs, and deploys. Provide Devin with a task description and it works independently, browsing documentation, writing code, running tests, and iterating until complete. Devin has its own development environment with a browser, terminal, and code editor. It handles complex multi-step tasks like debugging production issues and implementing features from specifications.",
    code: `# Devin is accessed at devin.ai\n\n# Example tasks:\n"Fix the race condition in our WebSocket connection handler.\nThe issue occurs when multiple clients connect simultaneously\nand causes intermittent 500 errors in production.\nHere's the error log: [paste logs]"\n\n# Devin will:\n# 1. Analyze the error logs\n# 2. Find the relevant code files\n# 3. Identify the root cause\n# 4. Implement a fix\n# 5. Write tests to verify\n# 6. Create a pull request\n\n# Complex task example:\n"Migrate our authentication from Passport.js to NextAuth.js:\n - Keep existing user schema in PostgreSQL\n - Support Google and GitHub OAuth providers\n - Maintain session compatibility\n - Update all protected routes and middleware\n - Write integration tests"`,
    projects: [
      "Migrate a legacy Django app to a modern FastAPI backend",
      "Debug and fix a complex production issue across multiple microservices",
      "Implement a complete CI/CD pipeline with automated testing and deployment"
    ]
  },
  "Windsurf": {
    usage: "Windsurf is an AI-native code editor with deep codebase understanding. It features Cascade, an AI agent that can read your project, make multi-file changes, run terminal commands, and understand the context of your entire codebase. Cascade operates as an agentic flow: it plans, executes, and verifies changes autonomously. Supports all major languages and frameworks.",
    code: `# Download Windsurf from windsurf.com\n\n# Open a project and activate Cascade (Cmd/Ctrl+Shift+I)\n\n# Example Cascade prompt:\n"Add dark mode support to this React app:\n 1. Create a ThemeContext with toggle functionality\n 2. Add a theme toggle button to the navbar\n 3. Update all components to use theme tokens\n 4. Persist preference in localStorage\n 5. Respect system preference as default"\n\n# Cascade will:\n# - Read existing components to understand structure\n# - Create ThemeContext.jsx\n# - Modify App.jsx to wrap with ThemeProvider\n# - Update Navbar.jsx with toggle button\n# - Modify component styles to use theme variables\n# - Run the dev server to verify\n\n# Terminal commands within Cascade:\n> Run the tests to make sure everything passes\n> Deploy the changes to Vercel`,
    projects: [
      "Add internationalization (i18n) support to a full-stack React application",
      "Build a design token system and theme engine for a component library",
      "Refactor a monolithic frontend into a micro-frontend architecture"
    ]
  },
  "OpenAI Codex": {
    usage: "OpenAI Codex is an AI coding agent that works on multiple tasks simultaneously in cloud sandboxes. It reads your GitHub repository, creates branches, writes code, runs tests, and opens pull requests. Each task runs in an isolated environment with internet access for installing dependencies. Codex handles bug fixes, feature implementation, refactoring, and test writing.",
    code: `# Access Codex through ChatGPT or platform.openai.com\n\n# Via ChatGPT with Codex:\n"Fix issue #42 in my repository github.com/user/repo"\n"Add a search feature to the product listing page"\n"Write tests for the authentication module"\n\n# Codex will:\n# 1. Clone/checkout the repository\n# 2. Analyze the codebase and issue\n# 3. Create a new branch\n# 4. Implement the changes\n# 5. Run existing tests to verify nothing breaks\n# 6. Create a pull request with description\n\n# Via API:\nfrom openai import OpenAI\nclient = OpenAI()\n\nresponse = client.responses.create(\n    model="o4-mini",\n    input=[\n        {"role": "user", "content": "Fix the failing test in tests/auth.test.js"}\n    ],\n    tools=[{"type": "code_interpreter", "container": {"type": "auto"}}]\n)`,
    projects: [
      "Automate issue triage and resolution across a monorepo with 50+ open issues",
      "Build a continuous improvement pipeline that refactors code smells automatically",
      "Implement feature flags and A/B testing infrastructure across a full-stack app"
    ]
  },
  "Continue": {
    usage: "Continue is an open-source AI code assistant that connects to any LLM including GPT-4, Claude, local models, or custom endpoints. Install the VS Code or JetBrains extension and configure your preferred model. Continue supports inline edits, chat, and codebase-aware completions. It runs locally and never sends code to third parties unless you choose a cloud model.",
    code: `# Install: VS Code Extensions -> search "Continue"\n\n# Configure ~/.continue/config.json:\n{\n  "models": [\n    {\n      "title": "Claude 3.5 Sonnet",\n      "provider": "anthropic",\n      "model": "claude-3-5-sonnet-20241022",\n      "apiKey": "YOUR_KEY"\n    },\n    {\n      "title": "Local Llama 3",\n      "provider": "ollama",\n      "model": "llama3:70b"\n    }\n  ],\n  "tabAutocompleteModel": {\n    "title": "Codestral",\n    "provider": "mistral",\n    "model": "codestral-latest"\n  }\n}\n\n# Keyboard shortcuts:\n# Cmd/Ctrl + L    -> Open chat\n# Cmd/Ctrl + I    -> Inline edit\n# Tab             -> Accept autocomplete\n# Cmd/Ctrl + /    -> Open model selector\n\n# Features:\n# @codebase  -- search entire project for context\n# @file      -- reference specific files\n# @terminal  -- include terminal output in context\n# @docs      -- reference documentation`,
    projects: [
      "Set up a private AI coding assistant using local Llama models with Continue",
      "Configure Continue with a custom fine-tuned model for domain-specific generation",
      "Build a team-shared Continue configuration with project-specific rules"
    ]
  },
  "Cline": {
    usage: "Cline is an autonomous AI coding agent for VS Code. It can create/edit files, run terminal commands, browse the web, and use any MCP server. Cline operates step-by-step, showing its reasoning and asking permission before actions. It supports Claude, GPT-4, and other models. Cline is excellent for complex multi-step tasks where it needs to explore your codebase and make coordinated changes.",
    code: `# Install Cline in VS Code:\n# Extensions -> search "Cline" -> Install\n\n# Cline operates through a chat panel on the sidebar:\n# 1. Select your model (Claude recommended)\n# 2. Describe your task\n# 3. Cline plans and executes step by step\n# 4. Approve or deny each file change/command\n\n# Example workflow:\n"Implement a file upload feature:\n - Drag and drop zone component\n - File type validation (images only, max 10MB)\n - Upload to S3 with presigned URLs\n - Progress indicator during upload\n - Preview after upload complete\n Use our existing AWS SDK setup and React Query"\n\n# Cline will:\n# 1. Read existing code to understand patterns\n# 2. Create FileDropZone.jsx component\n# 3. Create uploadService.ts with S3 logic\n# 4. Create presigned URL endpoint in API\n# 5. Add React Query mutation hook\n# 6. Integrate into the form\n# 7. Run linter and type checker`,
    projects: [
      "Build a complete CI/CD pipeline configuration with Docker and Kubernetes",
      "Implement a real-time notification system across frontend and backend",
      "Migrate a database schema and update all API endpoints and tests"
    ]
  },
  "Roo Code": {
    usage: "Roo Code is a fork of Cline with enhanced features like custom modes, MCP support, and improved context management. It supports multiple AI providers and can operate in different modes (Code, Architect, Debug, Ask) for different task types. Each mode has its own system prompt and tool permissions. Install the VS Code extension and configure your preferred LLM.",
    code: `# Install: VS Code -> Extensions -> "Roo Code" -> Install\n\n# Modes (built-in):\n# Code Mode    -- Write and edit code\n# Architect    -- Design and plan\n# Debug        -- Diagnose and fix issues\n# Ask          -- Answer questions\n\n# Custom mode example (in settings):\n# Create "Review" mode:\n# - System prompt: "You are a code reviewer. Analyze code for\n#   security, performance, and maintainability issues."\n# - Allowed tools: read-only file access, grep\n\n# MCP Server integration:\n# Add servers in .roo/mcp.json:\n{\n  "mcpServers": {\n    "filesystem": {\n      "command": "npx",\n      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/docs"]\n    },\n    "postgres": {\n      "command": "npx",\n      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://..."]\n    }\n  }\n}\n\n# Switch between modes with Cmd/Ctrl + Shift + P -> "Roo: Change Mode"`,
    projects: [
      "Set up a multi-mode AI assistant for a development team with custom permissions",
      "Use Architect mode to design a microservices system and Code mode to implement it",
      "Configure MCP servers for database, API, and documentation access"
    ]
  },
  "StarCoder2": {
    usage: "StarCoder2 is a family of open-source code generation models by BigCode. Available in 3B, 7B, and 15B parameter sizes, it supports 619 programming languages and has a 16K token context window. Run locally with vLLM, TGI, or Ollama. Fine-tune on your own codebase for domain-specific completions.",
    code: `# Install dependencies\npip install transformers torch accelerate\n\n# Quick inference:\nfrom transformers import AutoModelForCausalLM, AutoTokenizer\n\nmodel_name = "bigcode/starcoder2-15b"\ntokenizer = AutoTokenizer.from_pretrained(model_name)\nmodel = AutoModelForCausalLM.from_pretrained(\n    model_name, device_map="auto", torch_dtype="auto"\n)\n\nprompt = """def calculate_distance(lat1, lon1, lat2, lon2):\n    """Calculate the great circle distance."""\n"""\ninputs = tokenizer(prompt, return_tensors="pt").to(model.device)\noutputs = model.generate(**inputs, max_new_tokens=200, temperature=0.2)\nprint(tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:]))\n\n# Run with Ollama:\n# ollama run starcoder2:15b\n\n# Run with vLLM for production:\npip install vllm\npython -m vllm.entrypoints.openai.api_server \\\n    --model bigcode/starcoder2-15b --port 8000`,
    projects: [
      "Fine-tune StarCoder2 on your company's internal codebase for domain-specific completions",
      "Build a self-hosted code completion service for air-gapped development environments",
      "Create a multilingual code translation tool using 619-language support"
    ]
  },
  "Code Llama": {
    usage: "Code Llama is Meta's family of code-specialized LLMs built on Llama 2. Available in 7B, 13B, 34B, and 70B parameter sizes. Variants include Codel (completion), Instruct (chat), and Python-specialized versions. Run locally with llama.cpp, Ollama, or through cloud APIs via Together AI and AWS Bedrock.",
    code: `# Run with Ollama:\n# ollama run codellama:34b\n\n# Python inference:\nfrom transformers import AutoModelForCausalLM, AutoTokenizer\nimport torch\n\nmodel_name = "codellama/CodeLlama-34b-hf"\ntokenizer = AutoTokenizer.from_pretrained(model_name)\nmodel = AutoModelForCausalLM.from_pretrained(\n    model_name, torch_dtype=torch.float16, device_map="auto"\n)\n\nprompt = "# Function to validate an email address\\nimport re\\n\\ndef validate_email(email: str) -> bool:"\ninputs = tokenizer(prompt, return_tensors="pt").to("cuda")\noutput = model.generate(**inputs, max_new_tokens=256, temperature=0.1)\nprint(tokenizer.decode(output[0][inputs.input_ids.shape[1]:], skip_special_tokens=True))\n\n# Via Together AI API:\nimport together\nclient = together.Together(api_key="YOUR_KEY")\nresponse = client.completions.create(\n    model="codellama-70b",\n    prompt="# Sort a list of dictionaries by a key\\n",\n    max_tokens=200\n)`,
    projects: [
      "Build a code review bot that uses Code Llama to suggest improvements",
      "Create a documentation generator that reads code and produces docstrings",
      "Build a legacy code translator from COBOL/Fortran to Python"
    ]
  },
  "Midjourney": {
    usage: "Midjourney generates high-quality images from text prompts via Discord. Join the Midjourney Discord server, use /imagine in any channel, and type your prompt. The bot generates 4 image variations, then you can U (upscale) or V (variate) to generate similar alternatives. Use --ar for aspect ratio, --style for aesthetic, --s for stylization, --c for chaos, and --no for negative prompts. Version 6.1 supports photorealistic images and accurate text rendering.",
    code: `# Midjourney is accessed via Discord bot commands\n\n# Basic prompt:\n/imagine A cozy coffee shop interior with warm lighting, \nrainy window, watercolor painting style --ar 16:9 --style raw\n\n# Parameters:\n# --ar 16:9        Aspect ratio\n# --s 750          Stylization (0-1000)\n# --c 30           Chaos (0-100)\n# --q 2            Quality\n# --style raw      Less opinionated aesthetic\n# --no text,words  Negative prompt\n# --seed 12345     Reproducible results\n\n# Multi-prompt with weights:\n/imagine beautiful garden::2 flowers::1.5 butterflies::1 --ar 3:2\n\n# Use /describe to reverse-engineer prompts from images\n# Upload an image and Midjourney generates prompt descriptions\n\n# Web access: midjourney.com/app for managing generations\n# Subscription: midjourney.com - plans from $10/month`,
    projects: [
      "Create a brand identity package with logo concepts, color palettes, and marketing visuals",
      "Generate concept art for a game or film project with consistent style across scenes",
      "Build a print-on-demand product line with unique artwork for merchandise"
    ]
  },
  "DALL-E 3": {
    usage: "DALL-E 3 is OpenAI's image generation model, integrated into ChatGPT and available via API. It excels at following detailed prompts, rendering text in images, and creating photorealistic or artistic images. In ChatGPT, simply describe the image you want. Via API, use the images.generate endpoint with a detailed prompt, size, and quality parameters.",
    code: `# Via OpenAI API:\nimport openai\nimport httpx\n\nclient = openai.OpenAI()\n\nresponse = client.images.generate(\n    model="dall-e-3",\n    prompt="A serene Japanese garden in autumn with a wooden bridge over a koi pond, \\\n           maple leaves falling, watercolor painting style, soft warm lighting",\n    size="1792x1024",\n    quality="hd",\n    n=1,\n)\n\nimage_url = response.data[0].url\nrevised_prompt = response.data[0].revised_prompt\nprint(f"Generated: {image_url}")\n\n# Save the image:\nimg_data = httpx.get(image_url).content\nwith open("garden.png", "wb") as f:\n    f.write(img_data)\n\n# Product photo style:\nresponse = client.images.generate(\n    model="dall-e-3",\n    prompt="Product photo: minimalist white wireless earbuds on a marble surface, \\\n           studio lighting, soft shadow, e-commerce style",\n    size="1024x1024",\n    quality="hd",\n    style="vivid",\n)`,
    projects: [
      "Generate marketing assets for a product launch campaign automatically",
      "Create educational illustrations for a science blog or textbook",
      "Build a placeholder image generator for web development projects"
    ]
  },
  "Stable Diffusion": {
    usage: "Stable Diffusion is an open-source image generation model you can run locally for free. Install via ComfyUI (node-based), Automatic1111 (web UI), or use the diffusers library in Python. It supports text-to-image, image-to-image, inpainting, ControlNet, and LoRA fine-tuning. Run on consumer GPUs with 6GB+ VRAM or in the cloud.",
    code: `# Install with diffusers:\npip install diffusers transformers accelerate torch safetensors\n\n# Text-to-image generation:\nimport torch\nfrom diffusers import StableDiffusionXLPipeline\n\npipe = StableDiffusionXLPipeline.from_pretrained(\n    "stabilityai/stable-diffusion-xl-base-1.0",\n    torch_dtype=torch.float16,\n    use_safetensors=True\n).to("cuda")\n\nimage = pipe(\n    prompt="A cyberpunk city street at night, neon signs, rain reflections, cinematic lighting",\n    negative_prompt="blurry, low quality, distorted faces, extra fingers",\n    num_inference_steps=30,\n    guidance_scale=7.5,\n    width=1024, height=1024\n).images[0]\nimage.save("cyberpunk.png")\n\n# Inpainting:\nfrom diffusers import StableDiffusionInpaintPipeline\ninpaint_pipe = StableDiffusionInpaintPipeline.from_pretrained(\n    "stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16\n).to("cuda")\n\nresult = inpaint_pipe(\n    prompt="a golden retriever puppy",\n    image=original_image,\n    mask_image=mask_image,\n    num_inference_steps=30\n).images[0]\n\n# Apply LoRA weights:\npipe.load_lora_weights("path/to/style_lora.safetensors")\nimage = pipe(prompt="...", cross_attention_kwargs={"scale": 0.8})`,
    projects: [
      "Create a local image generation pipeline with custom LoRA styles for a design studio",
      "Build a product photography tool that generates lifestyle shots from product cutouts",
      "Set up an image-to-image translation system for converting sketches to finished art"
    ]
  },
  "Adobe Firefly": {
    usage: "Adobe Firefly is Adobe's generative AI for creative professionals, designed for commercial safety and trained on licensed content. Access via Photoshop (Generative Fill, Generative Expand), Illustrator (Generative Recolor, Text to Vector), or web at firefly.adobe.com. Use text prompts to generate images, extend images, replace backgrounds, or create vector graphics. All generated content is commercially safe with Adobe's IP indemnity.",
    code: `# Adobe Firefly is accessed through Adobe apps or firefly.adobe.com\n\n# Photoshop Generative Fill:\n# 1. Select an area with any selection tool\n# 2. Click "Generative Fill" in the context bar\n# 3. Type a description (or leave blank to remove)\n# 4. Click Generate - 3 variations provided\n\n# Firefly web API:\n# curl -X POST "https://firefly-api.adobe.com/v1/images/generate" \\\n#   -H "Authorization: Bearer YOUR_TOKEN" \\\n#   -d '{\n#     "prompt": "A futuristic office space with biophilic design",\n#     "aspect_ratio": "16:9",\n#     "n": 3\n#   }'\n\n# Illustrator Text to Vector:\n# 1. Select "Text to Vector" in the toolbar\n# 2. Choose type: Scene, Object, Pattern, or Icon\n# 3. Enter prompt describing what you need\n# 4. Generate and edit the vector paths`,
    projects: [
      "Create a consistent brand visual library using Firefly's style references",
      "Build a real estate staging tool that generates virtual furniture in empty rooms",
      "Design a complete marketing campaign with AI-generated social media assets"
    ]
  },
  "Sora": {
    usage: "Sora is OpenAI's AI video generation model that creates realistic videos from text prompts. It generates videos up to 1080p resolution and 20 seconds long. Sora understands physics, object permanence, and camera movements. Access via sora.com or through ChatGPT Plus/Pro. Supports storyboarding for multi-scene videos and image-to-video generation.",
    code: `# Sora is accessed at sora.com or through ChatGPT Plus/Pro\n\n# Text-to-video prompt structure:\n# Subject + Action + Environment + Camera + Lighting + Style\n\n# Example prompts:\n"Camera follows a golden retriever running through a field of\nwildflowers at sunset, low angle tracking shot, warm golden hour\nlighting, cinematic depth of field, 4K quality"\n\n"A timelapse of a bowl of fruit on a kitchen counter, watching\nthe fruit slowly ripen then decay, stop-motion style,\noverhead camera, kitchen background"\n\n"Drone shot rising above a foggy mountain valley at dawn,\nrevealing a hidden village with smoke rising from chimneys,\naerial cinematography, epic scale"\n\n# Sora features:\n# - Remix: Take existing video and modify with new prompt\n# - Re-cut: Edit specific sections of generated video\n# - Storyboard: Plan multiple connected scenes\n# - Blend: Mix two video concepts together\n# - Image-to-video: Upload a still image and describe the motion`,
    projects: [
      "Create a short film storyboard with consistent characters across scenes",
      "Generate product demo videos for an e-commerce store without filming equipment",
      "Build a social media content pipeline producing daily video posts automatically"
    ]
  },
  "Runway Gen-3": {
    usage: "Runway Gen-3 Alpha is a professional AI video generation platform. It generates high-quality videos from text or images with precise control over camera movements, transitions, and timing. Access at runwayml.com. Supports multi-motion prompting, style references, and video extension. Offers standard and Turbo (faster) generation modes.",
    code: `# Access Runway at runwayml.com\n\n# Text-to-video workflow:\n# 1. Click "New Generation" -> "Text to Video"\n# 2. Enter detailed prompt\n# 3. Choose duration (5s or 10s)\n# 4. Set aspect ratio and resolution\n# 5. Generate (takes 1-3 minutes)\n\n# Example professional prompts:\n"Close-up of a hand slowly pouring espresso into a ceramic cup,\nsteam rising, morning kitchen with soft window light,\nsmooth cinematic dolly movement, shallow depth of field,\nwarm color grade, shot on 35mm film"\n\n# Runway API:\n# import requests\n# headers = {"Authorization": "Bearer YOUR_TOKEN"}\n# response = requests.post(\n#     "https://api.dev.runwayml.com/v1/image_to_video",\n#     headers=headers,\n#     json={"model": "gen3a_turbo", "promptImage": "url",\n#            "promptText": "Camera slowly zooms in", "duration": 10}\n# )\n\n# Motion Brush: Paint areas of an image to add specific motion\n# Green Screen: Remove backgrounds from video`,
    projects: [
      "Create a cinematic brand story video with consistent visual style",
      "Generate B-roll footage for a documentary or news production",
      "Build a product showcase video from still product photos"
    ]
  },
  "Pika": {
    usage: "Pika is an AI video generation tool that creates videos from text, images, or existing videos. Access at pika.art. Known for creative and stylized outputs, Pika supports text-to-video, image-to-video, and video-to-video transformations. Features include Pika Scenes for character-consistent generation, sound effects generation, and lip sync. Free tier available with daily credits.",
    code: `# Access Pika at pika.art\n\n# Text-to-video:\n# 1. Enter a text prompt describing your scene\n# 2. Choose aspect ratio and duration\n# 3. Click "Generate"\n\n# Example prompts:\n"A cat wearing a tiny astronaut helmet floating in space,\nstars in background, dreamy atmosphere, Pixar style"\n\n# Image-to-video:\n# Upload an image and add a motion prompt:\n# "The character turns their head and smiles"\n\n# Pika Scenes - maintain character consistency:\n# 1. Upload or generate a character reference\n# 2. Use /scene command in prompt\n# 3. Generate multiple scenes with same character\n\n# Features:\n# - Sound effects generation for videos\n# - Lip sync: Match character lips to audio\n# - Expand canvas (outpainting for video)\n# - Modify region (inpaint specific areas)\n# - Extend video length`,
    projects: [
      "Create animated social media content with character consistency",
      "Generate product explainer videos from static product images",
      "Build a storyboard animatic for a film project using image-to-video"
    ]
  },
  "HeyGen": {
    usage: "HeyGen creates AI avatar videos for marketing, training, and communication. Choose from 100+ stock avatars or create a custom avatar from a video of yourself. Write a script, select a voice, and HeyGen generates a video of the avatar speaking your script with natural lip sync. Supports 40+ languages. Access at heygen.com.",
    code: `# Access HeyGen at heygen.com\n\n# Quick video creation:\n# 1. Choose an avatar (stock or custom)\n# 2. Write or paste your script\n# 3. Select voice and language\n# 4. Add background/template\n# 5. Generate video\n\n# HeyGen API:\nimport requests\n\nAPI_KEY = "your-api-key"\nheaders = {"X-Api-Key": API_KEY, "Content-Type": "application/json"}\n\nresponse = requests.post(\n    "https://api.heygen.com/v2/video/generate",\n    headers=headers,\n    json={\n        "video_inputs": [{\n            "character": {"type": "avatar", "avatar_id": "YOUR_AVATAR_ID"},\n            "voice": {"type": "text", "input_text": "Hello world",\n                      "voice_id": "en-US-Jenny"}\n        }],\n        "dimension": {"width": 1920, "height": 1080}\n    }\n)\n\nvideo_id = response.json()["data"]["video_id"]\n\n# Custom avatar creation:\n# Record 2-5 minutes of yourself speaking\n# HeyGen creates a digital clone that speaks any script\n\n# Translation:\n# Upload video -> select target language -> AI translates and re-lips`,
    projects: [
      "Create multilingual training videos for a global workforce",
      "Build personalized sales outreach videos at scale for B2B prospects",
      "Generate daily news briefing videos with an AI anchor for social media"
    ]
  },
  "Synthesia": {
    usage: "Synthesia creates professional AI videos with digital avatars for enterprise training, marketing, and communications. Choose from 230+ diverse avatars or create a custom avatar. Supports 120+ languages and accents. Access at synthesia.io. Used by over 50,000 companies for L&D, sales enablement, and customer onboarding content.",
    code: `# Access Synthesia at synthesia.io\n\n# Video creation workflow:\n# 1. Select template or start blank\n# 2. Choose avatar and voice\n# 3. Write script (paste or type)\n# 4. Add slides, images, screen recordings\n# 5. Generate HD video\n\n# API for programmatic video generation:\n# POST https://api.synthesia.io/v1/videos\n# Headers: Authorization: Bearer YOUR_API_KEY\n# Body: {\n#   "templateId": "template-id",\n#   "title": "Product Update",\n#   "aspectRatio": "16:9",\n#   "scripts": [{\n#     "actor": "avatar-id",\n#     "script": "Welcome to our quarterly product update...",\n#     "voice": "en-US-Neural2-F",\n#     "background": {"type": "color", "value": "#FFFFFF"}\n#   }]\n# }\n\n# Features:\n# - Brand kit: Custom logos, colors, fonts\n# - Collaboration: Team review and approval\n# - Analytics: Track viewer engagement\n# - Closed captions: Auto-generated subtitles`,
    projects: [
      "Build an automated onboarding video pipeline that generates personalized welcome videos",
      "Create a multilingual product training library with consistent brand presentation",
      "Generate weekly company update videos with AI avatars for remote teams"
    ]
  },
  "CapCut AI": {
    usage: "CapCut is a free video editing app with powerful AI features. Available on mobile, desktop, and web at capcut.com. AI features include auto-captions, text-to-speech, background removal, style transfer, AI effects, and smart editing suggestions. The AI script generator creates video scripts from topics. Templates section provides trending formats you can customize.",
    code: `# CapCut is available at capcut.com (web) or as a desktop/mobile app\n\n# AI features:\n# 1. Auto Captions: Upload video -> Generate -> Auto-transcribe\n# 2. Text to Speech: Paste text -> Choose voice -> Generate audio\n# 3. Background Removal: Select clip -> Remove Background (one click)\n# 4. AI Style Transfer: Apply artistic styles to video clips\n# 5. Smart Editing: AI suggests cuts, transitions, and effects\n# 6. Script Generator: AI writes video scripts from a topic\n\n# Workflow example:\n# 1. Import raw footage\n# 2. AI generates a rough cut\n# 3. Edit captions and add text overlays\n# 4. Apply auto-transitions and effects\n# 5. Generate AI voiceover for narration\n# 6. Export with auto-captions burned in\n\n# CapCut for Business (capcut.com/business):\n# - Batch video processing\n# - Brand templates\n# - Team collaboration\n# - Bulk auto-captions`,
    projects: [
      "Create a TikTok/Reels content pipeline with auto-captions and trending templates",
      "Build a product demo video generator from screen recordings",
      "Generate multilingual video content with AI voiceover and auto-translations"
    ]
  },
  "Descript": {
    usage: "Descript is an AI-powered video and audio editor that lets you edit media by editing text. Upload a recording and Descript transcribes it. Edit the transcript to edit the video. Features include Overdub (AI voice cloning to fix mistakes), filler word removal, eye contact correction, Studio Sound (enhance audio quality), and green screen. Access at descript.com.",
    code: `# Download Descript from descript.com\n\n# Core editing workflow:\n# 1. Upload or record video/audio\n# 2. Descript auto-transcribes\n# 3. Edit the text transcript -> edits the video\n# 4. Remove filler words (um, uh, like) with one click\n# 5. Add captions, transitions, music\n\n# Overdub (voice cloning):\n# 1. Train a voice model (5 minutes of audio)\n# 2. Type text to generate new speech in your voice\n# 3. Fix mistakes without re-recording\n\n# Studio Sound:\n# One-click audio enhancement that removes background noise,\n# echo, and makes audio sound professional\n\n# Export options:\n# - Video: MP4, MOV, GIF\n# - Audio: MP3, WAV, AAC\n# - Subtitles: SRT, VTT\n# - Transcript: TXT, DOCX`,
    projects: [
      "Build a podcast production workflow with AI editing and noise removal",
      "Create a course content pipeline that auto-generates captions and chapters",
      "Produce weekly video newsletters with automated transcription and editing"
    ]
  },
  "Kling AI": {
    usage: "Kling AI is a video generation model by Kuaishou that creates high-quality videos from text or images. It excels at complex motion, physics simulation, and long-form video generation up to 2 minutes. Supports text-to-video and image-to-video. Access at klingai.com.",
    code: `# Access Kling AI at klingai.com\n\n# Text-to-video examples:\n"An astronaut walking on Mars, low gravity bounce in step,\nred rocky landscape, Earth visible in orange sky,\ncinematic camera tracking alongside, ultra realistic"\n\n# Image-to-video:\n# Upload a reference image\n# Add motion description:\n# "The person in the image turns around and waves at the camera"\n\n# Kling features:\n# - Motion Brush: Control which parts of the image move\n# - Camera control: Define pan, tilt, zoom, track movements\n# - Lip sync: Match mouth movements to audio\n# - Professional mode: Higher quality, slower generation\n\n# Quality settings:\n# - Standard: 720p, faster generation\n# - Professional: 1080p, better quality\n# - Duration: 5s, 10s, or extended`,
    projects: [
      "Create cinematic nature documentary footage without filming equipment",
      "Generate product lifestyle videos from product photography",
      "Build animated story sequences for children's books"
    ]
  },
  "Leonardo AI": {
    usage: "Leonardo AI is an AI image generation platform with fine-tuned models for different styles. Access at leonardo.ai. Offers text-to-image, image-to-image, AI canvas (inpainting/outpainting), 3D texture generation, and video generation. Train custom models on your own images for consistent style. Free tier includes 150 daily tokens.",
    code: `# Access Leonardo AI at leonardo.ai\n\n# Leonardo API:\nimport requests\n\nheaders = {"Authorization": "Bearer YOUR_API_KEY"}\n\nresponse = requests.post(\n    "https://cloud.leonardo.ai/api/rest/v1/generation/generate-image",\n    headers=headers,\n    json={\n        "prompt": "A mystical forest with bioluminescent plants, fantasy art",\n        "negative_prompt": "blurry, low quality",\n        "modelId": "e31e714b-b7f1-4bab-81b9-0191393c7425",\n        "width": 1024,\n        "height": 768,\n        "num_images": 4,\n        "guidance_scale": 7,\n        "num_inference_steps": 30\n    }\n)\n\n# Model selection:\n# - Leonardo Phoenix: Photorealistic, versatile\n# - DreamShaper: Artistic, fantasy styles\n# - Anime: Anime and manga style\n# - 3D Animation: Disney/Pixar style\n\n# Custom model training:\n# Upload 10-50 images of a consistent style\n# Leonardo trains a model that generates images in that style`,
    projects: [
      "Train a custom model on your brand's visual style for consistent marketing assets",
      "Generate game assets (characters, environments, items) for an indie game",
      "Create an architectural visualization pipeline with realistic interior renders"
    ]
  },
  "Flux": {
    usage: "Flux is a family of open-source image generation models by Black Forest Labs. Available in Flux.1 schnell (fast), dev (development), and pro (commercial). Known for exceptional prompt adherence, photorealism, and text rendering. Run locally with ComfyUI or diffusers, or use via Replicate and other cloud providers.",
    code: `# Install diffusers:\npip install diffusers transformers accelerate torch\n\n# Flux.1 schnell (fast, open-source):\nimport torch\nfrom diffusers import FluxPipeline\n\npipe = FluxPipeline.from_pretrained(\n    "black-forest-labs/FLUX.1-schnell",\n    torch_dtype=torch.bfloat16\n).to("cuda")\n\nimage = pipe(\n    prompt="A hyper-realistic photograph of a cappuccino on a wooden table, \\\n           morning sunlight, latte art heart shape",\n    num_inference_steps=4,\n    guidance_scale=0.0\n).images[0]\nimage.save("cappuccino.png")\n\n# Flux.1 dev (higher quality, non-commercial):\npipe_dev = FluxPipeline.from_pretrained(\n    "black-forest-labs/FLUX.1-dev",\n    torch_dtype=torch.bfloat16\n).to("cuda")\n\nimage = pipe_dev(\n    prompt="A watercolor painting of a Mediterranean village at sunset",\n    num_inference_steps=28,\n    guidance_scale=3.5\n).images[0]\n\n# Via Replicate:\nimport replicate\noutput = replicate.run(\n    "black-forest-labs/flux-schnell",\n    input={"prompt": "Your prompt here", "num_outputs": 1}\n)`,
    projects: [
      "Build a product photography generator that creates lifestyle shots from product cutouts",
      "Create a consistent character portrait generator for a graphic novel",
      "Generate photorealistic architectural visualizations from text descriptions"
    ]
  },
  "Ideogram": {
    usage: "Ideogram excels at generating images with accurate text rendering - logos, posters, signs, and typography. Access at ideogram.ai. Offers multiple styles (Realistic, Design, Anime, 3D), aspect ratio control, and a Magic Prompt feature that enhances your prompts. Free tier includes daily generations.",
    code: `# Access Ideogram at ideogram.ai\n\n# Text in images - Ideogram's strength:\n"Minimalist logo design for 'NovaTech' company, clean sans-serif font,\nblue gradient icon, white background, professional branding"\n\n"A vintage neon sign reading 'OPEN 24 HOURS' on a brick wall,\nwarm glow, nighttime atmosphere"\n\n# Ideogram styles:\n# - Realistic: Photorealistic output\n# - Design: Clean graphic design aesthetic\n# - Anime: Japanese animation style\n# - 3D: 3D rendered look\n\n# API access:\n# POST https://api.ideogram.ai/generate\n# Headers: Api-Key: YOUR_KEY\n# Body: {\n#   "image_request": {\n#     "prompt": "Your text-heavy design prompt",\n#     "aspect_ratio": "ASPECT_16_9",\n#     "model": "V_2",\n#     "magic_prompt_option": "ON"\n#   }\n# }`,
    projects: [
      "Design a complete brand identity with logos, business cards, and social media graphics",
      "Create a series of motivational posters with accurate typography",
      "Generate mockup signage and wayfinding designs for architectural projects"
    ]
  },
  "ElevenLabs": {
    usage: "ElevenLabs provides ultra-realistic voice synthesis and voice cloning. Clone a voice from a few minutes of audio, then generate speech in that voice with any text. Access at elevenlabs.io. Supports 29 languages, emotional delivery, and real-time streaming. Used for audiobooks, dubbing, voice assistants, and content creation.",
    code: `# Install the SDK:\npip install elevenlabs\n\nfrom elevenlabs.client import ElevenLabs\n\nclient = ElevenLabs(api_key="YOUR_API_KEY")\n\n# Generate speech\naudio = client.generate(\n    text="Welcome to our podcast. Today we're diving deep into the latest developments in AI.",\n    voice="Rachel",\n    model="eleven_multilingual_v2"\n)\n\nwith open("output.mp3", "wb") as f:\n    for chunk in audio:\n        f.write(chunk)\n\n# Voice cloning:\n# 1. Upload 1-30 minutes of reference audio\n# 2. Name your voice\n# 3. Use the cloned voice by ID\n\n# Streaming for real-time:\ndef stream_audio(text):\n    audio_stream = client.generate(text=text, voice="Rachel", stream=True)\n    for chunk in audio_stream:\n        yield chunk\n\n# List available voices\nvoices = client.voices.get_all()\nfor voice in voices.voices:\n    print(f"{voice.name} (ID: {voice.voice_id})")`,
    projects: [
      "Build a podcast voice cloning system for automated episode generation",
      "Create an accessibility tool that reads articles aloud with natural voices",
      "Build a multilingual dubbing pipeline for video content"
    ]
  },
  "Whisper": {
    usage: "OpenAI Whisper is an open-source speech-to-text model that transcribes audio in 99 languages. Run locally with the Python package or via OpenAI's API. Handles accents, background noise, and technical terminology well. Supports transcription, translation to English, and timestamp generation.",
    code: `# Install Whisper:\npip install openai-whisper\n\nimport whisper\n\nmodel = whisper.load_model("base")  # tiny, base, small, medium, large\nresult = model.transcribe("audio.mp3")\nprint(result["text"])\n\n# With timestamps:\nfor segment in result["segments"]:\n    print(f"[{segment['start']:.1f}s - {segment['end']:.1f}s] {segment['text']}")\n\n# Translation to English:\nresult = model.transcribe("french_speech.mp3", task="translate")\n\n# Model sizes:\n# tiny:   39M params, ~1GB RAM\n# base:   74M params, ~1GB RAM\n# small:  244M params, ~2GB RAM\n# medium: 769M params, ~5GB RAM\n# large:  1550M params, ~10GB RAM\n\n# Using OpenAI API:\nfrom openai import OpenAI\nclient = OpenAI()\n\nwith open("audio.mp3", "rb") as f:\n    transcript = client.audio.transcriptions.create(\n        model="whisper-1", file=f,\n        response_format="verbose_json",\n        timestamp_granularities=["segment"]\n    )`,
    projects: [
      "Build a meeting notes generator that transcribes recordings and summarizes key points",
      "Create a podcast search engine with full-text transcription and keyword indexing",
      "Build a language learning tool that compares pronunciation against native audio"
    ]
  },
  "Deepgram": {
    usage: "Deepgram provides fast, accurate speech-to-text APIs with real-time streaming. Supports 36+ languages, speaker diarization, sentiment analysis, and summarization. Known for speed (200x faster than real-time) and cost-effectiveness. Access at deepgram.com.",
    code: `# Install Deepgram SDK:\npip install deepgram-sdk\n\nfrom deepgram import DeepgramClient, PrerecordedOptions\n\nclient = DeepgramClient("YOUR_API_KEY")\n\n# Pre-recorded transcription:\nwith open("audio.mp3", "rb") as audio:\n    payload = {"buffer": audio}\n    options = PrerecordedOptions(\n        model="nova-2", smart_format=True, diarize=True,\n        punctuate=True, paragraphs=True, sentiment=True\n    )\n    response = client.listen.prerecorded.transcribe_file(payload, options)\n    print(response["results"]["channels"][0]["alternatives"][0]["transcript"])\n\n# Real-time streaming:\nfrom deepgram import LiveTranscriptionEvents, LiveOptions\n\nconnection = client.listen.live.new_connection()\n\ndef on_message(result):\n    print(result.channel.alternatives[0].transcript)\n\nconnection.on(LiveTranscriptionEvents.Transcript, on_message)\nconnection.start(LiveOptions(\n    model="nova-2", language="en-US",\n    interim_results=True, endpointing=300\n))`,
    projects: [
      "Build a real-time captioning system for live video streams",
      "Create an automated transcription service for podcast producers",
      "Build a voice-controlled command interface with real-time speech recognition"
    ]
  },
  "AssemblyAI": {
    usage: "AssemblyAI provides speech-to-text with advanced features like sentiment analysis, topic detection, PII redaction, and auto-chapters. Known for accuracy and developer-friendly APIs. Access at assemblyai.com. Supports real-time streaming and batch transcription.",
    code: `# Install:\npip install assemblyai\n\nimport assemblyai as aai\n\naai.settings.api_key = "YOUR_API_KEY"\ntranscriber = aai.Transcriber()\n\ntranscript = transcriber.transcribe(\n    "audio.mp3",\n    config=aai.TranscriptionConfig(\n        speaker_labels=True, auto_chapters=True,\n        sentiment_analysis=True, entity_detection=True,\n        auto_punctuation=True,\n        word_boost=["AI", "machine learning", "neural network"],\n        boost_param="high"\n    )\n)\nprint(transcript.text)\n\n# Auto-generated chapters:\nfor chapter in transcript.chapters:\n    print(f"[{chapter.start}ms - {chapter.end}ms] {chapter.summary}")\n\n# LeMUR framework (LLM processing of transcripts):\nresult = transcript.lemur.summarize(\n    final_model=aai.LemurModel.claude3_5_sonnet\n)\nprint(result.response)`,
    projects: [
      "Build an automated meeting minutes system with action items and sentiment tracking",
      "Create a content indexing platform that tags and categorizes audio/video content",
      "Build a compliance monitoring tool that detects PII in audio recordings"
    ]
  },
  "Bark": {
    usage: "Bark is an open-source text-to-audio model by Suno that generates speech, music, and sound effects. It can generate laughter, sighs, background music, and non-verbal sounds. Run locally with pip install bark. Available in multiple languages.",
    code: `# Install Bark:\npip install bark\n\nfrom bark import SAMPLE_RATE, generate_audio, preload_models\nimport scipy.io.wavfile as wavfile\n\npreload_models()\n\n# Generate speech:\naudio_array = generate_audio(\n    "Hello! This is a test. [laughs] Pretty cool, right?"\n)\nwavfile.write("output.wav", SAMPLE_RATE, audio_array)\n\n# Non-verbal sounds:\n# [laughs]    [sighs]    [gasps]    [clears throat]\n\n# Voice control:\naudio = generate_audio(\n    "Bonjour, comment allez-vous?",\n    history_prompt="fr_2"  # French female voice\n)\n\n# Available voice presets: en_0..en_6, de_0, es_0, fr_0, hi_0, it_0, ja_0, ko_0, pl_0, pt_0, ru_0, tr_0\n\n# Reproducible:\naudio = generate_audio("Hello world!", seed=42)`,
    projects: [
      "Build a podcast generator that creates episodes with natural speech and background music",
      "Create an audiobook system with character voices and emotional narration",
      "Build a sound effects generator for game development using text descriptions"
    ]
  },
  "Murf AI": {
    usage: "Murf AI provides natural-sounding voice generation for videos, podcasts, and e-learning. Access at murf.ai. Offers 120+ AI voices in 20+ languages. Features include voice cloning, pitch/speed controls, and emphasis markers. Used extensively for corporate training and explainer videos.",
    code: `# Access Murf at murf.ai (web-based studio)\n\n# Quick voice generation:\n# 1. Open Murf Studio\n# 2. Create new project\n# 3. Paste or type script\n# 4. Select voice actor and language\n# 5. Click "Generate" -> Preview -> Download\n\n# API access:\nimport requests\n\nAPI_URL = "https://api.murf.ai/v1/text-to-speech/generate"\nheaders = {"api-key": "YOUR_API_KEY", "Content-Type": "application/json"}\n\nresponse = requests.post(API_URL, json={\n    "text": "Welcome to our quarterly business review.",\n    "voiceId": "en-US-Jenny",\n    "speed": 100,\n    "pitch": 0,\n    "format": "mp3",\n    "sampleRate": "44100"\n})\naudio_url = response.json()["audioFile"]\n\n# Supported languages:\n# English (US, UK, AU), Spanish, French, German, Italian,\n# Portuguese, Japanese, Korean, Chinese, Hindi, Arabic, Russian, Dutch`,
    projects: [
      "Create a multilingual e-learning course with consistent voice across modules",
      "Build an automated customer onboarding video voiceover system",
      "Generate podcast intros and outros with a consistent brand voice"
    ]
  },
  "Play.ht": {
    usage: "Play.ht generates ultra-realistic AI voices for content creation. Access at play.ht. Features include voice cloning, real-time streaming, pronunciation control, and emotional inflection. Supports 140+ languages with 900+ voices. Used for podcasts, audiobooks, e-learning, and voiceovers.",
    code: `# Install Play.ht SDK:\npip install playht\n\nimport playht\n\nplayht.api_key = "YOUR_API_KEY"\nplayht.user_id = "YOUR_USER_ID"\n\n# Generate speech:\nheaders, audio_url = playht.convert(\n    text="This is a demonstration of Play.ht's ultra-realistic voice synthesis.",\n    voice="larry"\n)\n\n# Streaming:\ndef text_stream():\n    yield "Hello world. "\n    yield "This is streamed text. "\n\naudio_stream = playht.stream(\n    text_stream(), voice="larry",\n    options={"syntax": "ssml"}\n)\n\n# SSML for precise control:\nssml = """\n<speak>\n  <prosody rate="slow" pitch="+10%">\n    This is emphasized text.\n  </prosody>\n  <break time="500ms"/>\n  And this comes after a pause.\n</speak>\n"""`,
    projects: [
      "Build a voice cloning platform for content creators to scale their narration",
      "Create a real-time voice assistant with natural-sounding responses",
      "Generate audiobooks with SSML-controlled pacing and emphasis"
    ]
  },
  "Azure AI Speech": {
    usage: "Azure AI Speech provides enterprise-grade text-to-speech, speech-to-text, and speech translation. Features 400+ neural voices across 140+ languages, custom neural voice creation, real-time translation, and conversation transcription. Part of Microsoft Azure's cognitive services.",
    code: `# Install Azure Speech SDK:\npip install azure-cognitiveservices-speech\n\nimport azure.cognitiveservices.speech as speechsdk\n\nspeech_config = speechsdk.SpeechConfig(\n    subscription="YOUR_AZURE_KEY", region="eastus"\n)\nspeech_config.speech_synthesis_voice_name = "en-US-AriaNeural"\n\n# Text-to-Speech:\naudio_config = speechsdk.audio.AudioOutputConfig(filename="output.wav")\nsynthesizer = speechsdk.SpeechSynthesizer(\n    speech_config=speech_config, audio_config=audio_config\n)\nresult = synthesizer.speak_text_async("Hello, welcome to Azure Speech Services.").get()\n\n# SSML:\nssml = """\n<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis'>\n  <voice name='en-US-JennyNeural'>\n    <prosody pitch='+10%' rate='0.8'>\n      Welcome to the <emphasis level='strong'>future</emphasis> of speech.\n    </prosody>\n  </voice>\n</speak>\n"""\nsynthesizer.speak_ssml_async(ssml).get()\n\n# Speech-to-Text:\nspeech_recognizer = speechsdk.SpeechRecognizer(\n    speech_config=speech_config,\n    audio_config=speechsdk.audio.AudioConfig(filename="audio.wav")\n)\nresult = speech_recognizer.recognize_once()\nprint(result.text)`,
    projects: [
      "Build an enterprise multilingual voice assistant with custom neural voice",
      "Create a real-time meeting translation system across multiple languages",
      "Build an accessibility tool with voice-controlled navigation for web applications"
    ]
  },
  "Google Cloud TTS": {
    usage: "Google Cloud Text-to-Speech provides WaveNet, Neural2, and Journey voices for natural-sounding speech. Supports 40+ languages with 300+ voices. Features SSML support, custom voice profiles, and multi-speaker generation. Part of Google Cloud Platform.",
    code: `# Install:\npip install google-cloud-texttospeech\n\nfrom google.cloud import texttospeech\n\nclient = texttospeech.TextToSpeechClient()\n\ninput_text = texttospeech.SynthesisInput(text="Hello, this is Google Cloud Text-to-Speech.")\n\nvoice = texttospeech.VoiceSelectionParams(\n    language_code="en-US",\n    name="en-US-Neural2-F",\n    ssml_gender=texttospeech.SsmlVoiceGender.FEMALE\n)\n\naudio_config = texttospeech.AudioConfig(\n    audio_encoding=texttospeech.AudioEncoding.MP3,\n    sample_rate_hertz=24000,\n    effects_profile_id=["headphone-class-device"]\n)\n\nresponse = client.synthesize_speech(\n    input=input_text, voice=voice, audio_config=audio_config\n)\n\nwith open("output.mp3", "wb") as out:\n    out.write(response.audio_content)\n\n# List available voices:\nvoices = client.list_voices(language_code="en")\nfor v in voices.voices:\n    print(f"{v.name} ({v.ssml_gender}) - {v.natural_sample_rate_hz}Hz")`,
    projects: [
      "Build a multilingual customer service IVR system with natural voice prompts",
      "Create an audio content platform that converts articles to podcast-style episodes",
      "Build a language learning app with native-sounding pronunciation examples"
    ]
  },
  "Amazon Polly": {
    usage: "Amazon Polly provides neural text-to-speech with 60+ voices across 30+ languages. Features Neural and Standard engine types, SSML support, Speech Marks for lip sync, and Streaming Speech synthesis. Part of AWS. Offers a free tier with 5 million characters per month for 12 months.",
    code: `# Install AWS SDK:\npip install boto3\n\nimport boto3\n\npolly = boto3.client('polly', region_name='us-east-1')\n\n# Basic text-to-speech:\nresponse = polly.synthesize_speech(\n    Text="Hello from Amazon Polly! This is neural text to speech.",\n    OutputFormat="mp3", VoiceId="Joanna", Engine="neural"\n)\n\nwith open("output.mp3", "wb") as f:\n    f.write(response["AudioStream"].read())\n\n# SSML:\nssml = """\n<speak>\n  <prosody rate="90%" pitch="+5%">\n    This is a <emphasis level="strong">premium</emphasis> experience.\n  </prosody>\n  <break time="1s"/>\n  <amazon:effect name="whispered">This part is whispered.</amazon:effect>\n</speak>\n"""\n\nresponse = polly.synthesize_speech(\n    Text=ssml, TextType="ssml", OutputFormat="mp3",\n    VoiceId="Matthew", Engine="neural"\n)\n\n# Speech marks for lip sync:\nresponse = polly.synthesize_speech(\n    Text="Hello world, this is Polly speaking.",\n    OutputFormat="json",\n    SpeechMarkTypes=["sentence", "word", "viseme"],\n    VoiceId="Joanna", Engine="neural"\n)`,
    projects: [
      "Build an accessibility tool that reads web pages aloud with natural voices",
      "Create a podcast generation system from text articles",
      "Build a voice notification service using Polly streaming"
    ]
  },
  "Otter.ai": {
    usage: "Otter.ai provides AI-powered meeting transcription and notes. It automatically joins Zoom, Google Meet, and Microsoft Teams meetings to transcribe, summarize, and extract action items. Access at otter.ai. Features include speaker identification, live transcription, automated summaries, and searchable transcripts. Free tier includes 300 monthly transcription minutes.",
    code: `# Otter.ai is a web and mobile application\n\n# Automatic meeting transcription:\n# 1. Connect your calendar (Google, Outlook)\n# 2. Otter joins meetings automatically\n# 3. Real-time transcription with speaker labels\n# 4. Post-meeting AI summary with action items\n\n# API access (Enterprise):\n# GET /api/v1/meetings          -- List meetings\n# GET /api/v1/meetings/{id}/transcript -- Get transcript\n# GET /api/v1/meetings/{id}/summary    -- Get AI summary\n\n# Manual upload:\n# Upload any audio/video file for transcription\n# Supports MP3, M4A, WAV, MP4\n\n# Collaboration:\n# - Add comments on transcript sections\n# - Tag people with @mentions\n# - Share meeting notes\n# - Create follow-up tasks\n# - Search across all meetings`,
    projects: [
      "Build an automated meeting minutes system with summaries and action items",
      "Create a searchable knowledge base from meeting transcripts",
      "Build a compliance monitoring tool that flags discussion of regulated topics"
    ]
  },
  "Adobe Podcast": {
    usage: "Adobe Podcast provides AI audio enhancement tools accessible through the web. The main feature, Enhance Speech, removes noise, echo, and room reverberation from recordings to make them sound studio-quality. Also offers mic check, project editing, and text-based audio editing. Access at podcast.adobe.com.",
    code: `# Access Adobe Podcast at podcast.adobe.com\n\n# Enhance Speech workflow:\n# 1. Upload audio file (drag and drop)\n# 2. AI processes and enhances quality\n# 3. Download enhanced audio\n\n# Supported formats: WAV, MP3, M4A, OGG, FLAC\n# Up to 1 hour per file (free tier)\n\n# Mic Check tool:\n# Tests your microphone setup\n# Provides recommendations for:\n# - Microphone distance\n# - Room acoustics\n# - Background noise levels\n# - Audio quality score\n\n# Text-based editing:\n# Upload audio -> AI generates transcript\n# Edit text to edit audio (delete words, rearrange)\n\n# Before/After:\n# Raw recording: Noisy room, echo, background hum\n# After enhancement: Studio-quality, clear, professional`,
    projects: [
      "Build a podcast post-production pipeline that auto-enhances and transcribes episodes",
      "Create a remote interview tool with real-time audio enhancement for each participant",
      "Build an archive digitization system that cleans up old recordings"
    ]
  },
  "Coqui TTS": {
    usage: "Coqui TTS is an open-source text-to-speech library with XTTS, a state-of-the-art multilingual model. It supports voice cloning from short audio samples, runs locally, and generates high-quality speech in 17 languages. Install via pip and use as a Python library or command-line tool.",
    code: `# Install:\npip install TTS\n\n# List available models:\ntts --list_models\n\n# Generate speech with XTTS v2:\ntts --text "This is an example of Coqui TTS with voice cloning." \\\n    --model_name tts_models/multilingual/multi-dataset/xtts_v2 \\\n    --out_path output.wav\n\n# Voice cloning:\ntts --text "Hello, this is my cloned voice." \\\n    --model_name tts_models/multilingual/multi-dataset/xtts_v2 \\\n    --speaker_wav reference.wav --out_path cloned.wav\n\n# Python API:\nfrom TTS.api import TTS\n\ntts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")\n\ntts.tts_to_file(\n    text="Welcome to our AI-powered voice synthesis platform.",\n    file_path="output.wav",\n    language="en"  # en, es, fr, de, it, pt, pl, tr, ru, nl, cs, ar, zh, ja, hu, ko, hi\n)\n\n# Voice cloning from reference:\ntts.tts_to_file(\n    text="This is spoken in the cloned voice.",\n    file_path="cloned.wav",\n    speaker_wav="reference_speaker.wav",\n    language="en"\n)`,
    projects: [
      "Build a local voice cloning tool for privacy-sensitive applications",
      "Create a multilingual content narration system without cloud API costs",
      "Build an accessibility tool that generates speech in the user's own voice"
    ]
  },
