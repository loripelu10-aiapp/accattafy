#!/bin/bash

# Simple AI Test Script
# Run this in your terminal: bash RUN-THIS.sh

cd /Users/lorenzopeluso10/Desktop/promo-finder/backend

echo "🧪 Testing PromoFinder AI System..."
echo ""

# Test the AI
node test-ai-quick.js

echo ""
echo "✅ If the test passed, run this to enhance 5 products:"
echo "   node scripts/ai-enhance-products.js --sample 5"
