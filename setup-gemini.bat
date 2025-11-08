@echo off
echo ========================================
echo Gemini AI Integration Setup
echo ========================================
echo.

cd backend

echo Installing Google Generative AI package...
call npm install @google/generative-ai
echo.

if %errorlevel% equ 0 (
    echo ✅ Package installed successfully!
    echo.
    echo Next steps:
    echo 1. Get your Gemini API key from https://makersuite.google.com/app/apikey
    echo 2. Add it to backend/.env file:
    echo    GEMINI_API_KEY=your_api_key_here
    echo    GEMINI_MODEL=gemini-1.5-flash
    echo 3. Restart your backend server
    echo.
    echo For detailed instructions, see backend/GEMINI_INTEGRATION_README.md
) else (
    echo ❌ Installation failed. Please check the error above.
)

echo.
pause
