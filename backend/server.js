const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import affiliate tracking
const { trackProducts } = require('./services/affiliate-tracker');

const app = express();
const PORT = process.env.PORT || 3001;

// Products file path - our scraped products
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize cache
let dealsCache = {
  data: [],
  lastUpdated: null,
  isRefreshing: false
};

// Load products from data/products.json on startup
function loadCache() {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
      const products = JSON.parse(data);
      dealsCache.data = products;
      dealsCache.lastUpdated = new Date().toISOString();
      console.log(`📦 Loaded ${products.length} products from data/products.json`);
    } else {
      console.log('⚠️ No products.json found, starting with empty data');
    }
  } catch (error) {
    console.error('❌ Error loading products:', error.message);
  }
}

// Reload products from file
function reloadProducts() {
  console.log('🔄 Reloading products from data/products.json...');
  loadCache();
  console.log(`✅ Loaded ${dealsCache.data.length} products`);
  return dealsCache.data;
}

// Filter deals based on query parameters
function filterDeals(deals, filters) {
  let filtered = [...deals];

  // Filter by gender (AI-detected)
  if (filters.genders && filters.genders.length > 0) {
    const genderList = filters.genders.split(',');
    filtered = filtered.filter(deal => genderList.includes(deal.gender));
  }

  // Filter by retailers/brands
  if (filters.retailers && filters.retailers.length > 0) {
    const retailerList = filters.retailers.split(',').map(r => r.toLowerCase());
    filtered = filtered.filter(deal => {
      const retailer = (deal.retailer || '').toLowerCase();
      const merchant = (deal.merchantName || '').toLowerCase();
      const cleanBrand = (deal.cleanBrand || '').toLowerCase();
      const brand = (deal.brand || '').toLowerCase();
      return retailerList.some(r =>
        retailer === r || merchant === r || cleanBrand === r || brand === r
      );
    });
  }

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(deal => deal.category === filters.category);
  }

  // Filter by smart categories
  if (filters.smartCategories && filters.smartCategories.length > 0) {
    const catList = filters.smartCategories.split(',');
    filtered = filtered.filter(deal =>
      deal.smartCategories && deal.smartCategories.some(c => catList.includes(c))
    );
  }

  // Filter by minimum discount
  if (filters.minDiscount) {
    const minDisc = parseInt(filters.minDiscount);
    filtered = filtered.filter(deal => deal.discount >= minDisc);
  }

  // Filter by price range
  if (filters.minPrice) {
    const minP = parseFloat(filters.minPrice);
    filtered = filtered.filter(deal => deal.salePrice >= minP);
  }
  if (filters.maxPrice) {
    const maxP = parseFloat(filters.maxPrice);
    filtered = filtered.filter(deal => deal.salePrice <= maxP);
  }

  // Filter by brand
  if (filters.brand) {
    const brandLower = filters.brand.toLowerCase();
    filtered = filtered.filter(deal => deal.brand.toLowerCase().includes(brandLower));
  }

  // Filter by productType (enriched)
  if (filters.productType && filters.productType !== 'all') {
    filtered = filtered.filter(deal => deal.productType === filters.productType);
  }

  // Filter by style (enriched)
  if (filters.style && filters.style !== 'all') {
    filtered = filtered.filter(deal => deal.style === filters.style);
  }

  // Smart filters (AI-powered)
  if (filters.bestValue === 'true') {
    filtered = filtered.filter(deal => deal.bestValue === true);
  }
  if (filters.topDeal === 'true') {
    filtered = filtered.filter(deal => deal.topDeal === true);
  }
  if (filters.priceDrop === 'true') {
    filtered = filtered.filter(deal => deal.priceDrop === true);
  }

  // Search by name
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(deal =>
      deal.name.toLowerCase().includes(searchLower) ||
      deal.brand.toLowerCase().includes(searchLower) ||
      (deal.cleanBrand && deal.cleanBrand.toLowerCase().includes(searchLower)) ||
      (deal.retailer && deal.retailer.toLowerCase().includes(searchLower)) ||
      (deal.tags && deal.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  }

  // Sort
  const sortBy = filters.sortBy || 'relevance';
  if (sortBy === 'priceLow') {
    filtered.sort((a, b) => a.salePrice - b.salePrice);
  } else if (sortBy === 'priceHigh') {
    filtered.sort((a, b) => b.salePrice - a.salePrice);
  } else if (sortBy === 'discountHigh') {
    filtered.sort((a, b) => b.discount - a.discount);
  } else if (sortBy === 'dealScore') {
    filtered.sort((a, b) => (b.dealScore || 0) - (a.dealScore || 0));
  } else if (sortBy === 'newest') {
    filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
  }

  return filtered;
}

