#!/bin/bash

echo "╔══════════════════════════════════════════════════════╗"
echo "║     AI Product Enhancement - Starting...           ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Create backup
echo "📦 Creating backup..."
BACKUP_FILE="data/products-backup-$(date +%Y%m%d-%H%M%S).json"
cp data/products.json "$BACKUP_FILE"
echo "✅ Backup created: $BACKUP_FILE"
echo ""

# Run enhancement
echo "🚀 Starting AI enhancement..."
echo "⏱️  This will take approximately 20-30 minutes"
echo "📊 Processing 2,403 products"
echo ""
echo "Progress will be shown below:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

node scripts/ai-enhance-products.js

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Enhancement complete!"
echo ""
echo "📁 Enhanced products saved to: data/products.json"
echo "📁 Backup available at: $BACKUP_FILE"
echo ""
