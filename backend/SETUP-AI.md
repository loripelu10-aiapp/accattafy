# AI Setup Guide - PromoFinder

Complete guide to setting up FREE AI-powered product analysis.

## 📋 Prerequisites

- Node.js 18+
- PromoFinder backend installed

## 🚀 Quick Start (5 minutes)

### Step 1: Get FREE API Keys

You need at least ONE of these (all free, no credit card):

#### Option 1: Groq (Recommended - Fastest & Highest Limit)
1. Visit https://console.groq.com/keys
2. Sign up with email
3. Create API key
4. Copy the key (starts with `gsk_`)
5. **Daily Limit**: 14,400 requests ⚡

#### Option 2: OpenRouter (Most Models)
1. Visit https://openrouter.ai/keys
2. Sign up with email or GitHub
3. Create API key
4. Copy the key (starts with `sk-or-`)
5. **Daily Limit**: 50-1,000 requests

#### Option 3: Together AI (Backup)
1. Visit https://api.together.xyz/settings/api-keys
2. Sign up
3. Create API key
4. Copy the key
5. **Daily Limit**: ~1,000 requests

### Step 2: Configure Environment

```bash
cd backend

# Copy example file
cp .env.example .env

# Edit .env and add your API keys
nano .env  # or use any text editor
```

Add your keys to `.env`:

```env
# Add at least ONE of these (preferably all three for best reliability)
GROQ_API_KEY=gsk_your_actual_key_here
OPENROUTER_API_KEY=sk-or-your_actual_key_here
TOGETHER_API_KEY=your_actual_key_here
```

### Step 3: Test the System

```bash
# Test AI providers
node scripts/test-ai-system.js
```

You should see:
```
✅ Provider: groq
✅ Analysis Complete!
   Gender: men
   Category: shoes
   Deal Score: 90/100
```

### Step 4: Enhance Your Products

```bash
# Test with 10 products
node scripts/ai-enhance-products.js --sample 10

# If successful, enhance all products
node scripts/ai-enhance-products.js
```

## ✅ What You Get

After setup, your products will have:

- ✨ **AI-detected gender** (men/women/kids/unisex)
- 🏷️ **Accurate categories** (clothing/shoes/accessories)
- ⭐ **Quality scores** (0-100)
- 🎯 **Deal scores** (0-100)
- 💎 **Best Value tags** (automatic)
- 🔥 **Top Deal tags** (automatic)
- 📊 **Feature extraction**

## 📊 Daily Capacity

With all three providers:
- **Total**: 16,400+ FREE requests per day
- **Your 2,403 products**: Can be analyzed 6.8x per day
- **Refresh rate**: Every 3.5 hours if needed

## 💡 Usage Examples

### Basic Enhancement (All Products)
```bash
node scripts/ai-enhance-products.js
```

### Test Sample
```bash
node scripts/ai-enhance-products.js --sample 10
```

### Deep Analysis
```bash
node scripts/ai-enhance-products.js --deep
```

### With Research
```bash
node scripts/ai-enhance-products.js --research
```

### Dry Run (No Changes)
```bash
node scripts/ai-enhance-products.js --sample 5 --dry-run
```

## 🔧 Troubleshooting

### "No API keys found"
**Solution**: Add at least one API key to `.env`

### "All providers reached daily limits"
**Solution**:
- Wait for daily reset (midnight UTC)
- Add more provider API keys
- Reduce batch size

### "Authentication failed"
**Solution**:
- Check API key is correct (no extra spaces)
- Verify API key is active
- Try regenerating the key

### Slow processing
**Solution**:
- Use Groq (fastest provider)
- Reduce `--sample` size
- Skip `--research` flag

## 🎯 Best Practices

1. **Start Small**: Test with `--sample 10` first
2. **Backup First**: Script auto-creates backups
3. **Monitor Usage**: Check provider stats in output
4. **Use Groq First**: Fastest and highest limit
5. **Skip Research**: Saves API calls (enabled by default)

## 📈 Expected Results

After running AI enhancement:

```
📊 Statistics:
   Total Products: 2403
   Successfully Processed: 2395
   Failed: 8
   AI Analyzed: 2395
   Best Value Tags: 327
   Top Deal Tags: 189
   Duration: 12m 34s
```

## 🔐 Security

- API keys stay in `.env` (never commit!)
- `.env` is in `.gitignore`
- Keys are only used server-side
- No data sent to third parties

## 💰 Cost Breakdown

| Provider | Cost | Daily Limit | Speed |
|----------|------|-------------|-------|
| Groq | **FREE** | 14,400 | ⚡⚡⚡ |
| OpenRouter | **FREE** | 1,000 | ⚡⚡ |
| Together | **FREE** | 1,000 | ⚡ |
| **Total** | **$0/day** | **16,400** | ⚡⚡⚡ |

## 📚 Additional Resources

- [Full AI Documentation](./README-AI.md)
- [OpenRouter Free Models](https://openrouter.ai/collections/free-models)
- [Groq API Docs](https://console.groq.com/docs)
- [Together AI Docs](https://docs.together.ai)

## 🆘 Support

If you have issues:
1. Check API key is correct
2. Run test: `node scripts/test-ai-system.js`
3. Check provider status: https://status.groq.com
4. Try different provider

## ✨ Next Steps

Once AI is working:
1. Run full analysis on all products
2. Check the new tags in your app
3. Set up daily cron job for auto-updates
4. Monitor usage in provider dashboards

---

**Ready to go?**

```bash
# 1. Add API keys to .env
# 2. Test the system
node scripts/test-ai-system.js

# 3. Enhance products
node scripts/ai-enhance-products.js --sample 10

# 4. Deploy enhanced products
# (products.json is automatically updated)
```

🎉 Your PromoFinder now has AI superpowers!
