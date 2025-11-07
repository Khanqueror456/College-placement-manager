@echo off
REM Quick Start Script for Development (Windows)
REM This script provides instructions to start both backend and frontend servers

echo ========================================
echo  College Placement Manager - Dev Setup
echo ========================================
echo.

REM Check if backend port (3000) is in use
netstat -ano | findstr :3000 | findstr LISTENING >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] Port 3000 is already in use ^(backend^)
    echo           Backend may already be running
) else (
    echo [OK] Port 3000 is available
)

REM Check if frontend port (5173) is in use
netstat -ano | findstr :5173 | findstr LISTENING >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] Port 5173 is already in use ^(frontend^)
    echo           Frontend may already be running
) else (
    echo [OK] Port 5173 is available
)

echo.
echo ========================================
echo  HOW TO START
echo ========================================
echo.
echo Open TWO separate PowerShell/Command Prompt windows:
echo.
echo TERMINAL 1 - Backend:
echo   cd backend
echo   npm install  ^(first time only^)
echo   npm start
echo.
echo TERMINAL 2 - Frontend:
echo   cd frontend
echo   npm install  ^(first time only^)
echo   npm run dev
echo.
echo ========================================
echo  ACCESS POINTS
echo ========================================
echo.
echo Frontend:  http://localhost:5173
echo Backend:   http://localhost:3000
echo API Test:  http://localhost:5173/api-test
echo.
echo ========================================
echo  QUICK TEST
echo ========================================
echo.
echo 1. Start both servers
echo 2. Open browser to http://localhost:5173/api-test
echo 3. Click "Test Connection" button
echo 4. Should show "Connected Successfully!"
echo.
echo Press any key to exit...
pause >nul
