# PromoFinder AI System

AI-powered product analysis with automatic fallback between multiple free LLM providers.

## Features

- 🤖 **Multi-Provider Support**: Groq, OpenRouter, Together AI
- 🔄 **Automatic Fallback**: Switches providers when limits are reached
- 🎯 **Smart Analysis**: Gender detection, category classification, deal scoring
- 🏷️ **Smart Tagging**: Best Value, Top Deal identification
- 📊 **Usage Tracking**: Monitor API usage across providers
- 💰 **100% FREE**: No payment required (uses free tiers)

## Supported Providers

### 1. Groq (Recommended - Fastest)
- **Daily Limit**: 14,400 requests
- **Speed**: Fastest inference
- **Models**: Llama 3.3 70B, Llama 3.1 8B, Mixtral 8x7B
- **Get API Key**: https://console.groq.com/keys

### 2. OpenRouter
- **Daily Limit**: 50-1,000 requests (depends on credit purchase)
- **Models**: 30+ free models including Llama, Mistral, Gemma
- **Get API Key**: https://openrouter.ai/keys

### 3. Together AI
- **Daily Limit**: ~1,000 requests
- **Models**: Llama 3.1, Mixtral
- **Get API Key**: https://api.together.xyz/settings/api-keys

## Setup

### 1. Get API Keys (All FREE!)

```bash
# Visit these sites and sign up (no credit card required):
# 1. Groq: https://console.groq.com/keys
# 2. OpenRouter: https://openrouter.ai/keys
# 3. Together: https://api.together.xyz/settings/api-keys
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxx
TOGETHER_API_KEY=xxxxxxxxxxxxx
```

### 3. Install Dependencies

```bash
npm install axios dotenv
```

## Usage

### CLI Tool - Enhance Products

```bash
# Enhance all products with AI
node scripts/ai-enhance-products.js

# Test with 10 products
node scripts/ai-enhance-products.js --sample 10

# Deep analysis (slower but more detailed)
node scripts/ai-enhance-products.js --deep

# Include product research
node scripts/ai-enhance-products.js --research

# Dry run (don't save changes)
node scripts/ai-enhance-products.js --dry-run --sample 5
```

### Programmatic Usage

```javascript
const { analyzeProduct } = require('./services/ai/llm-manager');

const product = {
  name: 'Nike Air Max 270',
  brand: 'Nike',
  originalPrice: 150,
  salePrice: 90,
  discount: 40
};

const analysis = await analyzeProduct(product);
console.log(analysis);
// {
//   gender: 'unisex',
//   category: 'shoes',
//   qualityScore: 85,
//   dealScore: 90,
//   bestValue: true,
//   topDeal: false,
//   features: ['Air Max cushioning', 'Lifestyle sneaker']
// }
```

### Batch Processing

```javascript
const { batchProcessProductsWithAI } = require('./services/ai/product-ai-pipeline');

const products = [...]; // Your products array

const result = await batchProcessProductsWithAI(products, {
  concurrency: 3,          // Process 3 at a time
  enableDeepAnalysis: true,
  skipValidation: false,
  skipResearch: true       // Skip expensive research
});

console.log(result.stats);
// {
//   total: 100,
//   processed: 98,
//   failed: 2,
//   bestValue: 25,
//   topDeal: 15,
//   aiAnalyzed: 98
// }
```

## AI Capabilities

### 1. Product Analysis
- Gender detection (men/women/kids/unisex)
- Category classification (clothing/shoes/accessories)
- Quality scoring (0-100)
- Deal scoring (0-100)

### 2. Smart Tagging
- **Best Value**: High discount + Good price + High quality
- **Top Deal**: Exceptional savings
- **Price Drop**: Recently reduced (requires historical data)

### 3. Description Validation
- Checks if description matches product
- Flags suspicious descriptions
- Identifies missing descriptions

### 4. Product Research (Optional)
- Market price comparison
- Current sales status
- Average discounts
- Product ratings

## API Usage Limits

| Provider | Daily Limit | Speed | Best For |
|----------|------------|-------|----------|
| **Groq** | 14,400 | ⚡⚡⚡ Fast | High volume |
| **OpenRouter** | 50-1,000 | ⚡⚡ Medium | Variety of models |
| **Together** | ~1,000 | ⚡ Slower | Backup |

## Automatic Fallback

The system automatically switches providers when:
1. Rate limit reached (429 error)
2. Daily limit exhausted
3. API authentication fails
4. Network errors (retries 3 times)

Example workflow:
```
1. Try Groq (14,400 requests)
   ↓ (limit reached)
2. Try OpenRouter (1,000 requests)
   ↓ (limit reached)
3. Try Together (1,000 requests)
   ↓ (all exhausted)
4. Wait for daily reset
```

## Monitoring Usage

Check current usage:

```javascript
const { getProviderStats } = require('./services/ai/llm-manager');

const stats = getProviderStats();
console.log(stats);
// [
//   {
//     name: 'groq',
//     enabled: true,
//     used: 523,
//     limit: 14400,
//     remaining: 13877,
//     models: ['llama-3.3-70b-versatile', ...]
//   },
//   ...
// ]
```

## Cost Analysis

**Total FREE daily capacity**:
- Groq: 14,400 requests
- OpenRouter: 1,000 requests
- Together: 1,000 requests
- **Total: 16,400 FREE requests per day**

For PromoFinder with 2,403 products:
- **One-time analysis**: ~2,403 requests (1 per product)
- **With current limits**: Can analyze ALL products 6.8x per day
- **Daily refresh**: Can re-analyze products every 3.5 hours

## Best Practices

1. **Start with Groq**: Fastest and highest limit
2. **Use --sample for testing**: Test with small batches first
3. **Skip research by default**: Saves API calls
4. **Batch process**: Process 3-5 products concurrently
5. **Monitor usage**: Check stats regularly
6. **Backup first**: Always backup before batch processing

## Troubleshooting

### "All LLM providers have reached their daily limits"
- Wait for daily reset (midnight UTC)
- Add more API keys
- Reduce batch size

### "Authentication failed"
- Check API key is correct
- Verify API key is active
- Check account status

### Slow performance
- Reduce concurrency
- Use faster models (Groq)
- Skip research step

## Examples

### Quick Analysis (10 products)
```bash
node scripts/ai-enhance-products.js --sample 10
```

### Full Analysis (All products)
```bash
node scripts/ai-enhance-products.js --deep
```

### Test Without Saving
```bash
node scripts/ai-enhance-products.js --sample 5 --dry-run
```

## Sources

- [OpenRouter Free Models](https://openrouter.ai/collections/free-models)
- [Groq API Documentation](https://console.groq.com/docs)
- [Free LLM APIs for 2026](https://visionvix.com/best-free-llm-api/)
- [Together AI Free Tier](https://api.together.xyz)

## License

Proprietary - PromoFinder
