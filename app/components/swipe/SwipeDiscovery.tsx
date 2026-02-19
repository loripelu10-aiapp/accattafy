'use client';

import React, { useState, useRef, useCallback } from 'react';

interface Product {
  id: string; name: string; brand: string; cleanBrand?: string; image: string;
  salePrice: number; originalPrice: number; discount: number; discountPercentage?: number;
  retailer?: string; merchantName?: string; currency?: string; url: string; affiliateUrl?: string;
}

interface SwipeDiscoveryProps {
  products: Product[]; loading: boolean;
  onLike: (product: Product) => void; onViewDeal: (product: Product) => void;
}

export const SwipeDiscovery: React.FC<SwipeDiscoveryProps> = ({ products, loading, onLike, onViewDeal }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deltaX, setDeltaX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exiting, setExiting] = useState<'left' | 'right' | null>(null);
  const startX = useRef(0);

  const currentProduct = products[currentIndex];
  const nextProduct = products[currentIndex + 1];
  const thirdProduct = products[currentIndex + 2];

  const advance = useCallback(() => { setExiting(null); setDeltaX(0); setCurrentIndex(prev => prev + 1); }, []);

  const handleLike = useCallback(() => {
    if (!currentProduct || exiting) return;
    onLike(currentProduct); setExiting('right'); setDeltaX(500); setTimeout(advance, 300);
  }, [currentProduct, exiting, onLike, advance]);

  const handleReject = useCallback(() => {
    if (!currentProduct || exiting) return;
    setExiting('left'); setDeltaX(-500); setTimeout(advance, 300);
  }, [currentProduct, exiting, advance]);

  const handleDragStart = useCallback((x: number) => { setIsDragging(true); startX.current = x; }, []);
  const handleDragMove = useCallback((x: number) => { if (!isDragging) return; setDeltaX(x - startX.current); }, [isDragging]);
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return; setIsDragging(false);
    if (deltaX > 100) handleLike(); else if (deltaX < -100) handleReject(); else setDeltaX(0);
  }, [isDragging, deltaX, handleLike, handleReject]);

  const onMouseDown = useCallback((e: React.MouseEvent) => { e.preventDefault(); handleDragStart(e.clientX); }, [handleDragStart]);
  const onMouseMove = useCallback((e: React.MouseEvent) => handleDragMove(e.clientX), [handleDragMove]);
  const onMouseUp = useCallback(() => handleDragEnd(), [handleDragEnd]);
  const onMouseLeave = useCallback(() => { if (isDragging) handleDragEnd(); }, [isDragging, handleDragEnd]);
  const onTouchStart = useCallback((e: React.TouchEvent) => handleDragStart(e.touches[0].clientX), [handleDragStart]);
  const onTouchMove = useCallback((e: React.TouchEvent) => handleDragMove(e.touches[0].clientX), [handleDragMove]);
  const onTouchEnd = useCallback(() => handleDragEnd(), [handleDragEnd]);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0' }}>
      <div style={{ width: 320, height: 480, background: '#f5f5f7', borderRadius: 20 }} />
    </div>
  );

  if (!currentProduct || currentIndex >= products.length) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', textAlign: 'center' }}>
      <svg width="64" height="64" fill="none" stroke="#ccc" strokeWidth={1.5} viewBox="0 0 24 24" style={{ marginBottom: 20 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1d1d1f', marginBottom: 8 }}>All caught up!</h3>
      <p style={{ color: '#86868b', maxWidth: 360, marginBottom: 24 }}>You&apos;ve seen all available deals. Adjust your filters to discover more.</p>
      <button onClick={() => setCurrentIndex(0)} style={{ padding: '12px 28px', background: '#1d1d1f', color: '#fff', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', fontFamily: 'inherit' }}>
        Start Over
      </button>
    </div>
  );

  const discountPercent = currentProduct.discountPercentage || currentProduct.discount || 0;
  const retailerName = currentProduct.retailer || currentProduct.merchantName || currentProduct.brand || '';
  const likeOpacity = Math.min(Math.max(deltaX / 100, 0), 1);
  const rejectOpacity = Math.min(Math.max(-deltaX / 100, 0), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0' }}>
      <div style={{ marginBottom: 16, fontSize: '0.8rem', color: '#86868b' }}>
        <strong style={{ color: '#1d1d1f' }}>{currentIndex + 1}</strong> of <strong style={{ color: '#1d1d1f' }}>{products.length}</strong>
      </div>

      {/* Card Stack */}
      <div style={{ position: 'relative', width: 320, height: 480 }}>
        {thirdProduct && <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: '#f5f5f7', transform: 'scale(0.9) translateY(20px)', opacity: 0.4 }} />}
        {nextProduct && (
          <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: '#f5f5f7', overflow: 'hidden', transform: 'scale(0.95) translateY(10px)', opacity: 0.6 }}>
            <img src={nextProduct.image} alt="" style={{ width: '100%', height: '75%', objectFit: 'cover' }} draggable={false} />
          </div>
        )}

        {/* Active card */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 20, background: '#fff', overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12), 0 2px 10px rgba(0,0,0,0.06)',
          cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none',
          transform: `translateX(${deltaX}px) rotate(${deltaX * 0.06}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease', zIndex: 10,
        }}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        >
          <div style={{ position: 'relative', height: '72%', background: '#f5f5f7', overflow: 'hidden' }}>
            <img src={currentProduct.image} alt={currentProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />

            {discountPercent > 0 && (
              <div style={{ position: 'absolute', top: 14, left: 14, background: '#1d1d1f', color: '#fff', padding: '5px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600 }}>
                -{discountPercent}%
              </div>
            )}

            {/* LIKE overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(52,199,89,0.15)', border: '4px solid #34c759', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: likeOpacity, transition: 'opacity 0.1s' }}>
              <div style={{ background: '#34c759', color: '#fff', padding: '12px 28px', borderRadius: 14, fontSize: '1.4rem', fontWeight: 800, transform: 'rotate(-12deg)', letterSpacing: '0.05em' }}>LIKE</div>
            </div>

            {/* NOPE overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,59,48,0.15)', border: '4px solid #ff3b30', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: rejectOpacity, transition: 'opacity 0.1s' }}>
              <div style={{ background: '#ff3b30', color: '#fff', padding: '12px 28px', borderRadius: 14, fontSize: '1.4rem', fontWeight: 800, transform: 'rotate(12deg)', letterSpacing: '0.05em' }}>NOPE</div>
            </div>
          </div>

          <div style={{ padding: '14px 18px', height: '28%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 500, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{retailerName}</div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1d1d1f', marginTop: 4, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{currentProduct.name}</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1d1d1f' }}>&euro;{currentProduct.salePrice.toFixed(2)}</span>
              <span style={{ fontSize: '0.8rem', color: '#86868b', textDecoration: 'line-through' }}>&euro;{currentProduct.originalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 28 }}>
        <button onClick={handleReject} style={{ width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid #ff3b30', background: '#fff', color: '#ff3b30', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(255,59,48,0.15)' }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <button onClick={() => onViewDeal(currentProduct)} style={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid #0071e3', background: '#fff', color: '#0071e3', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,113,227,0.15)' }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </button>
        <button onClick={handleLike} style={{ width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid #34c759', background: '#fff', color: '#34c759', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(52,199,89,0.15)' }}>
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
        </button>
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: '0.7rem', color: '#86868b' }}>
        <span>&#8592; Reject</span><span>&#8594; Like</span>
      </div>
    </div>
  );
};
