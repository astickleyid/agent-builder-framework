#!/bin/bash
# MemoraForge — One-Line Installer
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/astickleyid/agent-builder-framework/main/memoraforge/install.sh | bash
#
# What it does:
#   1. Checks prerequisites (Docker, Python, Git)
#   2. Clones the repository
#   3. Installs the CLI tool
#   4. Starts all services
#   5. Pulls a default AI model

set -e

REPO="https://github.com/astickleyid/agent-builder-framework.git"
INSTALL_DIR="$HOME/memoraforge"
MODEL="llama3.1:8b"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║         🦀  M E M O R A F O R G E  Installer  🦀          ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ── Check prerequisites ──────────────────────────────────────────

check() {
    if command -v "$1" &> /dev/null; then
        echo -e "  ${GREEN}✅${NC} $2 found"
        return 0
    else
        echo -e "  ${RED}❌${NC} $2 not found"
        return 1
    fi
}

MISSING=0
check docker "Docker" || { echo -e "     Install: ${YELLOW}https://docker.com/get-started${NC}"; MISSING=1; }
check git "Git" || { echo -e "     Install: ${YELLOW}https://git-scm.com${NC}"; MISSING=1; }
check python3 "Python 3" || check python "Python" || { echo -e "     Install: ${YELLOW}https://python.org/downloads${NC}"; MISSING=1; }

# Check Docker Compose
if docker compose version &> /dev/null; then
    echo -e "  ${GREEN}✅${NC} Docker Compose found"
else
    echo -e "  ${RED}❌${NC} Docker Compose not found"
    echo -e "     Included with Docker Desktop"
    MISSING=1
fi

# Check Docker is running
if docker info &> /dev/null; then
    echo -e "  ${GREEN}✅${NC} Docker is running"
else
    echo -e "  ${RED}❌${NC} Docker is not running"
    echo -e "     Start Docker Desktop first"
    MISSING=1
fi

echo ""

if [ $MISSING -eq 1 ]; then
    echo -e "${RED}  Please install the missing prerequisites and try again.${NC}"
    echo ""
    exit 1
fi

# ── Clone / Update ───────────────────────────────────────────────

if [ -d "$INSTALL_DIR" ]; then
    echo -e "  📁 MemoraForge directory exists, updating..."
    cd "$INSTALL_DIR"
    git pull origin main 2>/dev/null || true
else
    echo -e "  📥 Downloading MemoraForge..."
    git clone "$REPO" "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

cd memoraforge

# ── Install Python CLI ───────────────────────────────────────────

echo -e "  🐍 Installing CLI tool..."
pip3 install httpx --quiet 2>/dev/null || pip install httpx --quiet 2>/dev/null

# Make CLI accessible
SCRIPT_DIR="$(pwd)"
CLI_PATH="$SCRIPT_DIR/cli.py"

# Add to PATH via shell profile
SHELL_RC=""
if [ -f "$HOME/.zshrc" ]; then
    SHELL_RC="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
    SHELL_RC="$HOME/.bashrc"
fi

# Create a wrapper script
mkdir -p "$HOME/.local/bin"
cat > "$HOME/.local/bin/memoraforge" << WRAPPER
#!/bin/bash
cd "$SCRIPT_DIR" && python3 "$CLI_PATH" "\$@"
WRAPPER
chmod +x "$HOME/.local/bin/memoraforge"

if [ -n "$SHELL_RC" ]; then
    if ! grep -q '.local/bin' "$SHELL_RC" 2>/dev/null; then
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$SHELL_RC"
    fi
fi

export PATH="$HOME/.local/bin:$PATH"

echo -e "  ${GREEN}✅${NC} CLI installed: memoraforge"

# ── Start services ───────────────────────────────────────────────

echo ""
echo -e "  🚀 Starting services (this takes a few minutes first time)..."
echo ""

docker compose up -d

echo ""
echo -e "  ⏳ Waiting for services..."

# Wait up to 90 seconds
for i in $(seq 1 45); do
    ALL_UP=true
    for port in 8000 8100 8200 8300; do
        if ! curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
            ALL_UP=false
            break
        fi
    done
    if [ "$ALL_UP" = true ]; then
        break
    fi
    sleep 2
done

# ── Pull AI model ────────────────────────────────────────────────

echo -e "  📦 Pulling AI model: $MODEL (this takes 5-15 minutes)..."
docker compose exec -T ollama ollama pull "$MODEL" 2>/dev/null || true

# ── Done ─────────────────────────────────────────────────────────

echo ""
echo -e "${GREEN}  ═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ MemoraForge is installed and running!${NC}"
echo -e "${GREEN}  ═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${CYAN}Quick Start:${NC}"
echo ""
echo -e "    memoraforge status            # Check service health"
echo -e "    memoraforge agent create Bot   # Create an agent"
echo -e "    memoraforge agent chat bot     # Chat with your agent"
echo -e "    memoraforge memory stats       # See memory usage"
echo -e "    memoraforge memory store \"The sky is blue\"  # Store a fact"
echo -e "    memoraforge memory search \"sky\" # Search memories"
echo ""
echo -e "  ${CYAN}Services:${NC}"
echo ""
echo -e "    API Server:   http://localhost:8000"
echo -e "    Memory Hub:   http://localhost:8200"
echo -e "    ACP Handler:  http://localhost:8300"
echo ""
echo -e "  ${CYAN}Manage:${NC}"
echo ""
echo -e "    memoraforge stop              # Stop all services"
echo -e "    memoraforge start             # Start again"
echo -e "    memoraforge logs -f           # View live logs"
echo ""

# Hint about shell reload
if [ -n "$SHELL_RC" ]; then
    echo -e "  ${YELLOW}Note: Run 'source $SHELL_RC' or open a new terminal for the"
    echo -e "  'memoraforge' command to work everywhere.${NC}"
    echo ""
fi
