'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { SwipeDiscovery } from './swipe/SwipeDiscovery';
import { LikedProducts } from './swipe/LikedProducts';
import { useLikedProducts } from '../lib/useLikedProducts';

// Product Card
const ProductCard = ({ product, index }: any) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const retailerName = product.retailer || product.merchantName || product.brand || '';
  const discountPercent = product.discountPercentage || product.discount || 0;

  const handleClick = () => {
    const url = product.affiliateUrl || product.url || product.productUrl;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        borderRadius: 16,
        overflow: 'hidden',
        background: '#fff',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 20px 60px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.08)'
          : '0 1px 3px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.06)',
        animationDelay: `${index * 0.03}s`,
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '3/4', background: '#f5f5f7', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!imageError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            quality={90}
            style={{
              objectFit: 'contain',
              padding: 12,
              opacity: imageLoaded ? 1 : 0,
              transition: 'all 0.6s ease',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            priority={index < 4}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '0.85rem' }}>
            {product.brand}
          </div>
        )}

        {/* Discount */}
        {discountPercent > 0 && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: discountPercent >= 50 ? '#ff3b30' : '#1d1d1f',
            color: '#fff', padding: '5px 10px', borderRadius: 8,
            fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.02em'
          }}>
            -{discountPercent}%
          </div>
        )}

        {/* Smart badges */}
        {product.bestValue && (
          <div style={{ position: 'absolute', top: 12, right: 12, background: '#0071e3', color: '#fff', padding: '5px 10px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 600 }}>
            Best Value
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px 16px 20px' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 500, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
          {retailerName}
        </div>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1d1d1f', lineHeight: 1.35, marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {product.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1d1d1f' }}>
            &euro;{product.salePrice.toFixed(2)}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#86868b', textDecoration: 'line-through' }}>
            &euro;{product.originalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function PromoFinder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minDiscount, setMinDiscount] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'swipe'>('grid');
  const [showLikedPanel, setShowLikedPanel] = useState(false);
  const { likedProducts, addLike, removeLike, clearAll, likedCount } = useLikedProducts();

  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedRetailers, setSelectedRetailers] = useState<string[]>([]);
  const [smartFilters, setSmartFilters] = useState({ bestValue: false, topDeal: false, priceDrop: false });
  const [filterOptions, setFilterOptions] = useState<any>({ retailers: [], genders: {}, smartFilters: {} });

  const API_URL = '/api';

  const handleLikeProduct = useCallback((product: any) => {
    addLike({
      id: product.id, name: product.name, brand: product.brand, cleanBrand: product.cleanBrand,
      image: product.image, salePrice: product.salePrice, originalPrice: product.originalPrice,
      discount: product.discountPercentage || product.discount || 0,
      affiliateUrl: product.affiliateUrl || product.url, url: product.url
    });
  }, [addLike]);

  const handleViewDeal = useCallback((product: any) => {
    const url = product.affiliateUrl || product.url || product.productUrl;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const searchDeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (minDiscount > 0) params.append('minDiscount', minDiscount.toString());
      if (priceRange[1] < 500) params.append('maxPrice', priceRange[1].toString());
      if (sortBy !== 'relevance') params.append('sortBy', sortBy);
      if (selectedGenders.length > 0) params.append('genders', selectedGenders.join(','));
      if (selectedRetailers.length > 0) params.append('retailers', selectedRetailers.join(','));
      if (smartFilters.bestValue) params.append('bestValue', 'true');
      if (smartFilters.topDeal) params.append('topDeal', 'true');
      if (smartFilters.priceDrop) params.append('priceDrop', 'true');

      const response = await fetch(`${API_URL}/deals?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.deals || []);
        setLastUpdated(data.lastUpdated ? new Date(data.lastUpdated) : new Date());
      } else throw new Error(data.message || 'Failed to fetch deals');
    } catch (err: any) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch(`${API_URL}/filters`);
        const data = await response.json();
        if (data.success) setFilterOptions({ retailers: data.retailers || [], genders: data.genders || {}, smartFilters: data.smartFilters || {} });
      } catch { /* empty */ }
    };
    fetchFilterOptions();
  }, []);

  useEffect(() => { searchDeals(); }, [selectedCategory, minDiscount, priceRange[1], sortBy, selectedGenders, selectedRetailers, smartFilters]);
  useEffect(() => { const interval = setInterval(() => { if (!loading) searchDeals(); }, 300000); return () => clearInterval(interval); }, [loading]);

  const filteredProducts = products;
  const activeFilterCount = selectedGenders.length + selectedRetailers.length + (smartFilters.bestValue ? 1 : 0) + (smartFilters.topDeal ? 1 : 0) + (smartFilters.priceDrop ? 1 : 0) + (minDiscount > 0 ? 1 : 0) + (selectedCategory !== 'all' ? 1 : 0);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#1d1d1f', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif' }}>

      {/* ===== NAVBAR ===== */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(255,255,255,0.8)', backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '0 max(24px, env(safe-area-inset-left))',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.03em' }}>
            <span style={{ color: '#1d1d1f' }}>acca</span>
            <span style={{ background: 'linear-gradient(135deg, #ff6b00, #ff3b30)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>ttafy</span>
          </div>

          {/* Nav actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* View toggle */}
            <div style={{ display: 'flex', background: '#f5f5f7', borderRadius: 10, padding: 3 }}>
              {(['grid', 'swipe'] as const).map(mode => (
                <button key={mode} onClick={() => setViewMode(mode)} style={{
                  padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontSize: '0.8rem', fontWeight: 500, fontFamily: 'inherit', transition: 'all 0.2s',
                  background: viewMode === mode ? '#fff' : 'transparent',
                  color: viewMode === mode ? '#1d1d1f' : '#86868b',
                  boxShadow: viewMode === mode ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}>
                  {mode === 'grid' ? 'Grid' : 'Swipe'}
                </button>
              ))}
            </div>

            {/* Liked */}
            <button onClick={() => setShowLikedPanel(true)} style={{
              position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 38, height: 38, borderRadius: 10, border: 'none', cursor: 'pointer',
              background: '#f5f5f7', color: '#1d1d1f', transition: 'all 0.2s'
            }}>
              <svg width="18" height="18" fill={likedCount > 0 ? '#ff3b30' : 'none'} stroke={likedCount > 0 ? '#ff3b30' : '#1d1d1f'} strokeWidth={2} viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {likedCount > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, background: '#ff3b30', color: '#fff', borderRadius: 9, padding: '0 4px' }}>
                  {likedCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section style={{
        padding: '80px 24px 60px', textAlign: 'center',
        background: 'linear-gradient(180deg, #fbfbfd 0%, #fff 100%)',
      }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 4rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 16 }}>
          everything on sale.
          <br />
          <span style={{ background: 'linear-gradient(135deg, #ff6b00, #ff3b30)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            just scroll or swipe.
          </span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#86868b', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.5 }}>
          Real-time deals from 20+ retailers. Up to 80% off on fashion, shoes and accessories.
        </p>

        {/* Search */}
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{
            display: 'flex', gap: 8,
            background: '#f5f5f7', borderRadius: 14, padding: 6,
            border: '1px solid rgba(0,0,0,0.06)',
            transition: 'all 0.3s',
          }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 14 }}>
              <svg width="18" height="18" fill="none" stroke="#86868b" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search brands, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchDeals()}
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  fontSize: '0.95rem', color: '#1d1d1f', fontFamily: 'inherit',
                }}
              />
            </div>
            <button
              onClick={searchDeals}
              disabled={loading}
              style={{
                padding: '12px 24px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: '#1d1d1f', color: '#fff', fontWeight: 600, fontSize: '0.9rem',
                fontFamily: 'inherit', transition: 'all 0.2s',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </section>

      {/* ===== FILTERS BAR ===== */}
      <section style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {/* Category pills */}
            {['all', 'clothing', 'shoes', 'accessories'].map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                padding: '7px 16px', borderRadius: 100, border: 'none', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: 500, fontFamily: 'inherit', transition: 'all 0.2s',
                background: selectedCategory === cat ? '#1d1d1f' : '#f5f5f7',
                color: selectedCategory === cat ? '#fff' : '#1d1d1f',
              }}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}

            {/* More filters button */}
            <button onClick={() => setShowFilters(!showFilters)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px', borderRadius: 100, border: '1px solid rgba(0,0,0,0.1)',
              cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, fontFamily: 'inherit',
              background: showFilters ? '#1d1d1f' : '#fff',
              color: showFilters ? '#fff' : '#1d1d1f',
              transition: 'all 0.2s',
            }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span style={{
                  minWidth: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 700, borderRadius: 9, padding: '0 4px',
                  background: showFilters ? '#fff' : '#1d1d1f',
                  color: showFilters ? '#1d1d1f' : '#fff',
                }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.8rem', color: '#86868b' }}>
              <strong style={{ color: '#1d1d1f' }}>{filteredProducts.length}</strong> deals
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '7px 12px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.1)',
                fontSize: '0.8rem', fontFamily: 'inherit', color: '#1d1d1f',
                background: '#fff', cursor: 'pointer', outline: 'none',
              }}
            >
              <option value="relevance">Relevance</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="discountHigh">Biggest Discount</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div style={{
            maxWidth: 1200, margin: '0 auto', padding: '16px 24px 24px',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24,
            borderTop: '1px solid rgba(0,0,0,0.06)',
          }}>
            {/* Gender */}
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Gender</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['men', 'women', 'kids'].map(gender => (
                  <button key={gender} onClick={() => setSelectedGenders(prev => prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender])} style={{
                    padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)',
                    fontSize: '0.8rem', fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.2s',
                    background: selectedGenders.includes(gender) ? '#1d1d1f' : '#fff',
                    color: selectedGenders.includes(gender) ? '#fff' : '#1d1d1f',
                  }}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Retailers */}
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Retailers</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {filterOptions.retailers.slice(0, 6).map((r: any) => (
                  <button key={r.name} onClick={() => setSelectedRetailers(prev => prev.includes(r.name) ? prev.filter(x => x !== r.name) : [...prev, r.name])} style={{
                    padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)',
                    fontSize: '0.8rem', fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.2s',
                    background: selectedRetailers.includes(r.name) ? '#1d1d1f' : '#fff',
                    color: selectedRetailers.includes(r.name) ? '#fff' : '#1d1d1f',
                  }}>
                    {r.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Max Price: &euro;{priceRange[1]}</div>
              <input type="range" min="0" max="500" value={priceRange[1]} onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                style={{ width: '100%', accentColor: '#1d1d1f' }} />
            </div>

            {/* Min Discount */}
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Min Discount: {minDiscount}%</div>
              <input type="range" min="0" max="80" value={minDiscount} onChange={(e) => setMinDiscount(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#1d1d1f' }} />
            </div>

            {/* Active filters */}
            {activeFilterCount > 0 && (
              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '0.75rem', color: '#86868b' }}>Active:</span>
                {selectedGenders.map(g => (
                  <span key={g} onClick={() => setSelectedGenders(prev => prev.filter(x => x !== g))} style={{ padding: '4px 10px', borderRadius: 100, background: '#f5f5f7', fontSize: '0.75rem', cursor: 'pointer' }}>{g} &times;</span>
                ))}
                {selectedRetailers.map(r => (
                  <span key={r} onClick={() => setSelectedRetailers(prev => prev.filter(x => x !== r))} style={{ padding: '4px 10px', borderRadius: 100, background: '#f5f5f7', fontSize: '0.75rem', cursor: 'pointer' }}>{r} &times;</span>
                ))}
                <button onClick={() => { setSelectedGenders([]); setSelectedRetailers([]); setSmartFilters({ bestValue: false, topDeal: false, priceDrop: false }); setMinDiscount(0); setSelectedCategory('all'); }}
                  style={{ padding: '4px 10px', borderRadius: 100, background: 'none', border: '1px solid rgba(0,0,0,0.1)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit', color: '#86868b' }}>
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{
              width: 40, height: 40, border: '3px solid #f5f5f7', borderTopColor: '#1d1d1f',
              borderRadius: '50%', animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ marginTop: 16, color: '#86868b', fontSize: '0.9rem' }}>Finding the best deals...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Swipe Mode */}
        {viewMode === 'swipe' && !loading && (
          <SwipeDiscovery
            products={filteredProducts}
            loading={loading}
            onLike={handleLikeProduct}
            onViewDeal={handleViewDeal}
          />
        )}

        {/* Grid Mode */}
        {viewMode === 'grid' && !loading && filteredProducts.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 20,
          }}>
            {filteredProducts.map((product: any, index: number) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && filteredProducts.length === 0 && viewMode === 'grid' && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>
              <svg width="48" height="48" fill="none" stroke="#ccc" strokeWidth={1.5} viewBox="0 0 24 24" style={{ margin: '0 auto' }}>
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1d1d1f', marginBottom: 8 }}>No deals found</h3>
            <p style={{ color: '#86868b', fontSize: '0.9rem' }}>Try a different search or adjust your filters.</p>
          </div>
        )}
      </main>

      {/* ===== FOOTER ===== */}
      <footer style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', color: '#86868b' }}>
          &copy; 2026 Accattafy. All rights reserved.
        </p>
      </footer>

      {/* Liked Products Panel */}
      <LikedProducts
        isOpen={showLikedPanel}
        onClose={() => setShowLikedPanel(false)}
        products={likedProducts}
        onRemove={removeLike}
        onClearAll={clearAll}
      />
    </div>
  );
}
