#!/bin/bash

# FLOWA Complete Setup & Run Script
# This script sets everything up and gets the bot running

set -e

PROJECT_DIR="/home/biltronix/FLOWA"
API_DIR="$PROJECT_DIR/packages/api"
LANDING_DIR="$PROJECT_DIR/packages/landing"

echo "🚀 FLOWA WhatsApp Bot Setup"
echo "============================"
echo ""

# 1. Setup Backend
echo "1️⃣  Setting up backend..."
cd "$API_DIR"

if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi

source .venv/bin/activate
pip install -q -r requirements.txt
echo "✅ Backend ready"
echo ""

# 2. Setup Frontend
echo "2️⃣  Setting up frontend..."
cd "$LANDING_DIR"
npm install -q
echo "✅ Frontend dependencies installed"
echo ""

# 3. Show Access Points
echo "================================"
echo "✅ SETUP COMPLETE"
echo "================================"
echo ""
echo "🎯 ACCESS POINTS:"
echo "  📊 Dashboard: http://localhost:5000"
echo "  🎨 Landing: http://localhost:5173"
echo ""
echo "🤖 TO RUN THE BOT:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd $API_DIR"
echo "   source .venv/bin/activate"
echo "   python app.py"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd $LANDING_DIR"
echo "   npm run dev"
echo ""
echo "📱 TO TEST WHATSAPP BOT (without Meta API):"
echo "   bash $PROJECT_DIR/test-whatsapp-bot.sh"
echo ""
echo "🔌 TO CONNECT REAL WHATSAPP:"
echo "   1. Get credentials from https://developers.facebook.com"
echo "   2. Update .env file in $API_DIR"
echo "   3. Configure webhook in Meta Console"
echo "   See: $API_DIR/WHATSAPP_SETUP.md"
echo ""
