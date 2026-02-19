'use client';

import React from 'react';

interface LikedProduct {
  id: string; name: string; brand: string; cleanBrand?: string; image: string;
  salePrice: number; originalPrice: number; discount: number; affiliateUrl: string; url: string;
}

interface LikedProductsProps {
  isOpen: boolean; onClose: () => void; products: LikedProduct[];
  onRemove: (productId: string) => void; onClearAll: () => void;
}

export const LikedProducts: React.FC<LikedProductsProps> = ({ isOpen, onClose, products, onRemove, onClearAll }) => {
  const handleProductClick = (product: LikedProduct) => {
    const url = product.affiliateUrl || product.url;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {isOpen && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }} />}

      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100%', zIndex: 50,
        background: '#fff', borderLeft: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.08)',
        width: '100%', maxWidth: 380,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" fill="#ff3b30" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#1d1d1f' }}>Saved ({products.length})</h2>
          </div>
          <button onClick={onClose} style={{ padding: 6, color: '#86868b', background: '#f5f5f7', border: 'none', cursor: 'pointer', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {products.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
              <svg width="48" height="48" fill="none" stroke="#ddd" strokeWidth={1.5} viewBox="0 0 24 24" style={{ marginBottom: 16 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1d1d1f', marginBottom: 6 }}>No saved items</h3>
              <p style={{ fontSize: '0.85rem', color: '#86868b' }}>Swipe right or tap the heart to save deals.</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid rgba(0,0,0,0.04)', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <div onClick={() => handleProductClick(product)} style={{ flexShrink: 0, width: 56, height: 56, borderRadius: 10, overflow: 'hidden', background: '#f5f5f7', cursor: 'pointer' }}>
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div onClick={() => handleProductClick(product)} style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
                  <div style={{ fontSize: '0.7rem', color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{product.cleanBrand || product.brand}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 500, color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1d1d1f' }}>&euro;{product.salePrice.toFixed(2)}</span>
                    {product.discount > 0 && <span style={{ fontSize: '0.65rem', background: '#fff0f0', color: '#ff3b30', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>-{product.discount}%</span>}
                  </div>
                </div>
                <button onClick={() => onRemove(product.id)} style={{ flexShrink: 0, padding: 6, color: '#ccc', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6 }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {products.length > 0 && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <button onClick={onClearAll} style={{ width: '100%', padding: '10px 0', fontSize: '0.8rem', fontWeight: 500, color: '#ff3b30', background: '#fff0f0', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>
              Clear All
            </button>
          </div>
        )}
      </div>
    </>
  );
};
