# 💰 Affiliate Marketing Setup Guide for PromoFinder

## Overview

This guide will help you monetize your PromoFinder platform by adding affiliate tracking to product links. When users click your links and make purchases, you'll earn commissions (typically 3-15% of sale value).

---

## 📊 Expected Revenue

With 3,037 products and proper traffic:
- **1,000 clicks/month** → 20-50 purchases → **$200-$800/month**
- **10,000 clicks/month** → 200-500 purchases → **$2,000-$8,000/month**
- **100,000 clicks/month** → 2,000-5,000 purchases → **$20,000-$80,000/month**

*Note: Conversion rates vary by retailer (2-5% typical) and average order value ($50-$200)*

---

## 🎯 Step 1: Join Affiliate Networks

### Rakuten Advertising (Best for Nike, Adidas)

**Sign Up**: https://rakutenadvertising.com/publishers/

**Requirements**:
- Website with traffic (or show your PromoFinder demo)
- Business/Tax information
- Approval takes 1-3 days

**Available Programs**:
- Nike (7-11% commission)
- Adidas (8-12%)
- Under Armour (8%)
- ASOS (6-10%)
- Nordstrom (2-5%)
- Macy's (2-4%)

**After Approval**:
1. Go to "Advertisers" → Search for Nike/Adidas
2. Apply to each program
3. Once approved, note your **Network ID** (found in "Account Settings")

---

### Impact.com (Zappos, New Balance)

**Sign Up**: https://impact.com/publishers/

**Available Programs**:
- Zappos (8-10%)
- 6pm (8-10%)
- New Balance (8%)
- Finish Line (4-6%)

**After Approval**:
1. Browse "Marketplace" to find brands
2. Apply to programs
3. Get your **Partner ID** from account settings

---

### ShareASale (Mid-sized Brands)

**Sign Up**: https://www.shareasale.com/

**Requirements**: Easier approval than Rakuten

**Available Programs**:
- Reebok (8%)
- Converse (5-7%)
- Skechers (8%)
- Puma (7%)

**After Approval**:
1. Search "Merchants" for brands
2. Note your **Affiliate ID**
3. Use their link generator

---

### Commission Junction (CJ)

**Sign Up**: https://www.cj.com/

**Available Programs**:
- JCPenney (2-4%)
- Dick's Sporting Goods (3-5%)

---

## 🔧 Step 2: Configure Affiliate Tracking

### Update Configuration File

Open `/backend/services/affiliate-tracker.js` and replace placeholder IDs:

```javascript
const AFFILIATE_CONFIG = {
  nike: {
    network: 'rakuten',
    affiliateId: '12345678',  // ← YOUR actual Rakuten Network ID
    deepLinkTemplate: 'https://click.linksynergy.com/deeplink?id={affiliateId}&mid=6960&murl={encodedUrl}'
  },
  // ... repeat for each retailer
};
```

### Where to Find Your IDs:

**Rakuten**: Account Settings → Network ID (8-digit number)
**Impact**: Account → Partner ID
**ShareASale**: Account → Affiliate ID
**CJ**: Account → PID (Publisher ID)

---

## 🚀 Step 3: Integrate Into Your Server

### Option A: Add to API Endpoint (Recommended)

Modify `/backend/server.js`:

```javascript
const { trackProducts } = require('./services/affiliate-tracker');

// In your /api/deals endpoint:
app.get('/api/deals', async (req, res) => {
  try {
    // ... existing filter logic ...
    const filteredDeals = filterDeals(dealsCache.data, filters);

    // ADD THIS: Track affiliate links
    const trackedDeals = trackProducts(filteredDeals);

    res.json({
      success: true,
      deals: trackedDeals,  // ← Send tracked deals
      // ... rest of response
    });
  } catch (error) {
    // ... error handling
  }
});
```

### Option B: Track During Scraping

Modify your scrapers to add tracking when saving products:

```javascript
const { trackProduct } = require('./services/affiliate-tracker');

// In your scraper:
const product = {
  name: 'Nike Air Max',
  url: 'https://nike.com/...',
  retailer: 'Nike',
  // ... other fields
};

// Add affiliate tracking before saving
const trackedProduct = trackProduct(product);
// Save trackedProduct to database
```

---

## 📈 Step 4: Test Your Links

### Manual Testing:

