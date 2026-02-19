export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
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

// Filter deals based on query parameters
function filterDeals(deals: any[], filters: any) {
  let filtered = [...deals];

  // Filter by gender (AI-detected)
  if (filters.genders && filters.genders.length > 0) {
    const genderList = filters.genders.split(',');
    filtered = filtered.filter((deal: any) => genderList.includes(deal.gender));
  }

  // Filter by retailers
  if (filters.retailers && filters.retailers.length > 0) {
    const retailerList = filters.retailers.split(',');
    filtered = filtered.filter((deal: any) =>
      retailerList.includes(deal.retailer) ||
      retailerList.includes(deal.merchantName)
    );
  }

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter((deal: any) => deal.category === filters.category);
  }

  // Filter by smart categories
  if (filters.smartCategories && filters.smartCategories.length > 0) {
    const catList = filters.smartCategories.split(',');
    filtered = filtered.filter((deal: any) =>
      deal.smartCategories && deal.smartCategories.some((c: string) => catList.includes(c))
    );
  }

  // Filter by minimum discount
  if (filters.minDiscount) {
    const minDisc = parseInt(filters.minDiscount);
    filtered = filtered.filter((deal: any) => deal.discount >= minDisc);
  }

  // Filter by price range
  if (filters.minPrice) {
    const minP = parseFloat(filters.minPrice);
    filtered = filtered.filter((deal: any) => deal.salePrice >= minP);
  }
  if (filters.maxPrice) {
    const maxP = parseFloat(filters.maxPrice);
    filtered = filtered.filter((deal: any) => deal.salePrice <= maxP);
  }

  // Filter by brand
  if (filters.brand) {
    const brandLower = filters.brand.toLowerCase();
    filtered = filtered.filter((deal: any) => deal.brand.toLowerCase().includes(brandLower));
  }

  // Smart filters (AI-powered)
  if (filters.bestValue === 'true') {
    filtered = filtered.filter((deal: any) => deal.bestValue === true);
  }
  if (filters.topDeal === 'true') {
    filtered = filtered.filter((deal: any) => deal.topDeal === true);
  }
  if (filters.priceDrop === 'true') {
    filtered = filtered.filter((deal: any) => deal.priceDrop === true);
  }

  // Search by name
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter((deal: any) =>
      deal.name.toLowerCase().includes(searchLower) ||
      deal.brand.toLowerCase().includes(searchLower) ||
      (deal.retailer && deal.retailer.toLowerCase().includes(searchLower))
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
    filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  }

  return filtered;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters = {
      category: searchParams.get('category'),
      minDiscount: searchParams.get('minDiscount'),
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      brand: searchParams.get('brand'),
      search: searchParams.get('search'),
      sortBy: searchParams.get('sortBy'),
      // AI-powered filters
      genders: searchParams.get('genders'),
      retailers: searchParams.get('retailers'),
      smartCategories: searchParams.get('smartCategories'),
      bestValue: searchParams.get('bestValue'),
      topDeal: searchParams.get('topDeal'),
      priceDrop: searchParams.get('priceDrop')
    };

    const products = loadProducts();
    const filteredDeals = filterDeals(products, filters);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10000'); // Return all by default
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDeals = filteredDeals.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      count: filteredDeals.length,
      page,
      limit,
      totalPages: Math.ceil(filteredDeals.length / limit),
      lastUpdated: new Date().toISOString(),
      deals: paginatedDeals
    });
  } catch (error: any) {
    console.error('Error in /api/deals:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch deals',
      message: error.message
    }, { status: 500 });
  }
}
