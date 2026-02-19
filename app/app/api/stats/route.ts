import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Products file path
const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');

// Load products from file
function loadProducts() {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

export async function GET() {
  try {
    const products = loadProducts();

    const stats = {
      totalProducts: products.length,
      lastUpdated: new Date().toISOString(),
      byBrand: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      avgDiscount: 0
    };

    // Calculate stats
    let totalDiscount = 0;
    products.forEach((deal: any) => {
      // By brand/merchant
      const brand = deal.merchantName || deal.brand || 'Unknown';
      stats.byBrand[brand] = (stats.byBrand[brand] || 0) + 1;

      // By category
      stats.byCategory[deal.category] = (stats.byCategory[deal.category] || 0) + 1;

      // Total discount
      totalDiscount += deal.discount || 0;
    });

    stats.avgDiscount = products.length > 0
      ? Math.round(totalDiscount / products.length)
      : 0;

    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}
