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

// Get retailer counts
function getRetailerCounts(deals: any[]) {
  const counts: Record<string, number> = {};
  deals.forEach((deal: any) => {
    const retailer = deal.retailer || deal.merchantName || 'Unknown';
    counts[retailer] = (counts[retailer] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function GET() {
  try {
    const products = loadProducts();
    const retailers = getRetailerCounts(products);

    return NextResponse.json({
      success: true,
      count: retailers.length,
      retailers
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
