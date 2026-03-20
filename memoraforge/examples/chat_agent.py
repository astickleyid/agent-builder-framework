"""
Interactive Chat Agent — talk to an AI with permanent memory.
Everything you say is stored and recalled in future conversations.

Run:  python3 chat_agent.py
Requires: pip3 install httpx
"""

import asyncio
import httpx

ACP_URL = "http://localhost:8300"
MEMORY_URL = "http://localhost:8200"
API_URL = "http://localhost:8000"
AGENT_ID = "chat-agent"


async def main():
    async with httpx.AsyncClient(timeout=120.0) as client:
        # Register
        await client.post(f"{ACP_URL}/rpc", json={
            "jsonrpc": "2.0",
            "method": "agent.register",
            "params": {
                "agent_id": AGENT_ID,
                "agent_name": "Chat Agent",
                "capabilities": ["memory_claw", "memory_store"],
            },
            "id": 1,
        })

        print("\n🦀 MemoraForge Chat Agent")
        print("   Everything you say is remembered permanently.")
        print("   Commands: 'quit' to exit, 'memories' for stats\n")

        conversation = []

        while True:
            user_input = input("You: ").strip()
            if not user_input:
                continue
            if user_input.lower() == "quit":
                break
            if user_input.lower() == "memories":
                resp = await client.get(f"{MEMORY_URL}/stats")
                stats = resp.json()
                print(f"\n📊 {stats['total_memories']} memories, {stats['total_tokens']} tokens\n")
                continue

            # Store what user said
            await client.post(f"{MEMORY_URL}/ingest/store", json={
                "agent_id": AGENT_ID,
                "content": f"User said: {user_input}",
                "memory_type": "conversation",
                "auto_summarize": False,
            })

            # Claw relevant memories
            resp = await client.post(f"{MEMORY_URL}/retrieve/claw", json={
                "query": user_input,
                "agent_id": AGENT_ID,
                "top_k": 10,
                "max_tokens": 10000,
            })
            memories = resp.json().get("results", [])
            context = "\n".join(m["content"] for m in memories) if memories else ""

            # Build prompt with memory + recent conversation
            messages = [{"role": "system", "content": (
                "You are a helpful assistant with perfect long-term memory. "
                "You remember everything the user has ever told you.\n\n"
                f"Your memories:\n{context}" if context else
                "You are a helpful assistant. This is the start of a new relationship."
            )}]
            messages.extend(conversation[-20:])
            messages.append({"role": "user", "content": user_input})

            # Generate response
            try:
                resp = await client.post(f"{API_URL}/v1/chat", json={
                    "model": "llama3.1:8b",
                    "messages": messages,
                    "max_tokens": 1000,
                })
                answer = resp.json()["choices"][0]["message"]["content"]
            except Exception as e:
                answer = f"(AI unavailable — is Ollama running? Error: {e})"

            print(f"\nAgent: {answer}\n")

            # Update conversation history
            conversation.append({"role": "user", "content": user_input})
            conversation.append({"role": "assistant", "content": answer})

            # Store the exchange
            await client.post(f"{MEMORY_URL}/ingest/store", json={
                "agent_id": AGENT_ID,
                "content": f"Q: {user_input}\nA: {answer}",
                "memory_type": "conversation",
                "auto_summarize": False,
            })

    print("\n👋 Goodbye! Memories saved for next time.\n")

asyncio.run(main())
