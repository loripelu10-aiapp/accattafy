# PromoFinder - Next.js App

A modern web application for discovering the best deals on fashion and sportswear from top brands.

## Features

- 🔍 Search 2,403+ verified deals from Nike, Adidas, Puma, and more
- 🎯 Smart filters: Gender, retailers, price range, discount percentage
- 🏷️ AI-powered tags: Best Value, Top Deal, Price Drop
- 🌍 Multi-language support (English, Italian, Spanish, French, German, Portuguese)
- 📱 Fully responsive design
- ⚡ Built with Next.js 14 for optimal performance

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data**: JSON-based product database
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
app/
├── app/
│   ├── api/             # API routes
│   │   ├── deals/      # GET /api/deals - Product filtering
│   │   ├── filters/    # GET /api/filters - Available filter options
│   │   ├── retailers/  # GET /api/retailers - Retailer counts
│   │   └── stats/      # GET /api/stats - Product statistics
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/
│   └── PromoFinder.tsx # Main component
├── data/
│   └── products.json   # 2,403 verified products
├── public/             # Static assets
├── next.config.js      # Next.js configuration
├── tailwind.config.ts  # Tailwind configuration
└── tsconfig.json       # TypeScript configuration
```

## API Routes

### GET /api/deals

Returns filtered and sorted deals.

**Query Parameters:**
- `search` - Search by product name, brand, or retailer
- `category` - Filter by category (clothing, shoes, accessories)
- `minDiscount` - Minimum discount percentage
- `maxPrice` - Maximum price
- `genders` - Filter by gender (men, women, kids)
- `retailers` - Filter by retailers
- `bestValue` - Show only best value deals
- `topDeal` - Show only top deals
- `priceDrop` - Show only price drops
- `sortBy` - Sort by (relevance, priceLow, priceHigh, discountHigh, newest)

**Example:**
```bash
curl "http://localhost:3000/api/deals?minDiscount=30&sortBy=discountHigh"
```

### GET /api/filters

Returns available filter options (retailers, genders, smart categories, price range).

### GET /api/retailers

Returns list of retailers with product counts.

### GET /api/stats

Returns product statistics (total, by brand, by category, average discount).

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Vercel will auto-detect Next.js and deploy

```bash
# Using Vercel CLI
npm i -g vercel
vercel
```

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Railway
- Render
- AWS Amplify
- DigitalOcean App Platform

## Data Source

Products are stored in `/data/products.json` and include:
- Product name, brand, and retailer
- Sale price and original price
- Discount percentage
- Product image and URL
- AI-detected gender category
- Smart tags (Best Value, Top Deal, Price Drop)

To update products, replace `/data/products.json` and restart the server.

## Features Explained

### Smart Filters

- **Best Value**: Products with high discount AND good price point
- **Top Deal**: Featured deals with exceptional savings
- **Price Drop**: Recently reduced prices

### Gender Detection

AI automatically categorizes products by gender (men, women, kids, unisex) based on product name and description.

### Multi-Language Support

The UI automatically adapts to 6 languages with complete translations of all interface elements.

## Performance

- Static generation for optimal speed
- API routes with built-in caching
- Image optimization via Next.js Image component
- Tailwind CSS for minimal CSS payload

## Contributing

This is a commercial project. Contact the owner for collaboration opportunities.

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact support through the PromoFinder website.
