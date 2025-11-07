#!/bin/bash
# Quick Start Script for Development
# This script starts both backend and frontend servers

echo "🚀 Starting College Placement Manager..."
echo ""

# Function to check if port is in use
check_port() {
    if netstat -ano | findstr :$1 | findstr LISTENING > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Check if backend port (3000) is available
if check_port 3000; then
    echo "⚠️  Port 3000 is already in use (backend)"
    echo "   Backend may already be running"
else
    echo "✅ Port 3000 is available"
fi

# Check if frontend port (5173) is available
if check_port 5173; then
    echo "⚠️  Port 5173 is already in use (frontend)"
    echo "   Frontend may already be running"
else
    echo "✅ Port 5173 is available"
fi

echo ""
echo "📝 Instructions:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm install  # (first time only)"
echo "  npm start"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm install  # (first time only)"
echo "  npm run dev"
echo ""
echo "🌐 Access Points:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3000"
echo "  API Test: http://localhost:5173/api-test"
echo ""
echo "Press any key to continue..."
read -n 1 -s
