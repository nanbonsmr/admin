# Knowva Admin - Installation Guide

## 🚨 Quick Fix for Tailwind CSS Error

If you're seeing the PostCSS/Tailwind error, run this command:

### Windows:
```cmd
cd admin
fix-tailwind.bat
```

### Mac/Linux:
```bash
cd admin
chmod +x setup.sh
./setup.sh
```

### Manual Fix:
```bash
cd admin

# Clean installation
rm -rf node_modules package-lock.json .vite

# Install dependencies
npm install

# Install Tailwind CSS specifically
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

# Initialize Tailwind
npx tailwindcss init -p

# Start development server
npm run dev
```

## 📋 Step-by-Step Installation

### 1. Prerequisites
- Node.js 18+ ([Download here](https://nodejs.org/))
- npm (comes with Node.js)
- Git (optional)

### 2. Verify Prerequisites
```bash
node --version  # Should show v18.0.0 or higher
npm --version   # Should show 8.0.0 or higher
```

### 3. Navigate to Admin Directory
```bash
cd admin
```

### 4. Clean Install (Recommended)
```bash
# Remove any existing installations
rm -rf node_modules package-lock.json .vite

# Install all dependencies
npm install
```

### 5. Set Up Environment
Create `.env.local` file in the `admin` directory:
```env
VITE_CONVEX_URL=https://your-convex-deployment.convex.cloud
```

### 6. Start Development Server
```bash
npm run dev
```

### 7. Open in Browser
Navigate to: `http://localhost:5173`

## 🔧 Troubleshooting Common Issues

### Issue 1: "Cannot find module 'tailwindcss'"
**Solution:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Issue 2: "VITE_CONVEX_URL is not defined"
**Solution:** Create `.env.local` with your Convex URL

### Issue 3: Port 5173 already in use
**Solution:**
```bash
# Kill existing process
npx kill-port 5173
# Or use different port
npm run dev -- --port 3000
```

### Issue 4: Permission denied (Mac/Linux)
**Solution:**
```bash
sudo npm install
# Or fix npm permissions
npm config set prefix ~/.npm-global
```

### Issue 5: Build errors
**Solution:**
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm run build
```

## 📁 Expected File Structure After Installation

```
admin/
├── node_modules/           # Dependencies (auto-generated)
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.local             # Your environment variables
├── package.json           # Dependencies list
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## ✅ Verification Checklist

After installation, verify these work:

- [ ] `npm run dev` starts without errors
- [ ] Browser opens to `http://localhost:5173`
- [ ] Dashboard loads with proper styling
- [ ] No console errors in browser
- [ ] Tailwind CSS classes are working

## 🚀 Production Build

To build for production:
```bash
npm run build
npm run preview  # Test production build locally
```

## 📞 Need Help?

If you're still having issues:

1. **Check the logs**: Look for specific error messages
2. **Try clean install**: Delete `node_modules` and reinstall
3. **Check Node version**: Ensure you're using Node 18+
4. **Verify environment**: Make sure `.env.local` is correct

### Common Commands for Debugging:
```bash
# Check versions
node --version
npm --version

# Clear npm cache
npm cache clean --force

# Reinstall everything
rm -rf node_modules package-lock.json
npm install

# Check for conflicting processes
netstat -ano | findstr :5173  # Windows
lsof -ti:5173                 # Mac/Linux
```

---

**🎉 Once everything is working, you should see the Knowva Admin Dashboard with a beautiful, modern interface!**