// Get retailer counts
function getRetailerCounts(deals) {
  const counts = {};
  deals.forEach(deal => {
    const retailer = deal.retailer || deal.merchantName || 'Unknown';
    counts[retailer] = (counts[retailer] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// Get gender counts
function getGenderCounts(deals) {
  const counts = { men: 0, women: 0, kids: 0, unisex: 0 };
  deals.forEach(deal => {
    const gender = deal.gender || 'unisex';
    counts[gender] = (counts[gender] || 0) + 1;
  });
  return counts;
}

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PromoFinder API is running',
    version: '1.0.0',
    endpoints: {
      deals: '/api/deals',
      refresh: '/api/deals/refresh',
      stats: '/api/stats',
      faq: '/api/faq',
      schema: '/api/schema',
      sitemap: '/sitemap.xml',
      llms: '/llms.txt'
    }
  });
});

// Get deals with filters
app.get('/api/deals', (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      minDiscount: req.query.minDiscount,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      brand: req.query.brand,
      search: req.query.search,
      sortBy: req.query.sortBy,
      // New AI-powered filters
      genders: req.query.genders,
      retailers: req.query.retailers,
      smartCategories: req.query.smartCategories,
      bestValue: req.query.bestValue,
      topDeal: req.query.topDeal,
      priceDrop: req.query.priceDrop,
      // Enriched filters
      productType: req.query.productType,
      style: req.query.style
    };

    const filteredDeals = filterDeals(dealsCache.data, filters);

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10000; // Return all products by default
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDeals = filteredDeals.slice(startIndex, endIndex);

    // Add affiliate tracking to all product URLs
    const trackedDeals = trackProducts(paginatedDeals);

    // Build ItemList schema for SEO
    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "numberOfItems": filteredDeals.length,
      "itemListElement": trackedDeals.slice(0, 50).map((deal, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": deal.name,
          "brand": {
            "@type": "Brand",
            "name": deal.brand || deal.merchantName
          },
          "image": deal.image || deal.imageUrl,
          "url": deal.affiliateUrl || deal.url || deal.productUrl,
          "offers": {
            "@type": "Offer",
            "price": deal.salePrice,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": deal.retailer || deal.merchantName
            }
          }
        }
      }))
    };

    res.json({
      success: true,
      count: filteredDeals.length,
      page,
      limit,
      totalPages: Math.ceil(filteredDeals.length / limit),
      lastUpdated: dealsCache.lastUpdated,
      deals: trackedDeals,
      schema: itemListSchema
    });
  } catch (error) {
    console.error('Error in /api/deals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch deals',
      message: error.message
    });
  }
});

