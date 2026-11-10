#!/bin/sh
set -eu
cd "$(dirname "$0")/../.."
for theme in site article; do
  npm exec --yes --package=tailwindcss@3.4.17 -- tailwindcss \
    -c "tools/public-css/$theme.config.cjs" -i tools/public-css/input.css \
    -o "css/$theme-v1.css" --minify
done
