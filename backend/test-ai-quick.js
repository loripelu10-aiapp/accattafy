const axios = require('axios');
require('dotenv').config();

console.log('\n🧪 Testing AI System...\n');

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.log('❌ No API key found in .env');
  process.exit(1);
}

console.log('✅ API key loaded:', apiKey.substring(0, 25) + '...');
console.log('✅ Making API call to OpenRouter...\n');

axios.post(
  'https://openrouter.ai/api/v1/chat/completions',
  {
    model: 'meta-llama/llama-3.2-3b-instruct:free',
    messages: [
      { role: 'system', content: 'You are helpful.' },
      { role: 'user', content: 'Say "Hello from AI!" in exactly 3 words' }
    ],
    max_tokens: 20,
    temperature: 0.1
  },
  {
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://promofinder.app',
      'X-Title': 'PromoFinder'
    },
    timeout: 30000
  }
).then(response => {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║              ✅ AI TEST SUCCESSFUL!                 ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');
  console.log('Provider: OpenRouter (FREE)');
  console.log('Model:', response.data.model);
  console.log('Response:', response.data.choices[0].message.content);
  console.log('Tokens used:', response.data.usage.total_tokens);
  console.log('📊 Daily Limit: 1,000 requests/day');
  console.log('\n✅ Your AI system is working!\n');
  console.log('Next steps:');
  console.log('  1. Test with sample: node scripts/ai-enhance-products.js --sample 5');
  console.log('  2. Enhance all products: node scripts/ai-enhance-products.js\n');
  process.exit(0);
}).catch(error => {
  console.log('\n❌ API Call Failed:');
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Error:', JSON.stringify(error.response.data, null, 2));
  } else {
    console.log('Error:', error.message);
  }
  console.log('\nTroubleshooting:');
  console.log('  - Check API key is correct in .env');
  console.log('  - Visit https://openrouter.ai/keys to verify key');
  console.log('  - Check internet connection\n');
  process.exit(1);
});
