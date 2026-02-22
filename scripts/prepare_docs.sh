#!/usr/bin/env bash
set -euo pipefail
echo "Preparing docs directory for GitHub Pages..."
rm -rf docs
mkdir -p docs

# Prefer static export from Next if available
if [ -d "frontend/out" ]; then
  echo "Using frontend/out"
  cp -a frontend/out/. docs/
elif [ -d "frontend/public" ] && [ -d "public" ]; then
  echo "No frontend/out; copying frontend/public and repo public"
  cp -a frontend/public/. docs/ || true
  cp -a public/. docs/ || true
elif [ -d "public" ]; then
  echo "Copying repo public/ to docs/"
  cp -a public/. docs/ || true
else
  echo "No static output found. docs/ will be empty until you build the frontend or add site files to public/."
fi

# Ensure index.html exists in docs (fallback to public/index.html)
if [ ! -f docs/index.html ]; then
  if [ -f public/index.html ]; then
    cp public/index.html docs/index.html
  fi
fi

# Create .nojekyll to allow files/dirs starting with _
touch docs/.nojekyll

echo "docs prepared. Files in docs/:"
ls -la docs | sed -n '1,200p'
