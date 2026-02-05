#!/usr/bin/env node
/**
 * sk-claudecode Setup Script
 * 
 * Usage:
 *   node scripts/setup.mjs
 *   npm run setup
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

console.log('🚀 sk-claudecode Setup');
console.log('━'.repeat(40));

// Check if Claude CLI is available
try {
    execSync('claude --version', { stdio: 'pipe' });
    console.log('✅ Claude CLI detected');
} catch {
    console.log('❌ Claude CLI not found. Please install Claude Code first.');
    console.log('   https://claude.ai/code');
    process.exit(1);
}

// Install plugin
console.log('\n📦 Installing sk-claudecode plugin...');
try {
    execSync(`claude /install-plugin "${ROOT}"`, { stdio: 'inherit' });
    console.log('✅ Plugin installed successfully!');
} catch (error) {
    console.log('⚠️  Plugin installation may have failed. Try manually:');
    console.log(`   claude /install-plugin "${ROOT}"`);
}

console.log('\n━'.repeat(40));
console.log('🎉 Setup complete!');
console.log('\nAvailable agents: 39');
console.log('Available skills: 26+ categories');
console.log('Scientific domains: 141');
console.log('\nUsage:');
console.log('  - Use @agent-name to invoke agents');
console.log('  - Use /sk-claudecode:skill-name to invoke skills');
console.log('\nSee AGENTS.md for full documentation.');
