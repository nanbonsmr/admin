#!/bin/bash

echo "🔧 Setting up Knowva Admin Dashboard..."
echo

echo "📦 Cleaning previous installation..."
rm -rf node_modules package-lock.json .vite

echo
echo "📥 Installing dependencies..."
npm install

echo
echo "🎨 Initializing Tailwind CSS..."
npx tailwindcss init -p

echo
echo "✅ Setup complete! Starting development server..."
npm run dev