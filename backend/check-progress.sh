#!/bin/bash

echo "=== AI Enhancement Progress Check ==="
echo ""

# Check if process is running
PROCESS=$(ps aux | grep "node scripts/ai-enhance" | grep -v grep)
if [ -n "$PROCESS" ]; then
  echo "✅ Process is running:"
  echo "$PROCESS"
else
  echo "❌ Process is NOT running"
fi

echo ""
echo "=== Log Output (last 30 lines) ==="
if [ -f ai-enhancement.log ]; then
  tail -30 ai-enhancement.log
  echo ""
  echo "Log file size: $(du -h ai-enhancement.log | cut -f1)"
else
  echo "No log file found"
fi

echo ""
echo "=== Product File Changes ==="
echo "Current products.json: $(du -h data/products.json | cut -f1)"
echo "Backups:"
ls -lh data/products-backup-*.json 2>/dev/null | tail -3

echo ""
echo "=== Recent Product Updates ==="
RECENT_BACKUP=$(ls -t data/products-backup-*.json 2>/dev/null | head -1)
if [ -n "$RECENT_BACKUP" ]; then
  echo "Comparing to backup: $(basename $RECENT_BACKUP)"
  diff <(wc -l < "$RECENT_BACKUP") <(wc -l < data/products.json) >/dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo "✅ Products file unchanged (processing may still be in progress)"
  else
    echo "✅ Products file has been updated!"
  fi
fi
