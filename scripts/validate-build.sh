#!/bin/bash
# Build Validation Script
# Validates that the Vite build output is correct

set -e

echo "🔍 Validating build output..."

# Check if dist directory exists
if [ ! -d "dist" ]; then
  echo "❌ Error: dist/ directory not found. Run 'pnpm build' first."
  exit 1
fi

# Check for required files
echo "📋 Checking required files..."
REQUIRED_FILES=(
  "dist/index.html"
  "dist/assets"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -e "dist/$file" ] && [ ! -e "$file" ]; then
    echo "❌ Missing required file: $file"
    exit 1
  fi
  echo "  ✅ $file"
done

# Check for JavaScript files
JS_FILES=$(find dist -name "*.js" -type f | wc -l)
if [ "$JS_FILES" -eq 0 ]; then
  echo "❌ Error: No JavaScript files found in dist/"
  exit 1
fi
echo "  ✅ Found $JS_FILES JavaScript files"

# Check for CSS files
CSS_FILES=$(find dist -name "*.css" -type f | wc -l)
if [ "$CSS_FILES" -eq 0 ]; then
  echo "⚠️  Warning: No CSS files found in dist/"
else
  echo "  ✅ Found $CSS_FILES CSS files"
fi

# Check for large files (>1MB)
echo "📊 Checking file sizes..."
LARGE_FILES=$(find dist -type f -size +1M 2>/dev/null || true)
if [ -n "$LARGE_FILES" ]; then
  echo "⚠️  Large files found (>1MB):"
  echo "$LARGE_FILES" | while read -r file; do
    size=$(du -h "$file" | cut -f1)
    echo "  ⚠️  $file ($size)"
  done
fi

# Check for source maps (should not be in production)
SOURCEMAPS=$(find dist -name "*.map" -type f | wc -l)
if [ "$SOURCEMAPS" -gt 0 ]; then
  echo "⚠️  Warning: Found $SOURCEMAPS source map files in dist/"
fi

# Validate HTML
echo "🔎 Validating index.html..."
if grep -q "scripts/index.html" dist/index.html; then
  echo "❌ Error: index.html still references source files!"
  exit 1
fi
echo "  ✅ index.html references build output"

# Summary
echo ""
echo "✅ Build validation passed!"
echo ""
echo "📊 Build output summary:"
du -sh dist
find dist -type f | wc -l | xargs echo "  Total files:"
