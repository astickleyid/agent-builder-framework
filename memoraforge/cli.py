#!/usr/bin/env python3
"""MemoraForge CLI — the single entry point for consumers.

Install:  pip install memoraforge
Usage:    memoraforge start        # spins up everything
          memoraforge status       # check service health
          memoraforge agent create # create a new agent
          memoraforge memory stats # see memory usage
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import subprocess
import sys
import time
from pathlib import Path

BANNER = """
  ╔══════════════════════════════════════════════════════════════╗
  ║         🦀  M E M O R A F O R G E  v0.1.0  🦀             ║
  ║                                                              ║
  ║   AI Agents That Never Forget — 5M+ Token Memory            ║
  ╚══════════════════════════════════════════════════════════════╝
"""

SERVICES = {
    "API Server":  {"url": "http://localhost:8000/health", "port": 8000},
    "MCP Server":  {"url": "http://localhost:8100/health", "port": 8100},
    "Memory Hub":  {"url": "http://localhost:8200/health", "port": 8200},
    "ACP Handler": {"url": "http://localhost:8300/health", "port": 8300},
}


def main():
    parser = argparse.ArgumentParser(
        prog="memoraforge",
        description="MemoraForge — AI Agent Platform with Infinite Memory",
    )
    sub = parser.add_subparsers(dest="command")

    # ── start ────────────────────────────────────────────────────
    start_p = sub.add_parser("start", help="Start all MemoraForge services")
    start_p.add_argument("--detach", "-d", action="store_true", default=True,
                         help="Run in background (default)")
    start_p.add_argument("--gpu", action="store_true", help="Enable GPU for LLM inference")
    start_p.add_argument("--model", default="llama3.1:8b", help="Default model to pull")

    # ── stop ─────────────────────────────────────────────────────
    sub.add_parser("stop", help="Stop all services")

    # ── status ───────────────────────────────────────────────────
    sub.add_parser("status", help="Check service health")

    # ── logs ─────────────────────────────────────────────────────
    logs_p = sub.add_parser("logs", help="View service logs")
    logs_p.add_argument("service", nargs="?", default="", help="Specific service")
    logs_p.add_argument("--follow", "-f", action="store_true", help="Follow log output")

    # ── agent ────────────────────────────────────────────────────
    agent_p = sub.add_parser("agent", help="Manage agents")
    agent_sub = agent_p.add_subparsers(dest="agent_cmd")

    create_p = agent_sub.add_parser("create", help="Register a new agent")
    create_p.add_argument("name", help="Agent name")
    create_p.add_argument("--model", default="llama3.1:8b")
    create_p.add_argument("--capabilities", nargs="+", default=["memory_claw", "memory_store"])

    agent_sub.add_parser("list", help="List registered agents")

    chat_p = agent_sub.add_parser("chat", help="Interactive chat with an agent")
    chat_p.add_argument("agent_id", help="Agent ID to chat with")

    # ── memory ───────────────────────────────────────────────────
    mem_p = sub.add_parser("memory", help="Memory Hub operations")
    mem_sub = mem_p.add_subparsers(dest="mem_cmd")

    mem_sub.add_parser("stats", help="Show memory statistics")

    store_p = mem_sub.add_parser("store", help="Store a memory")
    store_p.add_argument("content", help="Content to store")
    store_p.add_argument("--agent", default="cli-agent")
    store_p.add_argument("--type", default="fact", choices=["fact", "conversation", "code", "document"])

    search_p = mem_sub.add_parser("search", help="Search memories")
    search_p.add_argument("query", help="Search query")
    search_p.add_argument("--top-k", type=int, default=10)

    mem_sub.add_parser("evict", help="Run memory eviction")

    # ── ui ───────────────────────────────────────────────────────
    sub.add_parser("ui", help="Open the Visual Builder UI")

    # ── init ─────────────────────────────────────────────────────
    sub.add_parser("init", help="Initialize MemoraForge in the current directory")

    # ── version ──────────────────────────────────────────────────
    sub.add_parser("version", help="Show version")

    args = parser.parse_args()

    if not args.command:
        print(BANNER)
        parser.print_help()
        return

    commands = {
        "start": cmd_start,
        "stop": cmd_stop,
        "status": cmd_status,
        "logs": cmd_logs,
        "agent": cmd_agent,
        "memory": cmd_memory,
        "ui": cmd_ui,
        "init": cmd_init,
        "version": cmd_version,
    }

    handler = commands.get(args.command)
    if handler:
        handler(args)
    else:
        parser.print_help()


# ═══════════════════════════════════════════════════════════════════
# Command handlers
# ═══════════════════════════════════════════════════════════════════


def cmd_start(args):
    """Start all MemoraForge services."""
    print(BANNER)
    compose_dir = _find_compose_dir()

    print("  Starting services...\n")

    # Start Docker Compose
    result = subprocess.run(
        ["docker", "compose", "up", "-d"],
        cwd=compose_dir,
        capture_output=True, text=True,
    )

    if result.returncode != 0:
        print(f"  ❌ Failed to start: {result.stderr}")
        print("\n  Make sure Docker Desktop is running.")
        sys.exit(1)

    print("  ⏳ Waiting for services to be ready...")
    _wait_for_services(timeout=60)

    # Pull model if needed
    if args.model:
        print(f"\n  📦 Ensuring model '{args.model}' is available...")
        subprocess.run(
            ["docker", "compose", "exec", "-T", "ollama", "ollama", "pull", args.model],
            cwd=compose_dir,
            capture_output=True,
        )
        print(f"  ✅ Model '{args.model}' ready")

    print("\n  🦀 MemoraForge is running!\n")
    print("  Services:")
    print("    API Server:   http://localhost:8000")
    print("    MCP Server:   http://localhost:8100")
    print("    Memory Hub:   http://localhost:8200")
    print("    ACP Handler:  http://localhost:8300")
    print("\n  Next steps:")
    print("    memoraforge status          # check health")
    print("    memoraforge agent create    # register an agent")
    print("    memoraforge ui              # open visual builder")
    print()


def cmd_stop(args):
    """Stop all services."""
    compose_dir = _find_compose_dir()
    print("  Stopping MemoraForge...")
    subprocess.run(["docker", "compose", "down"], cwd=compose_dir)
    print("  ✅ Stopped. Data is preserved. Run 'memoraforge start' to resume.")


def cmd_status(args):
    """Check service health."""
    import urllib.request

    print("\n  MemoraForge Service Status\n")
    print(f"  {'Service':<16} {'Status':<12} {'Latency':<10} {'Details'}")
    print(f"  {'─'*16} {'─'*12} {'─'*10} {'─'*30}")

    all_healthy = True
    for name, info in SERVICES.items():
        start = time.time()
        try:
            req = urllib.request.Request(info["url"], method="GET")
            with urllib.request.urlopen(req, timeout=5) as resp:
                data = json.loads(resp.read())
                latency = (time.time() - start) * 1000
                status = "✅ healthy" if data.get("status") == "healthy" else "⚠️ degraded"
                detail = ""
                if "registered_agents" in data:
                    detail = f"{data['registered_agents']} agents"
                elif "streams" in data:
                    detail = f"{data['streams']} streams"
        except Exception:
            latency = (time.time() - start) * 1000
            status = "❌ down"
            detail = "not reachable"
            all_healthy = False

        print(f"  {name:<16} {status:<12} {latency:>6.0f}ms   {detail}")

    print()
    if all_healthy:
        print("  All services healthy. ✅\n")
    else:
        print("  Some services are down. Run: memoraforge start\n")


def cmd_logs(args):
    """View service logs."""
    compose_dir = _find_compose_dir()
    cmd = ["docker", "compose", "logs"]
    if args.follow:
        cmd.append("-f")
    if args.service:
        cmd.append(args.service)
    subprocess.run(cmd, cwd=compose_dir)


def cmd_agent(args):
    """Agent management commands."""
    if args.agent_cmd == "create":
        asyncio.run(_agent_create(args))
    elif args.agent_cmd == "list":
        asyncio.run(_agent_list())
    elif args.agent_cmd == "chat":
        asyncio.run(_agent_chat(args))
    else:
        print("  Usage: memoraforge agent {create|list|chat}")


async def _agent_create(args):
    import httpx
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.post("http://localhost:8300/rpc", json={
            "jsonrpc": "2.0",
            "method": "agent.register",
            "params": {
                "agent_id": args.name.lower().replace(" ", "-"),
                "agent_name": args.name,
                "capabilities": args.capabilities,
            },
            "id": 1,
        })
        result = resp.json()
        if "result" in result:
            r = result["result"]
            print(f"\n  ✅ Agent created!")
            print(f"     ID:      {r['agent_id']}")
            print(f"     Stream:  {r['assigned_stream_id']}")
            print(f"     Token:   {r['session_token'][:20]}...")
            print(f"\n  Next: memoraforge agent chat {r['agent_id']}\n")
        else:
            print(f"\n  ❌ Error: {result.get('error', {}).get('message', 'Unknown')}\n")


async def _agent_list():
    import httpx
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get("http://localhost:8300/agents")
        agents = resp.json().get("agents", [])

    if not agents:
        print("\n  No agents registered. Create one: memoraforge agent create MyAgent\n")
        return

    print(f"\n  {'Agent ID':<24} {'Name':<20} {'Status':<10} {'Connected'}")
    print(f"  {'─'*24} {'─'*20} {'─'*10} {'─'*10}")
    for a in agents:
        connected = "●" if a.get("connected") else "○"
        print(f"  {a['agent_id']:<24} {a['agent_name']:<20} {a['status']:<10} {connected}")
    print()


async def _agent_chat(args):
    import httpx

    print(f"\n  🦀 Chatting with agent: {args.agent_id}")
    print("     Type 'quit' to exit\n")

    async with httpx.AsyncClient(timeout=120) as client:
        conversation = []

        while True:
            try:
                user_input = input("  You: ").strip()
            except (EOFError, KeyboardInterrupt):
                break

            if not user_input:
                continue
            if user_input.lower() == "quit":
                break

            # Claw memories
            try:
                resp = await client.post("http://localhost:8200/retrieve/claw", json={
                    "query": user_input, "agent_id": args.agent_id,
                    "top_k": 10, "max_tokens": 10000,
                })
                memories = resp.json().get("results", [])
                context = "\n".join(m["content"] for m in memories) if memories else ""
            except Exception:
                context = ""

            messages = [{"role": "system", "content": (
                f"You are agent {args.agent_id}. You have persistent memory.\n\n"
                f"Relevant memories:\n{context}" if context else
                f"You are agent {args.agent_id}."
            )}]
            messages.extend(conversation[-20:])
            messages.append({"role": "user", "content": user_input})

            try:
                resp = await client.post("http://localhost:8000/v1/chat", json={
                    "model": "llama3.1:8b", "messages": messages, "max_tokens": 1000,
                })
                answer = resp.json()["choices"][0]["message"]["content"]
            except Exception as e:
                answer = f"(Error: {e})"

            print(f"\n  Agent: {answer}\n")
            conversation.extend([
                {"role": "user", "content": user_input},
                {"role": "assistant", "content": answer},
            ])

            # Store exchange
            try:
                await client.post("http://localhost:8200/ingest/store", json={
                    "agent_id": args.agent_id,
                    "content": f"Q: {user_input}\nA: {answer}",
                    "memory_type": "conversation", "auto_summarize": False,
                })
            except Exception:
                pass

    print("\n  👋 Chat ended. Memories saved.\n")


def cmd_memory(args):
    """Memory Hub commands."""
    if args.mem_cmd == "stats":
        asyncio.run(_memory_stats())
    elif args.mem_cmd == "store":
        asyncio.run(_memory_store(args))
    elif args.mem_cmd == "search":
        asyncio.run(_memory_search(args))
    elif args.mem_cmd == "evict":
        asyncio.run(_memory_evict())
    else:
        print("  Usage: memoraforge memory {stats|store|search|evict}")


async def _memory_stats():
    import httpx
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get("http://localhost:8200/stats")
        stats = resp.json()

    print("\n  📊 Memory Hub Statistics\n")
    print(f"     Total memories:  {stats.get('total_memories', 0)}")
    print(f"     Total tokens:    {stats.get('total_tokens', 0):,}")
    print(f"     Total chunks:    {stats.get('total_chunks', 0)}")
    types = stats.get("type_breakdown", {})
    if types:
        print(f"     By type:         {json.dumps(types)}")
    print()


async def _memory_store(args):
    import httpx
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.post("http://localhost:8200/ingest/store", json={
            "agent_id": args.agent, "content": args.content,
            "memory_type": args.type, "auto_summarize": False,
        })
        data = resp.json()
    print(f"\n  ✅ Stored: {data['memory_id']} ({data['tokens_stored']} tokens)\n")


async def _memory_search(args):
    import httpx
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.post("http://localhost:8200/retrieve/claw", json={
            "query": args.query, "top_k": args.top_k, "max_tokens": 50000,
        })
        data = resp.json()

    print(f"\n  🔍 Found {data['total_results']} results in {data['retrieval_ms']:.0f}ms\n")
    for r in data["results"]:
        score = r.get("relevance_score", 0)
        content = r.get("content", "")[:100]
        print(f"     [{score:.2f}] {content}")
    print()


async def _memory_evict():
    import httpx
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.post("http://localhost:8200/evict")
        data = resp.json()
    print(f"\n  🗑️  Evicted {data['evicted']} memories. {data['remaining_memories']} remaining.\n")


def cmd_ui(args):
    """Open the Visual Builder UI."""
    ui_dir = _find_memoraforge_dir() / "ui"
    if not (ui_dir / "package.json").exists():
        print("  Visual Builder UI not found.")
        return

    print("  Starting Visual Builder UI on http://localhost:3000 ...")
    try:
        subprocess.run(["npm", "run", "dev"], cwd=ui_dir)
    except FileNotFoundError:
        print("  npm not found. Install Node.js first: https://nodejs.org")
    except KeyboardInterrupt:
        print("\n  UI stopped.")


def cmd_init(args):
    """Initialize MemoraForge in the current directory."""
    print(BANNER)
    cwd = Path.cwd()

    # Check Docker
    try:
        subprocess.run(["docker", "--version"], capture_output=True, check=True)
        print("  ✅ Docker found")
    except (FileNotFoundError, subprocess.CalledProcessError):
        print("  ❌ Docker not found. Install: https://docker.com/get-started")
        sys.exit(1)

    # Check docker compose
    try:
        subprocess.run(["docker", "compose", "version"], capture_output=True, check=True)
        print("  ✅ Docker Compose found")
    except (FileNotFoundError, subprocess.CalledProcessError):
        print("  ❌ Docker Compose not found")
        sys.exit(1)

    print(f"\n  MemoraForge initialized in: {cwd}")
    print("\n  Run: memoraforge start\n")


def cmd_version(args):
    print("  memoraforge v0.1.0")


# ═══════════════════════════════════════════════════════════════════
# Helpers
# ═══════════════════════════════════════════════════════════════════


def _find_memoraforge_dir() -> Path:
    """Find the memoraforge package directory."""
    # Check relative to this script
    script_dir = Path(__file__).resolve().parent
    if (script_dir / "docker-compose.yml").exists():
        return script_dir
    # Check current directory
    cwd = Path.cwd()
    if (cwd / "memoraforge" / "docker-compose.yml").exists():
        return cwd / "memoraforge"
    if (cwd / "docker-compose.yml").exists():
        return cwd
    return script_dir


def _find_compose_dir() -> Path:
    """Find the directory containing docker-compose.yml."""
    d = _find_memoraforge_dir()
    if not (d / "docker-compose.yml").exists():
        print(f"  ❌ docker-compose.yml not found in {d}")
        print("  Run from the memoraforge directory or run: memoraforge init")
        sys.exit(1)
    return d


def _wait_for_services(timeout: int = 60):
    """Wait for all services to become healthy."""
    import urllib.request

    start = time.time()
    while time.time() - start < timeout:
        all_up = True
        for name, info in SERVICES.items():
            try:
                req = urllib.request.Request(info["url"], method="GET")
                urllib.request.urlopen(req, timeout=2)
            except Exception:
                all_up = False
                break

        if all_up:
            return True
        time.sleep(2)

    return False


if __name__ == "__main__":
    main()
