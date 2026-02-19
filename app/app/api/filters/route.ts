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

// Get gender counts
function getGenderCounts(deals: any[]) {
  const counts: Record<string, number> = { men: 0, women: 0, kids: 0, unisex: 0 };
  deals.forEach((deal: any) => {
    const gender = deal.gender || 'unisex';
    counts[gender] = (counts[gender] || 0) + 1;
  });
  return counts;
}

export async function GET() {
  try {
    const products = loadProducts();
    const retailers = getRetailerCounts(products);
    const genders = getGenderCounts(products);

    // Get smart category counts
    const smartCategories: Record<string, number> = {};
    products.forEach((deal: any) => {
      if (deal.smartCategories) {
        deal.smartCategories.forEach((cat: string) => {
          smartCategories[cat] = (smartCategories[cat] || 0) + 1;
        });
      }
    });

    // Get smart filter counts
    let bestValueCount = 0, topDealCount = 0, priceDropCount = 0;
    products.forEach((deal: any) => {
      if (deal.bestValue) bestValueCount++;
      if (deal.topDeal) topDealCount++;
      if (deal.priceDrop) priceDropCount++;
    });

    const priceRange = products.length > 0 ? {
      min: Math.min(...products.map((d: any) => d.salePrice)),
      max: Math.max(...products.map((d: any) => d.salePrice))
    } : { min: 0, max: 500 };

    return NextResponse.json({
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
      priceRange
    });
  } catch (error: any) {
    console.error('Error in /api/filters:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
