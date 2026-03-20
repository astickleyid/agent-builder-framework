"""
My First MemoraForge Agent
--------------------------
Store memories, search them, and chat with an AI that remembers everything.

Run:  python3 my_first_agent.py
Requires: pip3 install httpx
"""

import asyncio
import httpx

ACP_URL = "http://localhost:8300"
MEMORY_URL = "http://localhost:8200"
API_URL = "http://localhost:8000"


async def main():
    async with httpx.AsyncClient(timeout=120.0) as client:

        # ── Register the agent ──────────────────────────────────
        print("\n📝 Registering agent...")
        await client.post(f"{ACP_URL}/rpc", json={
            "jsonrpc": "2.0",
            "method": "agent.register",
            "params": {
                "agent_id": "my-first-agent",
                "agent_name": "My First Agent",
                "capabilities": ["memory_claw", "memory_store"],
            },
            "id": 1,
        })
        print("   Done!\n")

        # ── Store some facts ────────────────────────────────────
        facts = [
            "My name is Alex and I live in Portland, Oregon.",
            "I'm building a mobile app for tracking hiking trails.",
            "My favorite programming language is Python.",
            "The project deadline is March 30, 2026.",
            "My co-founder is Jamie, who handles the design work.",
        ]

        print("💾 Storing memories...")
        for fact in facts:
            await client.post(f"{MEMORY_URL}/ingest/store", json={
                "agent_id": "my-first-agent",
                "content": fact,
                "memory_type": "fact",
                "auto_summarize": False,
            })
            print(f"   ✓ {fact[:60]}")
        print()

        # ── Search memories ─────────────────────────────────────
        print("🦀 Clawing memories...\n")
        questions = [
            "What am I building?",
            "Who is on my team?",
            "Where do I live?",
        ]

        for question in questions:
            resp = await client.post(f"{MEMORY_URL}/retrieve/claw", json={
                "query": question,
                "agent_id": "my-first-agent",
                "top_k": 3,
                "max_tokens": 5000,
            })
            data = resp.json()
            print(f"   Q: {question}")
            print(f"   Found {data['total_results']} results in {data['retrieval_ms']:.0f}ms")
            for r in data["results"][:2]:
                print(f"      → {r['content'][:80]}")
            print()

        # ── Chat with memory context ───────────────────────────
        print("🤖 Asking AI with memory context...\n")

        resp = await client.post(f"{MEMORY_URL}/retrieve/claw", json={
            "query": "Tell me about my project and team",
            "agent_id": "my-first-agent",
            "top_k": 5,
            "max_tokens": 10000,
        })
        context = "\n".join(m["content"] for m in resp.json()["results"])

        resp = await client.post(f"{API_URL}/v1/chat", json={
            "model": "llama3.1:8b",
            "messages": [
                {"role": "system", "content": f"You know this about the user:\n\n{context}"},
                {"role": "user", "content": "Give me a quick project status summary."},
            ],
            "max_tokens": 500,
        })
        print(f"   {resp.json()['choices'][0]['message']['content']}\n")

        # ── Stats ───────────────────────────────────────────────
        stats = (await client.get(f"{MEMORY_URL}/stats")).json()
        print(f"📊 Hub: {stats['total_memories']} memories, {stats['total_tokens']} tokens\n")

    print("✅ Done! Memories persist — restart and they're still there.\n")


asyncio.run(main())
