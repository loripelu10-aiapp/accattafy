#!/bin/bash

echo "🔧 Starting PromoFinder Backend Server on port 3002..."
echo ""

cd /Users/lorenzopeluso10/Desktop/promo-finder/backend

export PORT=3002

echo "📁 Working directory: $(pwd)"
echo "🔢 Port: $PORT"
echo ""

node server.js
