# 🚀 AI Quick Start Guide

Your OpenRouter API key is configured! Follow these steps to activate AI superpowers.

## ✅ Step 1: Install Dependencies

```bash
cd /Users/lorenzopeluso10/Desktop/promo-finder/backend
npm install axios
```

## ✅ Step 2: Your API Key is Already Set

```env
OPENROUTER_API_KEY=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
```

## ✅ Step 3: Test the AI System

```bash
node scripts/test-ai-system.js
```

Expected output:
```
╔══════════════════════════════════════════════════════╗
║          AI System Test - PromoFinder              ║
╚══════════════════════════════════════════════════════╝

🔑 Checking API Keys...
   groq: ❌ Missing
   openrouter: ✅ Configured
   together: ❌ Missing

📊 Provider Status:
   openrouter:
      Remaining: 1000/1000 requests
      Models: meta-llama/llama-3.3-70b-instruct:free, meta-llama/llama-3.1-8b-instruct:free

🧪 Test 1: Simple LLM Call
   ✅ Success!
   Provider: openrouter
   Model: meta-llama/llama-3.3-70b-instruct:free
   Response: "Hello from AI!"

🧪 Test 2: Product Analysis
   Analyzing: Nike Air Max 270 React
   ✅ Analysis Complete!
   Gender: men
   Category: shoes
   Quality Score: 85/100
   Deal Score: 90/100
   Best Value: Yes
   Top Deal: No
```

## ✅ Step 4: Enhance 10 Products (Test)

```bash
node scripts/ai-enhance-products.js --sample 10
```

## ✅ Step 5: Enhance ALL Products

```bash
node scripts/ai-enhance-products.js
```

This will:
- Analyze all 2,403 products with AI
- Add gender detection
- Calculate deal scores
- Add Best Value and Top Deal tags
- Update products.json automatically

## 📊 What You Have

**Configured Providers:**
- ✅ OpenRouter: 1,000 FREE requests/day
- ⏳ Groq: Get API key at https://console.groq.com/keys (14,400/day - FASTEST)
- ⏳ Together: Get API key at https://api.together.xyz/settings/api-keys (1,000/day)

## 🎯 Recommended: Add Groq (Optional but Recommended)

Groq is 10x faster and has 14x more daily requests:

1. Visit: https://console.groq.com/keys
2. Sign up (free, no credit card)
3. Create API key
4. Add to `/Users/lorenzopeluso10/Desktop/promo-finder/backend/.env`:

```env
GROQ_API_KEY=gsk_your_key_here
```

## 💡 Usage Tips

**Test first:**
```bash
node scripts/ai-enhance-products.js --sample 10
```

**Full enhancement:**
```bash
node scripts/ai-enhance-products.js
```

**Deep analysis (slower but better):**
```bash
node scripts/ai-enhance-products.js --deep
```

**Dry run (no changes):**
```bash
node scripts/ai-enhance-products.js --sample 5 --dry-run
```

## 🔥 AI Features

Your products will get:
- ✨ **AI Gender Detection** (men/women/kids/unisex)
- 🏷️ **Category Classification** (clothing/shoes/accessories)
- ⭐ **Quality Scores** (0-100)
- 🎯 **Deal Scores** (0-100)
- 💎 **Best Value Tags** (automatic)
- 🔥 **Top Deal Tags** (automatic)

## 📚 Full Documentation

- [Complete AI Documentation](./README-AI.md)
- [Detailed Setup Guide](./SETUP-AI.md)

## 🆘 Troubleshooting

**If test fails:**
```bash
cd /Users/lorenzopeluso10/Desktop/promo-finder/backend
npm install axios
node scripts/test-ai-system.js
```

**Check API key:**
```bash
cat .env | grep OPENROUTER
```

## ✅ Next Steps

1. Install axios: `npm install axios`
2. Test AI: `node scripts/test-ai-system.js`
3. Enhance products: `node scripts/ai-enhance-products.js --sample 10`
4. Deploy to production with enhanced products

---

**Your AI system is ready!** 🎉

The system will automatically switch between providers when limits are reached, giving you continuous 24/7 AI processing.
