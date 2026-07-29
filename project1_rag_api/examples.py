#!/usr/bin/env python3
"""API Usage Examples for Project 1: Simple RAG API"""
import httpx
import asyncio

BASE_URL = "http://localhost:8000"


async def main():
    async with httpx.AsyncClient() as client:

        # 1. Health check
        print("1. Health Check")
        resp = await client.get(f"{BASE_URL}/api/v1/health")
        print(f"   Status: {resp.json()['status']}\n")

        # 2. Simple chat (no RAG)
        print("2. Simple Chat (no RAG)")
        resp = await client.post(
            f"{BASE_URL}/api/v1/chat",
            json={"message": "What is machine learning?", "use_rag": False},
        )
        print(f"   Response: {resp.json()['response'][:100]}...\n")

        # 3. Upload a document
        print("3. Upload Document")
        with open("example.txt", "w") as f:
            f.write("Machine learning is a subset of artificial intelligence.\n" * 10)
        with open("example.txt", "rb") as f:
            resp = await client.post(
                f"{BASE_URL}/api/v1/documents/upload",
                files={"file": ("example.txt", f, "text/plain")},
            )
        doc_id = resp.json()["document_id"]
        print(f"   Uploaded: {doc_id}, Chunks: {resp.json()['chunks']}\n")

        # 4. Chat with RAG
        print("4. Chat with RAG")
        resp = await client.post(
            f"{BASE_URL}/api/v1/chat",
            json={"message": "What is machine learning?", "use_rag": True},
        )
        print(f"   Response: {resp.json()['response'][:100]}...")
        print(f"   Sources: {len(resp.json()['sources'])} documents\n")

        # 5. Stream chat
        print("5. Stream Chat")
        async with client.stream(
            "POST",
            f"{BASE_URL}/api/v1/chat/stream",
            json={"message": "Explain deep learning", "use_rag": False},
        ) as resp:
            async for line in resp.aiter_lines():
                if line.startswith("data: ") and line != "data: [DONE]":
                    print(line[6:], end="", flush=True)
        print("\n")

        # 6. Run agent
        print("6. Run Agent")
        resp = await client.post(
            f"{BASE_URL}/api/v1/agent/run",
            json={"message": "Calculate 2+2 and search for related docs"},
        )
        print(f"   Response: {resp.json()['response'][:100]}...")
        print(f"   Tools used: {resp.json()['tools_used']}\n")

        # 7. Metrics
        print("7. Metrics")
        resp = await client.get(f"{BASE_URL}/api/v1/metrics")
        print(f"   Requests: {resp.json()['total_requests']}")
        print(f"   Uptime: {resp.json()['uptime_seconds']}s\n")

        # Cleanup
        import os
        os.remove("example.txt")


if __name__ == "__main__":
    asyncio.run(main())
