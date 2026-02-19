# 💰 Affiliate Quick Start - Get Paid in 3 Steps

## ✅ What I've Done For You:

1. ✅ Created `/backend/services/affiliate-tracker.js` - Affiliate URL converter
2. ✅ Integrated it into your server - All product links will be tracked
3. ✅ Restarted backend server with tracking enabled

---

## 🚀 What You Need To Do:

### Step 1: Sign Up for Rakuten (15 minutes)

**Why Rakuten First?**
- Covers Nike, Adidas, Under Armour (your top volume products)
- Easy approval process
- 7-12% commissions

**Sign up here**: https://rakutenadvertising.com/publishers/

**Application tips**:
- Website: Use `promofinder.com` or `localhost:3000` for now
- Traffic: Say "New site, 1000+ visitors expected monthly"
- How will you promote?: "Fashion deal aggregator website"

---

### Step 2: Apply for Nike & Adidas Programs (5 minutes)

Once Rakuten approves you (1-3 days):

1. Log into Rakuten dashboard
2. Go to **"Advertisers"** tab
3. Search for **"Nike"** → Click "Apply"
4. Search for **"Adidas"** → Click "Apply"
5. Search for **"Under Armour"** → Click "Apply"

Approval takes 1-7 days.

---

### Step 3: Add Your Affiliate ID (2 minutes)

Once approved by Nike/Adidas:

1. In Rakuten dashboard, go to **Account Settings**
2. Find your **Network ID** (8-digit number like `12345678`)
3. Open `/backend/services/affiliate-tracker.js`
4. Replace `'YOUR_RAKUTEN_ID'` with your actual ID:

```javascript
nike: {
  network: 'rakuten',
  affiliateId: '12345678',  // ← PUT YOUR RAKUTEN ID HERE
  deepLinkTemplate: '...'
},
adidas: {
  network: 'rakuten',
  affiliateId: '12345678',  // ← SAME ID HERE
  deepLinkTemplate: '...'
},
```

5. Restart your backend: `pkill -f "node server.js" && node server.js`

---

## 🎉 That's It! You're Now Earning Commissions

### Test It:

1. Visit http://localhost:3000
2. Click on a Nike product
3. Check the URL - should look like:
   ```
   https://click.linksynergy.com/deeplink?id=YOUR_ID&mid=6960&murl=...
   ```
4. Go to Rakuten dashboard → **Reports** → Check for your test click

---

## 💰 Expected Earnings

### Your Current Setup (3,037 products):

**Conservative Estimate** (1,000 clicks/month):
- Clicks: 1,000
- Conversion Rate: 3%
- Purchases: 30
- Average Order: $80
- Commission: 8%
- **Monthly Earnings: $192**

**Moderate Traffic** (10,000 clicks/month):
- Clicks: 10,000
- Purchases: 300
- **Monthly Earnings: $1,920**

**High Traffic** (100,000 clicks/month):
- Clicks: 100,000
- Purchases: 3,000
- **Monthly Earnings: $19,200**

*Note: Nike/Adidas have higher AOV ($100-$150) and conversion rates (4-5%)*

---

## 📅 When Do You Get Paid?

**Timeline Example**:
- Jan 15: User clicks your link and buys Nike shoes ($120)
- Jan 15: You earn $9.60 commission (8%)
- Feb 15: Nike reports the sale to Rakuten
- **March 15**: You receive payment ($50 minimum)

**Payment Methods**:
- Direct deposit (US banks)
- PayPal
- Check (mail)

---

## 🔥 Next Steps (After Nike/Adidas Working)

### Week 2: Add More Retailers

1. **Impact.com** - For Zappos, 6pm, New Balance
2. **ShareASale** - For Reebok, Converse, Skechers
3. **Commission Junction** - For JCPenney, Dick's Sporting Goods

### Month 2: Optimize

1. Track which retailers convert best
2. Promote high-converting products more
3. Add "Best Commission" filter (show products with highest commission rates)
4. A/B test different product layouts

---

## ⚠️ Important Legal Stuff

### Add Affiliate Disclosure:

Add to your website footer:

```html
<div style="font-size: 12px; color: #666; padding: 20px; text-align: center;">
  PromoFinder participates in affiliate programs including Rakuten Advertising.
  We may earn commissions on purchases made through our links at no extra cost to you.
</div>
```

### Don't Do This:
- ❌ Click your own affiliate links
- ❌ Tell people to click links (let them browse naturally)
- ❌ Fake discount percentages
- ❌ Promote out-of-stock products

### Do This:
- ✅ Keep prices accurate
- ✅ Update products regularly
- ✅ Be transparent about affiliate relationships
- ✅ Provide real value to users

---

## 🆘 Troubleshooting

### "My affiliate ID doesn't work"

Make sure you're using your **Network ID**, not:
- Account ID
- Publisher ID
- User ID

Go to **Account Settings** in Rakuten and look for 8-digit number.

### "Clicks showing but no commissions"

- **Normal!** Only 2-5% of clicks become purchases
- Users have 7-30 days to purchase (cookie duration)
- Check again in a week

### "I can't find my Network ID"

Email Rakuten support: `affiliatesupport@rakutenmarketing.com`

Say: "I need my Network ID for deep linking"

---

## 📊 Track Your Earnings

### Rakuten Dashboard:

- **Reports** → **Performance** → See clicks, sales, commissions
- **Transaction Details** → See individual purchases
- **Payment History** → See past payments

### Your Expected First Payment:

If you start today and get approved in 3 days:
- Week 1: Setup complete, first clicks
- Week 2-3: First sales (maybe 2-5)
- Week 4: More sales (10-20)
- **Month 2**: First payment arrives! (~$50-$200)

---

## 🎯 Goal Timeline

**This Week**: Get approved by Rakuten
**Week 2**: Get approved by Nike & Adidas programs
**Week 3**: Add your affiliate ID and go live
**Week 4**: First sales!
**Month 2**: First payment + expand to more networks
**Month 3**: $500-1000/month revenue
**Month 6**: $2000-5000/month revenue

---

## Questions?

1. Read full guide: `/AFFILIATE_SETUP_GUIDE.md`
2. Rakuten Support: affiliatesupport@rakutenmarketing.com
3. Publisher Help Center: https://rakutenmarketing.com/publisher-help

**Good luck! You're all set to start earning! 🚀💰**
