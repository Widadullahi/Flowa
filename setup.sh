#!/bin/bash

# FLOWA Monorepo Development Setup
# This script helps you get started with the Flowa monorepo

set -e

echo "🚀 FLOWA Monorepo Setup"
echo "======================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.10+"
    exit 1
fi
echo "✅ Python $(python3 --version | cut -d' ' -f2)"

if ! command -v node &> /dev/null && ! command -v bun &> /dev/null; then
    echo "❌ Node.js or Bun not found. Please install Node.js 18+ or Bun 1.1+"
    exit 1
fi

if command -v bun &> /dev/null; then
    echo "✅ Bun $(bun --version)"
else
    echo "✅ Node $(node --version)"
fi

echo ""
echo "📦 Setting up packages..."
echo ""

# Setup Backend
echo "🔧 Setting up backend (packages/api)..."
cd packages/api

if [ ! -d ".venv" ]; then
    echo "   Creating Python virtual environment..."
    python3 -m venv .venv
fi

echo "   Activating virtual environment..."
source .venv/bin/activate

echo "   Installing Python dependencies..."
pip install -q -r requirements.txt

cd ../..

# Setup Frontend
echo "🎨 Setting up frontend (packages/landing)..."
cd packages/landing

if command -v bun &> /dev/null; then
    echo "   Installing dependencies with Bun..."
    bun install --frozen-lockfile
else
    echo "   Installing dependencies with npm..."
    npm install
fi

cd ../..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Ready to run!"
echo ""
echo "Option 1: Run both simultaneously (recommended)"
echo "   bun run dev:concurrent"
echo ""
echo "Option 2: Run separately"
echo "   Terminal 1: cd packages/api && source .venv/bin/activate && python app.py"
echo "   Terminal 2: cd packages/landing && bun run dev"
echo ""
echo "📍 Access points:"
echo "   - Landing: http://localhost:5173"
echo "   - API: http://localhost:5000"
echo "   - Dashboard: http://localhost:5000"
echo ""
