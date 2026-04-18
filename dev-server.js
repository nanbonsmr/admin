#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Knowva Admin Development Server...');
console.log('📁 Working directory:', __dirname);

// Check if node_modules exists
import { existsSync } from 'fs';
const nodeModulesPath = join(__dirname, 'node_modules');

if (!existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  const install = spawn('npm', ['install'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  install.on('close', (code) => {
    if (code === 0) {
      startDevServer();
    } else {
      console.error('❌ Failed to install dependencies');
      process.exit(1);
    }
  });
} else {
  startDevServer();
}

function startDevServer() {
  console.log('🔥 Starting Vite development server...');
  
  const vite = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  vite.on('close', (code) => {
    console.log(`Development server exited with code ${code}`);
  });

  vite.on('error', (err) => {
    console.error('❌ Failed to start development server:', err);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development server...');
    vite.kill('SIGINT');
    process.exit(0);
  });
}