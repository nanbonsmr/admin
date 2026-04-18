@echo off
echo 🔧 Setting up Knowva Admin Dashboard...
echo.

echo 📦 Cleaning previous installation...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist .vite rmdir /s /q .vite

echo.
echo 📥 Installing dependencies...
call npm install

echo.
echo 🎨 Initializing Tailwind CSS...
call npx tailwindcss init -p

echo.
echo ✅ Setup complete! Starting development server...
call npm run dev

pause