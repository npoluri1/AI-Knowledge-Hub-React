#!/usr/bin/env python3
"""Quickstart script for Project 1: Simple RAG API"""
import subprocess
import sys
import os


def main():
    print("=" * 60)
    print("Project 1: Simple RAG API — Quickstart")
    print("=" * 60)

    # Check Python version
    if sys.version_info < (3, 10):
        print("Error: Python 3.10+ required")
        sys.exit(1)

    # Install dependencies
    print("\n1. Installing dependencies...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)

    # Copy .env if not exists
    if not os.path.exists(".env"):
        print("\n2. Creating .env from template...")
        subprocess.run(["cp", ".env.example", ".env"], shell=True)
        print("   Edit .env to configure your LLM provider")

    # Start the server
    print("\n3. Starting server...")
    print("   API docs: http://localhost:8000/docs")
    print("   Health: http://localhost:8000/api/v1/health")
    print("   Press Ctrl+C to stop\n")

    subprocess.run([
        sys.executable, "-m", "uvicorn", "app.main:app",
        "--host", "0.0.0.0", "--port", "8000", "--reload"
    ])


if __name__ == "__main__":
    main()
