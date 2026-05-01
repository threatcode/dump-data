#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "Starting content migration from content/ to src/ and dist/."

mkdir -p src dist legacy

move_if_exists() {
  local src_path="$1"
  local dst_path="$2"
  if [ -d "$src_path" ] && [ ! -e "$dst_path" ]; then
    echo "Moving $src_path -> $dst_path"
    mv "$src_path" "$dst_path"
  elif [ -e "$dst_path" ]; then
    echo "Skipping $src_path because $dst_path already exists"
  else
    echo "No $src_path to move"
  fi
}

move_if_exists content/app src/app
move_if_exists content/styles src/styles
move_if_exists content/templates src/templates
move_if_exists content/pages src/pages
move_if_exists content/images src/images
move_if_exists content/fonts src/fonts
move_if_exists content/feature-image src/feature-image
move_if_exists content/resources src/resources
move_if_exists content/error src/pages/error
move_if_exists content/m.ringid.com src/m.ringid.com
move_if_exists content/mobile src/mobile
move_if_exists content/mobile_apps_pages src/mobile_apps_pages
move_if_exists content/newsportal src/newsportal
move_if_exists content/player src/player
move_if_exists content/webapp src/webapp

move_if_exists content/css dist/css
move_if_exists content/js dist/js

move_if_exists_file() {
  local src_path="$1"
  local dst_path="$2"
  if [ -f "$src_path" ] && [ ! -e "$dst_path" ]; then
    echo "Moving $src_path -> $dst_path"
    mv "$src_path" "$dst_path"
  elif [ -e "$dst_path" ]; then
    echo "Skipping $src_path because $dst_path already exists"
  else
    echo "No $src_path to move"
  fi
}

mkdir -p src/pages src/scripts
move_if_exists_file content/chatwindow.js src/scripts/chatwindow.js
move_if_exists_file content/utils_script.js src/scripts/utils_script.js

# Move top-level HTML and XHTML pages into src/pages for the new layout.
for ext in html xhtml; do
  for page in content/*.$ext; do
    if [ -f "$page" ]; then
      base=$(basename "$page")
      case "$base" in
        robots.txt|sitemap.xml|privacy_old_important.html|index_old_file_important.html|*.backup|*_old*.html)
          continue
          ;;
        *)
          if [ ! -e "src/pages/$base" ]; then
            echo "Moving $page -> src/pages/$base"
            mv "$page" "src/pages/$base"
          else
            echo "Skipping $page because src/pages/$base already exists"
          fi
          ;;
      esac
    fi
  done
 done

# Move backups and old legacy files into legacy/ for later review.
find content -maxdepth 1 \( -name '*.backup' -o -name '*_old*.html' -o -name 'index_old_file_important.html' -o -name 'privacy_old_important.html' \) -print0 |
  while IFS= read -r -d '' path; do
    echo "Archiving legacy file: $path"
    mv "$path" legacy/
  done

# Move root-level static files (robots.txt, sitemap.xml) to project root.
mkdir -p .
for static_file in robots.txt sitemap.xml; do
  if [ -f "content/$static_file" ] && [ ! -e "$static_file" ]; then
    echo "Moving content/$static_file -> $static_file"
    mv "content/$static_file" "$static_file"
  elif [ -e "$static_file" ]; then
    echo "Skipping content/$static_file because $static_file already exists"
  fi
done

# Move API documentation into src/apidocfiles.
move_if_exists content/apidocfiles src/apidocfiles
if [ -f "content/apidoc.json" ] && [ ! -e "src/apidocfiles/apidoc.json" ]; then
  mkdir -p src/apidocfiles
  echo "Moving content/apidoc.json -> src/apidocfiles/apidoc.json"
  mv "content/apidoc.json" "src/apidocfiles/apidoc.json"
fi

# Move test files to root-level tests/.
move_if_exists content/tests tests
if [ -f "content/karma.conf.js" ] && [ ! -e "tests/karma.conf.js" ]; then
  mkdir -p tests
  echo "Moving content/karma.conf.js -> tests/karma.conf.js"
  mv "content/karma.conf.js" "tests/karma.conf.js"
fi

# Move test media into tests/testmedia.
if [ -d "content/testmedia" ] && [ ! -e "tests/testmedia" ]; then
  mkdir -p tests
  echo "Moving content/testmedia -> tests/testmedia"
  mv "content/testmedia" "tests/testmedia"
fi

# Move scripts/dist build output into dist/scripts/.
if [ -d "content/scripts/dist" ] && [ ! -e "dist/scripts" ]; then
  mkdir -p dist/scripts
  echo "Moving content/scripts/dist -> dist/scripts/dist"
  mv "content/scripts/dist" "dist/scripts/dist"
fi

# Move downloadable binaries and archives into dist/downloads/.
if ls content/ringID*.exe content/ringID*.zip 2>/dev/null; then
  mkdir -p dist/downloads
  for f in content/ringID*.exe content/ringID*.zip; do
    if [ -f "$f" ] && [ ! -e "dist/downloads/$(basename "$f")" ]; then
      echo "Moving $f -> dist/downloads/"
      mv "$f" "dist/downloads/"
    fi
  done
fi

# Move legacy text files into legacy/.
if [ -f "content/ringidUpdate.txt" ] && [ ! -e "legacy/ringidUpdate.txt" ]; then
  echo "Moving content/ringidUpdate.txt -> legacy/ringidUpdate.txt"
  mv "content/ringidUpdate.txt" "legacy/ringidUpdate.txt"
fi

# Move bower.json to root if not already present.
if [ -f "content/bower.json" ] && [ ! -e "bower.json" ]; then
  echo "Moving content/bower.json -> bower.json"
  mv "content/bower.json" "bower.json"
fi

# Merge content/.gitignore entries into root .gitignore if needed.
if [ -f "content/.gitignore" ]; then
  echo "Note: content/.gitignore exists. Review and merge relevant entries into .gitignore manually."
fi

# Merge content/README.md if root README exists.
if [ -f "content/README.md" ] && [ -f "README.md" ]; then
  echo "Note: content/README.md exists. Review and merge into root README.md manually."
fi

# If content/js/build exists after moving js, ensure it remains available under dist.
if [ -d "dist/js/build" ]; then
  echo "Retained build artifacts under dist/js/build"
fi

# Remove content/index.html if it is just a redirect and src/pages/index.html exists.
if [ -f "content/index.html" ] && [ -f "src/pages/index.html" ]; then
  if grep -q 'http-equiv="refresh"' "content/index.html" 2>/dev/null; then
    echo "Removing content/index.html (redirect duplicate, src/pages/index.html is canonical)"
    rm "content/index.html"
  fi
fi

echo "Migration complete. Review src/, dist/, tests/, and legacy/ before deleting content/."
