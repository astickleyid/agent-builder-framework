"""Open Claw Agent — Core reference agent implementation.

Built on LangGraph state machine + LlamaIndex retrieval.
Maintains persistent "shadow memory" in the Memory Hub.
Serves as the default template for all user-built agents.
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
import uuid
from dataclasses import dataclass, field
from enum import Enum
from typing import Any

import httpx

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Agent State
# ---------------------------------------------------------------------------


class AgentPhase(str, Enum):
    IDLE = "idle"
    THINKING = "thinking"
    CLAWING = "clawing"       # Retrieving from memory
    GENERATING = "generating"  # LLM inference
    ACTING = "acting"          # Executing tools
    STORING = "storing"        # Persisting to memory


@dataclass
class AgentState:
    """LangGraph-compatible state for the Open Claw Agent."""

    agent_id: str = ""
    session_id: str = field(default_factory=lambda: uuid.uuid4().hex[:12])
    phase: AgentPhase = AgentPhase.IDLE
    messages: list[dict[str, str]] = field(default_factory=list)
    context_window: list[dict[str, Any]] = field(default_factory=list)
    shadow_memory: list[dict[str, Any]] = field(default_factory=list)
    tool_results: list[dict[str, Any]] = field(default_factory=list)
    current_plan: list[str] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)
    token_budget: int = 128_000
    tokens_used: int = 0
    turn_count: int = 0


# ---------------------------------------------------------------------------
# Agent Configuration
# ---------------------------------------------------------------------------


@dataclass
class AgentConfig:
    """Configuration for an Open Claw Agent instance."""

    agent_id: str = field(default_factory=lambda: f"claw_{uuid.uuid4().hex[:8]}")
    name: str = "Open Claw Agent"
    model: str = "llama3.1:8b"

    # Service endpoints
    api_server_url: str = "http://localhost:8000"
    memory_hub_url: str = "http://localhost:8200"
    mcp_server_url: str = "http://localhost:8100"
    acp_handler_url: str = "http://localhost:8300"

    # Memory settings
    max_context_tokens: int = 128_000
    shadow_memory_enabled: bool = True
    auto_store_conversations: bool = True
    memory_claw_top_k: int = 50

    # Tools
    enabled_tools: list[str] = field(default_factory=lambda: [
        "web_search", "code_exec", "file_read", "memory_claw", "memory_store",
    ])

    system_prompt: str = (
        "You are an Open Claw Agent — an autonomous AI agent with persistent memory. "
        "You can 'claw' relevant context from your memory hub, execute tools, and "
        "maintain long-term knowledge across sessions. Your effective context spans "
        "millions of tokens through smart retrieval. Think step by step, use your "
        "tools wisely, and always store important findings for future reference."
    )


# ---------------------------------------------------------------------------
# Open Claw Agent
# ---------------------------------------------------------------------------


class OpenClawAgent:
    """The core Open Claw Agent — claws data, thinks, acts, remembers.

    Lifecycle per turn:
    1. CLAW: Retrieve relevant context from Memory Hub
    2. THINK: Build prompt with system + context + messages
    3. GENERATE: Call LLM via Headless API
    4. ACT: Execute any tool calls
    5. STORE: Persist important information to Memory Hub

    This implements a LangGraph-compatible state machine pattern.
    """

    def __init__(self, config: AgentConfig | None = None):
        self.config = config or AgentConfig()
        self.state = AgentState(agent_id=self.config.agent_id)
        self._http = httpx.AsyncClient(timeout=60.0)
        self._tools: dict[str, Any] = {}
        self._registered = False

    async def initialize(self):
        """Register with ACP and set up MCP stream."""
        # Register with ACP Handler
        try:
            resp = await self._http.post(
                f"{self.config.acp_handler_url}/rpc",
                json={
                    "jsonrpc": "2.0",
                    "method": "agent.register",
                    "params": {
                        "agent_id": self.config.agent_id,
                        "agent_name": self.config.name,
                        "capabilities": self.config.enabled_tools,
                        "max_context_tokens": self.config.max_context_tokens,
                    },
                    "id": 1,
                },
            )
            result = resp.json()
            if "result" in result:
                self._registered = True
                logger.info("Agent %s registered with ACP", self.config.agent_id)
        except Exception as e:
            logger.warning("ACP registration failed: %s (continuing in standalone mode)", e)

        # Create MCP context stream
        try:
            resp = await self._http.post(
                f"{self.config.mcp_server_url}/streams",
                json={
                    "name": f"agent_{self.config.agent_id}",
                    "owner_agent_id": self.config.agent_id,
                },
            )
            if resp.status_code == 200:
                stream = resp.json()
                self.state.metadata["stream_id"] = stream["stream_id"]
                logger.info("Created MCP stream: %s", stream["stream_id"])
        except Exception as e:
            logger.warning("MCP stream creation failed: %s", e)

        # Register built-in tools
        self._register_tools()

    async def run(self, user_message: str) -> str:
        """Execute a full agent turn: claw → think → generate → act → store.

        This is the main entry point for interacting with the agent.
        """
        self.state.turn_count += 1
        self.state.messages.append({"role": "user", "content": user_message})

        # Phase 1: CLAW — retrieve relevant context
        self.state.phase = AgentPhase.CLAWING
        context = await self._claw_memory(user_message)
        self.state.context_window = context

        # Phase 2: THINK — build the full prompt
        self.state.phase = AgentPhase.THINKING
        prompt_messages = self._build_prompt(user_message, context)

        # Phase 3: GENERATE — call the LLM
        self.state.phase = AgentPhase.GENERATING
        response = await self._generate(prompt_messages)

        # Phase 4: ACT — execute any tool calls in the response
        self.state.phase = AgentPhase.ACTING
        final_response = await self._execute_tools(response)

        # Phase 5: STORE — persist to memory
        self.state.phase = AgentPhase.STORING
        await self._store_turn(user_message, final_response)

        self.state.messages.append({"role": "assistant", "content": final_response})
        self.state.phase = AgentPhase.IDLE

        return final_response

    async def _claw_memory(self, query: str) -> list[dict[str, Any]]:
        """Retrieve relevant context from Memory Hub.

        This is the "clawing" operation — reaching into the memory hub
        to pull relevant context for the current query.
        """
        try:
            resp = await self._http.post(
                f"{self.config.memory_hub_url}/retrieve/claw",
                json={
                    "query": query,
                    "agent_id": self.config.agent_id,
                    "top_k": self.config.memory_claw_top_k,
                    "max_tokens": self.config.max_context_tokens // 2,
                    "include_graph": True,
                },
            )
            if resp.status_code == 200:
                data = resp.json()
                logger.info(
                    "Clawed %d memories (%d tokens) in %.0fms",
                    data.get("total_results", 0),
                    data.get("total_tokens", 0),
                    data.get("retrieval_ms", 0),
                )
                return data.get("results", [])
        except Exception as e:
            logger.warning("Memory claw failed: %s", e)

        return []

    def _build_prompt(
        self,
        user_message: str,
        context: list[dict[str, Any]],
    ) -> list[dict[str, str]]:
        """Build the complete prompt with system, context, and conversation."""
        messages = [
            {"role": "system", "content": self.config.system_prompt},
        ]

        # Inject retrieved context
        if context:
            context_text = "\n\n---\n\n".join(
                f"[Memory {c.get('memory_id', '?')} | relevance={c.get('relevance_score', 0):.2f}]\n{c.get('content', '')}"
                for c in context
            )
            messages.append({
                "role": "system",
                "content": f"Relevant context from your memory:\n\n{context_text}",
            })

        # Inject shadow memory highlights
        if self.state.shadow_memory:
            shadow_text = "\n".join(
                f"- {s.get('summary', s.get('content', ''))}"
                for s in self.state.shadow_memory[-10:]  # Last 10 shadow entries
            )
            messages.append({
                "role": "system",
                "content": f"Your persistent notes:\n{shadow_text}",
            })

        # Add conversation history (bounded)
        recent = self.state.messages[-20:]  # Keep last 20 messages
        messages.extend(recent)

        # Add tool descriptions
        tool_desc = self._get_tool_descriptions()
        if tool_desc:
            messages.append({
                "role": "system",
                "content": f"Available tools:\n{tool_desc}\n\nTo use a tool, include: [TOOL: tool_name(args)]",
            })

        return messages

    async def _generate(self, messages: list[dict[str, str]]) -> str:
        """Call the Headless API for LLM inference."""
        try:
            resp = await self._http.post(
                f"{self.config.api_server_url}/v1/chat",
                json={
                    "model": self.config.model,
                    "messages": messages,
                    "max_tokens": 2048,
                    "temperature": 0.7,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            content = data["choices"][0]["message"]["content"]

            # Track token usage
            usage = data.get("usage", {})
            self.state.tokens_used += usage.get("total_tokens", 0)

            return content
        except Exception as e:
            logger.error("LLM generation failed: %s", e)
            return f"[Agent error: generation failed — {e}]"

    async def _execute_tools(self, response: str) -> str:
        """Parse and execute any tool calls embedded in the response."""
        import re
        tool_pattern = r'\[TOOL:\s*(\w+)\((.*?)\)\]'
        matches = re.findall(tool_pattern, response)

        if not matches:
            return response

        result = response
        for tool_name, args_str in matches:
            tool = self._tools.get(tool_name)
            if not tool:
                tool_result = f"[Tool '{tool_name}' not found]"
            else:
                try:
                    tool_result = await tool(args_str)
                    self.state.tool_results.append({
                        "tool": tool_name,
                        "args": args_str,
                        "result": tool_result,
                        "timestamp": time.time(),
                    })
                except Exception as e:
                    tool_result = f"[Tool error: {e}]"

            result = result.replace(f"[TOOL: {tool_name}({args_str})]", str(tool_result))

        return result

    async def _store_turn(self, user_message: str, response: str):
        """Store the conversation turn in Memory Hub."""
        if not self.config.auto_store_conversations:
            return

        try:
            await self._http.post(
                f"{self.config.memory_hub_url}/ingest/store",
                json={
                    "agent_id": self.config.agent_id,
                    "content": f"User: {user_message}\n\nAssistant: {response}",
                    "memory_type": "conversation",
                    "title": f"Turn {self.state.turn_count}",
                    "metadata": {
                        "session_id": self.state.session_id,
                        "turn": self.state.turn_count,
                    },
                    "auto_summarize": True,
                },
            )
        except Exception as e:
            logger.warning("Failed to store turn: %s", e)

        # Update shadow memory
        if self.config.shadow_memory_enabled:
            self.state.shadow_memory.append({
                "turn": self.state.turn_count,
                "summary": f"Discussed: {user_message[:100]}",
                "timestamp": time.time(),
            })

    def _register_tools(self):
        """Register built-in tools."""

        async def memory_claw(args: str) -> str:
            results = await self._claw_memory(args)
            return json.dumps([
                {"content": r.get("content", "")[:200], "score": r.get("relevance_score", 0)}
                for r in results[:5]
            ], indent=2)

        async def memory_store(args: str) -> str:
            try:
                await self._http.post(
                    f"{self.config.memory_hub_url}/ingest/store",
                    json={
                        "agent_id": self.config.agent_id,
                        "content": args,
                        "memory_type": "fact",
                    },
                )
                return "[Stored to memory]"
            except Exception as e:
                return f"[Store failed: {e}]"

        async def web_search(args: str) -> str:
            return f"[Web search results for: {args}]"  # Placeholder

        async def code_exec(args: str) -> str:
            return f"[Code execution disabled in sandbox]"  # Safety

        async def file_read(args: str) -> str:
            return f"[File read disabled in sandbox]"  # Safety

        self._tools = {
            "memory_claw": memory_claw,
            "memory_store": memory_store,
            "web_search": web_search,
            "code_exec": code_exec,
            "file_read": file_read,
        }

    def _get_tool_descriptions(self) -> str:
        """Get formatted tool descriptions."""
        descriptions = {
            "memory_claw": "Search your long-term memory. Args: search query string",
            "memory_store": "Store a fact or note in long-term memory. Args: content to store",
            "web_search": "Search the web. Args: search query",
            "code_exec": "Execute Python code. Args: code string",
            "file_read": "Read a file. Args: file path",
        }
        return "\n".join(
            f"- {name}: {desc}"
            for name, desc in descriptions.items()
            if name in self.config.enabled_tools
        )

    async def get_status(self) -> dict[str, Any]:
        """Get current agent status."""
        return {
            "agent_id": self.config.agent_id,
            "name": self.config.name,
            "phase": self.state.phase.value,
            "session_id": self.state.session_id,
            "turn_count": self.state.turn_count,
            "tokens_used": self.state.tokens_used,
            "messages": len(self.state.messages),
            "shadow_memories": len(self.state.shadow_memory),
            "context_items": len(self.state.context_window),
            "registered": self._registered,
        }

    async def shutdown(self):
        """Clean shutdown — flush shadow memory to hub."""
        if self.state.shadow_memory:
            try:
                shadow_content = json.dumps(self.state.shadow_memory, indent=2)
                await self._http.post(
                    f"{self.config.memory_hub_url}/ingest/store",
                    json={
                        "agent_id": self.config.agent_id,
                        "content": shadow_content,
                        "memory_type": "shadow",
                        "title": f"Shadow memory — session {self.state.session_id}",
                    },
                )
                logger.info("Flushed shadow memory for session %s", self.state.session_id)
            except Exception as e:
                logger.warning("Failed to flush shadow memory: %s", e)

        await self._http.aclose()


# ---------------------------------------------------------------------------
# Standalone runner
# ---------------------------------------------------------------------------


async def main():
    """Run the agent in interactive mode."""
    logging.basicConfig(level=logging.INFO)

    config = AgentConfig(name="MemoraForge Claw Agent")
    agent = OpenClawAgent(config)

    print(f"\n🦀 Open Claw Agent [{config.agent_id}]")
    print(f"   Model: {config.model}")
    print(f"   Memory Hub: {config.memory_hub_url}")
    print("   Type 'quit' to exit, 'status' for agent status\n")

    await agent.initialize()

    while True:
        user_input = input("You: ").strip()
        if not user_input:
            continue
        if user_input.lower() == "quit":
            break
        if user_input.lower() == "status":
            status = await agent.get_status()
            print(json.dumps(status, indent=2))
            continue

        response = await agent.run(user_input)
        print(f"\nAgent: {response}\n")

    await agent.shutdown()
    print("Agent shut down.")


if __name__ == "__main__":
    asyncio.run(main())
