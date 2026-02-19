'use client';

import React from 'react';

interface LikedProduct {
  id: string;
  name: string;
  brand: string;
  cleanBrand?: string;
  image: string;
  salePrice: number;
  originalPrice: number;
  discount: number;
  affiliateUrl: string;
  url: string;
}

interface LikedProductsProps {
  isOpen: boolean;
  onClose: () => void;
  products: LikedProduct[];
  onRemove: (productId: string) => void;
  onClearAll: () => void;
}

export const LikedProducts: React.FC<LikedProductsProps> = ({
  isOpen,
  onClose,
  products,
  onRemove,
  onClearAll
}) => {
  const handleProductClick = (product: LikedProduct) => {
    const url = product.affiliateUrl || product.url;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40, transition: 'opacity 0.3s' }}
        />
      )}

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100%', zIndex: 50,
        background: '#111', borderLeft: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
        width: '100%', maxWidth: 384,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="20" height="20" fill="#ef4444" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              Liked Products ({products.length})
            </h2>
          </div>
          <button onClick={onClose} style={{ padding: 8, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8 }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ overflowY: 'auto', height: 'calc(100% - 64px - 64px)' }}>
          {products.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 1.5rem', textAlign: 'center' }}>
              <svg width="64" height="64" fill="none" stroke="rgba(255,255,255,0.2)" viewBox="0 0 24 24" style={{ marginBottom: 16 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>No liked products yet</h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.3)' }}>Start swiping to save your favorites!</p>
            </div>
          ) : (
            <div>
              {products.map((product) => (
                <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Thumbnail */}
                  <div onClick={() => handleProductClick(product)} style={{ flexShrink: 0, width: 64, height: 64, borderRadius: 8, overflow: 'hidden', background: '#1a1a1a' }}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  {/* Info */}
                  <div onClick={() => handleProductClick(product)} style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {product.cleanBrand || product.brand}
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {product.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ff6b00' }}>
                        &euro;{product.salePrice.toFixed(2)}
                      </span>
                      {product.discount > 0 && (
                        <span style={{ fontSize: '0.75rem', background: 'rgba(239,68,68,0.2)', color: '#ef4444', padding: '2px 6px', borderRadius: 4, fontWeight: 500 }}>
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Remove */}
                  <button onClick={() => onRemove(product.id)} style={{ flexShrink: 0, padding: 8, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }} title="Remove">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {products.length > 0 && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, borderTop: '1px solid rgba(255,255,255,0.1)', background: '#111' }}>
            <button onClick={onClearAll} style={{ width: '100%', padding: '10px 0', fontSize: '0.875rem', fontWeight: 500, color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </>
  );
};