// Get available retailers with counts
app.get('/api/retailers', (req, res) => {
  try {
    const retailers = getRetailerCounts(dealsCache.data);
    res.json({
      success: true,
      count: retailers.length,
      retailers
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get filter options (retailers, genders, categories)
app.get('/api/filters', (req, res) => {
  try {
    const retailers = getRetailerCounts(dealsCache.data);
    const genders = getGenderCounts(dealsCache.data);

    // Get smart category counts
    const smartCategories = {};
    dealsCache.data.forEach(deal => {
      if (deal.smartCategories) {
        deal.smartCategories.forEach(cat => {
          smartCategories[cat] = (smartCategories[cat] || 0) + 1;
        });
      }
    });

    // Get smart filter counts
    let bestValueCount = 0, topDealCount = 0, priceDropCount = 0;
    dealsCache.data.forEach(deal => {
      if (deal.bestValue) bestValueCount++;
      if (deal.topDeal) topDealCount++;
      if (deal.priceDrop) priceDropCount++;
    });

    // Get productType counts
    const productTypes = {};
    dealsCache.data.forEach(deal => {
      if (deal.productType) {
        productTypes[deal.productType] = (productTypes[deal.productType] || 0) + 1;
      }
    });

    // Get style counts
    const styles = {};
    dealsCache.data.forEach(deal => {
      if (deal.style) {
        styles[deal.style] = (styles[deal.style] || 0) + 1;
      }
    });

    // Get brand counts (using cleanBrand when available)
    const brands = {};
    dealsCache.data.forEach(deal => {
      const brand = deal.cleanBrand || deal.brand || 'Unknown';
      brands[brand] = (brands[brand] || 0) + 1;
    });

    res.json({
      success: true,
      retailers,
      genders,
      smartCategories: Object.entries(smartCategories)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      smartFilters: {
        bestValue: bestValueCount,
        topDeal: topDealCount,
        priceDrop: priceDropCount
      },
      productTypes: Object.entries(productTypes)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      styles: Object.entries(styles)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      brands: Object.entries(brands)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      priceRange: {
        min: Math.min(...dealsCache.data.map(d => d.salePrice)),
        max: Math.max(...dealsCache.data.map(d => d.salePrice))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reload products from file
app.get('/api/deals/refresh', async (req, res) => {
  try {
    console.log('🔄 Reload requested');
    reloadProducts();
    res.json({
      success: true,
      message: 'Products reloaded',
      count: dealsCache.data.length
    });
  } catch (error) {
    console.error('Error in /api/deals/refresh:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reload products',
      message: error.message
    });
  }
});

// Get statistics
app.get('/api/stats', (req, res) => {
  try {
    const stats = {
      totalProducts: dealsCache.data.length,
      lastUpdated: dealsCache.lastUpdated,
      byBrand: {},
      byCategory: {},
      avgDiscount: 0
    };

    // Calculate stats
    let totalDiscount = 0;
    dealsCache.data.forEach(deal => {
      // By brand/merchant
      const brand = deal.merchantName || deal.brand || 'Unknown';
      stats.byBrand[brand] = (stats.byBrand[brand] || 0) + 1;

      // By category
      stats.byCategory[deal.category] = (stats.byCategory[deal.category] || 0) + 1;

      // Total discount
      totalDiscount += deal.discount || 0;
    });

    stats.avgDiscount = dealsCache.data.length > 0
      ? Math.round(totalDiscount / dealsCache.data.length)
      : 0;

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Shopping Assistant endpoint
app.post('/api/assistant', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // Search products relevant to user query
    const searchTerms = message.toLowerCase();
    const relevantProducts = dealsCache.data
      .filter(p => {
        const text = `${p.name} ${p.brand} ${p.category} ${p.gender || ''} ${p.productType || ''}`.toLowerCase();
        return searchTerms.split(' ').some(term => term.length > 2 && text.includes(term));
      })
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 10);

    // Build context for Claude
    const productContext = relevantProducts.map(p =>
      `- ${p.name} by ${p.brand}: $${p.salePrice} (was $${p.originalPrice}, ${p.discount}% off)`
    ).join('\n');

    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      system: `You are PromoFinder's AI shopping assistant. Help users find the best fashion deals. Be concise and friendly. When recommending products, mention the product name, brand, sale price, and discount. Always suggest specific products from the catalog when available. If no relevant products found, suggest browsing categories. Keep responses under 150 words.`,
      messages: [
        ...history.map(h => ({ role: h.role, content: h.content })),
        {
          role: 'user',
          content: `User asks: "${message}"\n\nAvailable matching products:\n${productContext || 'No exact matches found. Total catalog has ' + dealsCache.data.length + ' products across brands like Nike, Gymshark, Converse, Fashion Nova, Allbirds, etc.'}`
        }
      ]
    });

    res.json({
      success: true,
      message: response.content[0].text,
      products: relevantProducts.slice(0, 5),
      suggestedQueries: ['Best deals today', 'Running shoes under $100', 'Fashion Nova dresses', 'Nike sale']
    });
  } catch (error) {
    console.error('Assistant error:', error);
    res.json({
      success: true,
      message: "I'm having trouble connecting right now. Try browsing our deals or use the search bar to find what you're looking for!",
      products: dealsCache.data.sort((a, b) => b.discount - a.discount).slice(0, 5),
      suggestedQueries: ['Best deals today', 'Running shoes', 'Dresses on sale']
    });
  }
});

// ============================================================
// SEO / AEO / GEO ENDPOINTS
// ============================================================

// GET /sitemap.xml - Dynamic XML sitemap
app.get('/sitemap.xml', (req, res) => {
  const now = new Date().toISOString();
  const brands = [...new Set(dealsCache.data.map(d => d.brand || d.merchantName).filter(Boolean))];
  const categories = [...new Set(dealsCache.data.map(d => d.category).filter(Boolean))];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://promofinder.com/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>`;

  brands.forEach(brand => {
    xml += `
  <url>
    <loc>https://promofinder.com/?brand=${encodeURIComponent(brand)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  categories.forEach(category => {
    xml += `
  <url>
    <loc>https://promofinder.com/?category=${encodeURIComponent(category)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  res.set('Content-Type', 'application/xml');
  res.send(xml);
});

// GET /api/schema - JSON-LD structured data
app.get('/api/schema', (req, res) => {
  const totalProducts = dealsCache.data.length;
  const prices = dealsCache.data.map(d => d.salePrice).filter(p => p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const brands = [...new Set(dealsCache.data.map(d => d.brand || d.merchantName).filter(Boolean))];

  let totalDiscount = 0;
  dealsCache.data.forEach(d => { totalDiscount += d.discount || 0; });
  const avgDiscount = totalProducts > 0 ? Math.round(totalDiscount / totalProducts) : 0;

  res.json({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "PromoFinder",
        "url": "https://promofinder.com",
        "description": "Real-time fashion deals aggregator finding discounted products from 20+ top brands",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://promofinder.com/?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "name": "PromoFinder",
        "url": "https://promofinder.com",
        "logo": "https://promofinder.com/vite.svg",
        "description": "PromoFinder aggregates fashion deals from 20+ top retailers in real-time."
      },
      {
        "@type": "AggregateOffer",
        "itemOffered": {
          "@type": "Product",
          "name": "Fashion Deals Collection"
        },
        "offerCount": totalProducts,
        "lowPrice": minPrice.toFixed(2),
        "highPrice": maxPrice.toFixed(2),
        "priceCurrency": "USD",
        "seller": {
          "@type": "Organization",
          "name": "PromoFinder"
        },
        "description": `${totalProducts} discounted fashion products from ${brands.length} brands. Average ${avgDiscount}% off retail prices.`
      }
    ]
  });
});

// GET /api/faq - FAQ data for AEO (Answer Engine Optimization)
app.get('/api/faq', (req, res) => {
  const totalProducts = dealsCache.data.length;
  const brands = [...new Set(dealsCache.data.map(d => d.brand || d.merchantName).filter(Boolean))];
  let totalDiscount = 0;
  dealsCache.data.forEach(d => { totalDiscount += d.discount || 0; });
  const avgDiscount = totalProducts > 0 ? Math.round(totalDiscount / totalProducts) : 0;

  const topBrands = brands.slice(0, 5).join(', ');
  const moreBrands = brands.length > 7 ? brands.length - 7 : 0;

  res.json({
    faqs: [
      {
        question: "How does PromoFinder find deals?",
        answer: `PromoFinder aggregates sale products from ${brands.length}+ top fashion retailers including ${topBrands}, and more. Our system monitors prices and discounts in real-time to bring you the best deals.`
      },
      {
        question: "Are the deals up to date?",
        answer: "Yes, we refresh our deals multiple times daily to ensure all prices and discounts are current. Each product listing shows when it was last verified."
      },
      {
        question: "How much can I save?",
        answer: `Average savings are ${avgDiscount}% off retail prices, with some deals offering up to 70% off. Our smart filters help you find the best value items.`
      },
      {
        question: "What brands are available?",
        answer: `We feature ${brands.slice(0, 7).join(', ')}, and ${moreBrands}+ more brands across shoes, clothing, accessories, and activewear.`
      },
      {
        question: "Is PromoFinder free to use?",
        answer: "Yes, PromoFinder is completely free to use. We earn a small commission from retailers when you make a purchase through our links, at no extra cost to you."
      },
      {
        question: "How do I find the best deals?",
        answer: "Use our smart filters to sort by discount percentage, price range, or brand. You can also use the AI-powered 'Best Value' and 'Top Deal' filters to find items our algorithm identifies as the best deals."
      }
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does PromoFinder find deals?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `PromoFinder aggregates sale products from ${brands.length}+ top fashion retailers including ${topBrands}, and more.`
          }
        },
        {
          "@type": "Question",
          "name": "Are the deals up to date?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we refresh our deals multiple times daily to ensure all prices and discounts are current."
          }
        },
        {
          "@type": "Question",
          "name": "How much can I save?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Average savings are ${avgDiscount}% off retail prices, with some deals offering up to 70% off.`
          }
        },
        {
          "@type": "Question",
          "name": "What brands are available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `We feature ${brands.slice(0, 7).join(', ')}, and ${moreBrands}+ more brands.`
          }
        },
        {
          "@type": "Question",
          "name": "Is PromoFinder free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, PromoFinder is completely free to use."
          }
        }
      ]
    }
  });
});

// GET /llms.txt - LLM-friendly site description for GEO (Generative Engine Optimization)
app.get('/llms.txt', (req, res) => {
  const totalProducts = dealsCache.data.length;
  const brands = [...new Set(dealsCache.data.map(d => d.brand || d.merchantName).filter(Boolean))];
  const categories = [...new Set(dealsCache.data.map(d => d.category).filter(Boolean))];
  let totalDiscount = 0;
  dealsCache.data.forEach(d => { totalDiscount += d.discount || 0; });
  const avgDiscount = totalProducts > 0 ? Math.round(totalDiscount / totalProducts) : 0;

  const text = `# PromoFinder
> Real-time fashion deals aggregator

## What is PromoFinder?
PromoFinder is a fashion deals aggregator that finds and displays discounted products from ${brands.length}+ top retailers including ${brands.slice(0, 7).join(', ')}, and more.

## Features
- Real-time deal tracking from major retailers
- Price comparison across brands
- Filter by brand, gender, category, price range
- AI-powered shopping assistant
- Average ${avgDiscount}% savings on fashion items
- Smart deal scoring and "Best Value" recommendations

## Data
- ${totalProducts}+ active deals
- ${brands.length}+ brands
- Updated multiple times daily
- Categories: ${categories.join(', ')}

## Brands
${brands.map(b => `- ${b}`).join('\n')}

## API
- GET /api/deals - Browse all deals with filters
- GET /api/filters - Get available filter options
- GET /api/stats - Aggregated statistics
- GET /api/faq - Frequently asked questions
- GET /api/schema - JSON-LD structured data
- GET /sitemap.xml - XML sitemap

## Contact
- Website: https://promofinder.com
`;

  res.set('Content-Type', 'text/plain');
  res.send(text);
});

// Start server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 PromoFinder API server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log('');

  // Load products on startup
  loadCache();

  if (dealsCache.data.length > 0) {
    console.log(`✅ Ready to serve ${dealsCache.data.length} products!`);
    console.log('');
  } else {
    console.log('⚠️  No products loaded - run the scrapers first');
    console.log('');
  }
});

module.exports = app;
