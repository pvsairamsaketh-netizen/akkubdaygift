#!/usr/bin/env bash
# ==============================================================================
# Saki & Akku — Personalized Relationship AI Chatbot & Voice Assistant
# Single-Command Launcher for Ollama, Django Backend, and Vite Frontend
# ==============================================================================

set -e

# Determine script root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# Text styling
BOLD="\033[1m"
GREEN="\033[38;5;48m"
ROSE="\033[38;5;204m"
CYAN="\033[38;5;81m"
YELLOW="\033[38;5;221m"
RESET="\033[0m"

echo -e "${ROSE}"
cat << "EOF"
  ╔════════════════════════════════════════════════════════════════════╗
  ║                                                                    ║
  ║     ❤️  SAKI & AKKU — AI RELATIONSHIP VOICE ASSISTANT  ❤️          ║
  ║            A Personalized Birthday Gift for Akku                   ║
  ║                    🎂 Birthday: October 20 🎂                      ║
  ║                                                                    ║
  ╚════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${RESET}"

# PID tracking for clean shutdown
OLLAMA_PID=""
BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down all Saki & Akku services cleanly...${RESET}"
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "$OLLAMA_PID" ]; then
        kill "$OLLAMA_PID" 2>/dev/null || true
    fi
    echo -e "${GREEN}✨ All services stopped. See you soon! ❤️${RESET}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# ------------------------------------------------------------------------------
# 1. Start Ollama Local LLM Engine
# ------------------------------------------------------------------------------
echo -e "${CYAN}[1/3] Checking Ollama AI Engine...${RESET}"

if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓ Ollama is already running on http://localhost:11434${RESET}"
else
    echo -e "  Starting Ollama daemon in background..."
    if command -v ollama >/dev/null 2>&1; then
        ollama serve > /dev/null 2>&1 &
        OLLAMA_PID=$!
        # Wait up to 15 seconds for Ollama to become ready
        for i in {1..15}; do
            if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
                break
            fi
            sleep 1
        done
        echo -e "  ${GREEN}✓ Ollama started successfully (PID: $OLLAMA_PID)${RESET}"
    else
        echo -e "${YELLOW}  ⚠ Ollama binary not found in PATH. Please install Ollama or ensure it is running.${RESET}"
    fi
fi

# Ensure qwen2.5:3b model is pulled
if curl -s http://localhost:11434/api/tags | grep -q "qwen2.5:3b"; then
    echo -e "  ${GREEN}✓ Model 'qwen2.5:3b' is loaded and ready.${RESET}"
else
    echo -e "  Pulling 'qwen2.5:3b' model into Ollama..."
    ollama pull qwen2.5:3b
fi

# ------------------------------------------------------------------------------
# 2. Start Django Backend Server (Port 8000)
# ------------------------------------------------------------------------------
echo -e "${CYAN}[2/3] Starting Django Backend Server...${RESET}"

PYTHON_BIN="$ROOT_DIR/.venv/bin/python"
if [ ! -f "$PYTHON_BIN" ]; then
    PYTHON_BIN="python3"
fi

# Run pending database migrations
"$PYTHON_BIN" "$ROOT_DIR/backend/manage.py" migrate --noinput > /dev/null 2>&1 || true

# Check if port 8000 is already running backend
if curl -s http://localhost:8000/api/health/ > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓ Backend is already running on http://localhost:8000${RESET}"
else
    "$PYTHON_BIN" "$ROOT_DIR/backend/manage.py" runserver 0.0.0.0:8000 > /dev/null 2>&1 &
    BACKEND_PID=$!
    # Wait for backend health check
    for i in {1..20}; do
        if curl -s http://localhost:8000/api/health/ > /dev/null 2>&1; then
            break
        fi
        sleep 0.5
    done
    echo -e "  ${GREEN}✓ Backend started successfully on http://localhost:8000 (PID: $BACKEND_PID)${RESET}"
fi

# ------------------------------------------------------------------------------
# 3. Start Vite React Frontend (Port 5173)
# ------------------------------------------------------------------------------
echo -e "${CYAN}[3/3] Starting React + TypeScript Frontend...${RESET}"

if curl -s http://localhost:5173/ > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓ Frontend is already running on http://localhost:5173${RESET}"
else
    cd "$ROOT_DIR/frontend"
    npm run dev -- --host 0.0.0.0 --port 5173 > /dev/null 2>&1 &
    FRONTEND_PID=$!
    cd "$ROOT_DIR"
    # Wait for frontend
    for i in {1..15}; do
        if curl -s http://localhost:5173/ > /dev/null 2>&1; then
            break
        fi
        sleep 0.5
    done
    echo -e "  ${GREEN}✓ Frontend started successfully on http://localhost:5173 (PID: $FRONTEND_PID)${RESET}"
fi

# ------------------------------------------------------------------------------
# Ready Status & Browser Launch
# ------------------------------------------------------------------------------
echo ""
echo -e "${BOLD}${GREEN}================================================================${RESET}"
echo -e "${BOLD}${ROSE}  💖 SAKI & AKKU IS FULLY ONLINE & READY! 💖${RESET}"
echo -e "${BOLD}${GREEN}================================================================${RESET}"
echo -e "  🌸 ${BOLD}Web Application:${RESET}  ${CYAN}http://localhost:5173${RESET}"
echo -e "  🌸 ${BOLD}Backend API Docs:${RESET} ${CYAN}http://localhost:8000/api/health/${RESET}"
echo -e "  🌸 ${BOLD}Ollama LLM Engine:${RESET} ${CYAN}http://localhost:11434 (qwen2.5:3b)${RESET}"
echo -e "  🎂 ${BOLD}Akku's Birthday:${RESET}   ${ROSE}October 20${RESET}"
echo -e "${BOLD}${GREEN}================================================================${RESET}"
echo -e "  Press ${YELLOW}Ctrl+C${RESET} anytime in this window to stop all services."
echo ""

# Open in macOS default browser if available
if command -v open >/dev/null 2>&1; then
    open "http://localhost:5173" 2>/dev/null || true
fi

# Keep script running to monitor processes or keep terminal active
if [ -z "$FRONTEND_PID" ] && [ -z "$BACKEND_PID" ] && [ -z "$OLLAMA_PID" ]; then
    while true; do
        sleep 5
    done
else
    wait
fi
