#!/bin/bash
# Generate repository file index (excluding `node_modules`, `dist`, etc.)
echo "# File Index" > INDEX.md
echo "Generated on $(date)" >> INDEX.md
echo "" >> INDEX.md
echo "| Path | Description |" >> INDEX.md
echo "|------|-------------|" >> INDEX.md

find . -type f \
  -not -path "./node_modules/*" \
  -not -path "./dist/*" \
  -not -path "./.git/*" \
  -not -path "./coverage/*" \
  -not -name "INDEX.md" \
  -not -name "package-lock.json" \
  | sort \
  | while read -r file; do
    # Extract the filename as a brief description (can be manually supplemented).
    desc=$(basename "$file" | sed 's/\.[^.]*$//' | tr '_-' ' ')
    echo "| \`$file\` | $desc |" >> INDEX.md
done
