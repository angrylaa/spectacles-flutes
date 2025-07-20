#!/bin/bash

# AI vs Human Game Startup Script

echo "🚀 Starting AI vs Human Game..."
echo ""

# Check if .env exists
if [ ! -f "server/.env" ]; then
    echo "❌ Error: server/.env file not found!"
    echo "Please copy server/.env.example to server/.env and add your Gemini API key"
    exit 1
fi

# Check if Gemini API key is set
if ! grep -q "GEMINI_API_KEY=.*[a-zA-Z0-9]" server/.env; then
    echo "❌ Error: GEMINI_API_KEY not set in server/.env"
    echo "Please add your Gemini API key to server/.env"
    exit 1
fi

echo "✅ Environment check passed"
echo ""

# Start backend
echo "📡 Starting backend server..."
cd server
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🌐 Starting frontend..."
cd client
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎮 Game is starting up!"
echo "🔧 Backend: http://localhost:3000"
echo "🌐 Frontend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID