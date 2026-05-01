#!/usr/bin/env node

/**
 * Bundle Size Monitoring Script
 * Checks JS/CSS bundle sizes and alerts on significant increases
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  distDir: 'dist',
  maxSizes: {
    js: 500 * 1024, // 500KB per JS chunk
    css: 100 * 1024, // 100KB per CSS file
    total: 2 * 1024 * 1024 // 2MB total
  },
  // Optional: store previous sizes for comparison
  sizeHistoryFile: '.bundle-size-history.json'
};

// Get file size in human readable format
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// Get all files of a specific type
function getFiles(dir, ext, results = []) {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        getFiles(fullPath, ext, results);
      } else if (file.endsWith(ext)) {
        results.push(fullPath);
      }
    }
  } catch (e) {
    console.error(`Error reading directory ${dir}:`, e.message);
  }
  return results;
}

// Main check function
function checkBundleSizes() {
  console.log('🔍 Checking bundle sizes...\n');

  if (!fs.existsSync(CONFIG.distDir)) {
    console.error('❌ Error: dist/ directory not found. Run "pnpm build" first.');
    process.exit(1);
  }

  // Get all JS and CSS files
  const jsFiles = getFiles(CONFIG.distDir, '.js');
  const cssFiles = getFiles(CONFIG.distDir, '.css');

  let hasWarnings = false;
  let totalSize = 0;

  // Check JS files
  console.log('📜 JavaScript files:');
  for (const file of jsFiles) {
    const stats = fs.statSync(file);
    const size = stats.size;
    totalSize += size;
    const relativePath = path.relative(CONFIG.distDir, file);
    const sizeStr = formatSize(size);

    if (size > CONFIG.maxSizes.js) {
      console.log(`  ❌ ${relativePath}: ${sizeStr} (exceeds ${formatSize(CONFIG.maxSizes.js)})`);
      hasWarnings = true;
    } else {
      console.log(`  ✅ ${relativePath}: ${sizeStr}`);
    }
  }

  // Check CSS files
  console.log('\n🎨 CSS files:');
  for (const file of cssFiles) {
    const stats = fs.statSync(file);
    const size = stats.size;
    totalSize += size;
    const relativePath = path.relative(CONFIG.distDir, file);
    const sizeStr = formatSize(size);

    if (size > CONFIG.maxSizes.css) {
      console.log(`  ❌ ${relativePath}: ${sizeStr} (exceeds ${formatSize(CONFIG.maxSizes.css)})`);
      hasWarnings = true;
    } else {
      console.log(`  ✅ ${relativePath}: ${sizeStr}`);
    }
  }

  // Check total size
  console.log(`\n📊 Total bundle size: ${formatSize(totalSize)}`);
  if (totalSize > CONFIG.maxSizes.total) {
    console.log(`❌ Total size exceeds limit of ${formatSize(CONFIG.maxSizes.total)}`);
    hasWarnings = true;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (hasWarnings) {
    console.log('⚠️  Bundle size warnings detected!');
    console.log('   Consider code splitting or lazy loading.');
  } else {
    console.log('✅ All bundle sizes are within limits!');
  }

  return !hasWarnings;
}

// Run the check
const success = checkBundleSizes();
process.exit(success ? 0 : 1);