1. Start your server
2. Visit http://localhost:3000
3. Click on a Nike product
4. Check the URL in your browser - it should look like:
   ```
   https://click.linksynergy.com/deeplink?id=YOUR_ID&mid=6960&murl=https%3A%2F%2Fwww.nike.com%2F...
   ```

### Verify Tracking:

1. Log into your affiliate network dashboard
2. Check "Reports" → "Clicks"
3. You should see your test click appear (may take 5-10 minutes)

---

## 💡 Step 5: Advanced Features

### A. Cookie Duration Tracking

Different networks have different cookie durations:
- **Nike (Rakuten)**: 7-30 days
- **Amazon**: 24 hours
- **Zappos**: 30 days

Users can purchase within this window and you still earn commission.

### B. Add Subtracking IDs

Track which filters/categories drive the most sales:

```javascript
function addAffiliateTracking(url, retailerName, subId) {
  // ... existing code ...

  // Add subtracking parameter
  const trackedUrl = baseUrl + `&subid=${subId}`;
  // subId could be: 'men-shoes', 'women-clothing', 'best-value'
}
```

### C. Create Commission Reports

```javascript
// backend/routes/analytics.js
app.get('/admin/commissions', async (req, res) => {
  // Fetch data from affiliate network APIs
  const rakutenData = await fetchRakutenStats();
  const impactData = await fetchImpactStats();

  res.json({
    totalClicks: rakutenData.clicks + impactData.clicks,
    totalSales: rakutenData.sales + impactData.sales,
    totalCommissions: rakutenData.commission + impactData.commission
  });
});
```

---

## 📊 Step 6: Monitor Performance

### Track These Metrics:

1. **CTR (Click-Through Rate)**: % of users who click products
   - Target: 15-25%

2. **Conversion Rate**: % of clicks that become purchases
   - Target: 2-5%

3. **EPC (Earnings Per Click)**: Average earnings per click
   - Target: $0.20-$0.80

4. **Average Order Value**: How much users spend
   - Fashion: $50-$150 typical

### Where to View:

- **Rakuten**: Dashboard → Performance Reports
- **Impact**: Reports → Performance
- **ShareASale**: Reports → Transaction Details

---

## ⚠️ Important Notes

### Legal Requirements:

1. **Disclosure**: Add to your website footer:
   ```
   "PromoFinder participates in affiliate programs and may earn
   commissions on purchases made through our links."
   ```

2. **Privacy Policy**: Update to mention affiliate tracking cookies

3. **Terms of Service**: Most networks prohibit:
   - Self-clicking your own links
   - Cookie stuffing
   - Misleading users about prices

### Best Practices:

- ✅ Keep prices accurate and updated
- ✅ Only show products with real discounts
- ✅ Test all links regularly
- ✅ Monitor conversion rates by retailer
- ❌ Never inflate discount percentages
- ❌ Don't click your own affiliate links

---

## 🚀 Next Steps

1. **Today**: Sign up for Rakuten (Nike/Adidas are your top volume)
2. **This Week**: Get approved and add tracking IDs to config
3. **Next Week**: Test thoroughly and monitor first commissions
4. **Month 1**: Apply to additional networks (Impact, ShareASale)
5. **Month 2**: Optimize based on which retailers convert best

---

## 💰 Payment Schedule

**Rakuten**: Monthly (60 days after sale)
**Impact**: Monthly (60 days after sale)
**ShareASale**: Monthly (NET-60)
**CJ**: Monthly (varies by advertiser)

*Example: Sale on January 15th → Payment arrives March 15th*

---

## 🆘 Troubleshooting

### "My clicks aren't showing in dashboard"

- Wait 10-15 minutes for tracking to update
- Clear browser cache and test again
- Verify your affiliate ID is correct
- Check if you're approved for that specific brand

### "Commissions showing but not paid"

- Most networks have 60-day payment delay
- Check minimum payment threshold ($50-$100 typical)
- Verify tax forms are submitted

### "Conversion rate is low"

- Make sure your prices are accurate
- Verify products are actually in stock
- Check if "Best Value" algorithm is working correctly
- Consider removing retailers with poor conversion

---

## 📞 Support Contacts

**Rakuten**: affiliatesupport@rakutenmarketing.com
**Impact**: support@impact.com
**ShareASale**: affiliates@shareasale.com

---

**Questions?** Check each network's FAQ or contact their publisher support teams.

Good luck monetizing your PromoFinder platform! 🚀
