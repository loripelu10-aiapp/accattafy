'use client';

import React, { useState, useRef, useCallback } from 'react';

interface Product {
  id: string;
  name: string;
  brand: string;
  cleanBrand?: string;
  image: string;
  salePrice: number;
  originalPrice: number;
  discount: number;
  discountPercentage?: number;
  retailer?: string;
  merchantName?: string;
  currency?: string;
  url: string;
  affiliateUrl?: string;
}

interface SwipeDiscoveryProps {
  products: Product[];
  loading: boolean;
  onLike: (product: Product) => void;
  onViewDeal: (product: Product) => void;
}

export const SwipeDiscovery: React.FC<SwipeDiscoveryProps> = ({
  products,
  loading,
  onLike,
  onViewDeal
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deltaX, setDeltaX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exiting, setExiting] = useState<'left' | 'right' | null>(null);
  const startX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentProduct = products[currentIndex];
  const nextProduct = products[currentIndex + 1];
  const thirdProduct = products[currentIndex + 2];

  const advance = useCallback(() => {
    setExiting(null);
    setDeltaX(0);
    setCurrentIndex(prev => prev + 1);
  }, []);

  const handleLike = useCallback(() => {
    if (!currentProduct || exiting) return;
    onLike(currentProduct);
    setExiting('right');
    setDeltaX(500);
    setTimeout(advance, 300);
  }, [currentProduct, exiting, onLike, advance]);

  const handleReject = useCallback(() => {
    if (!currentProduct || exiting) return;
    setExiting('left');
    setDeltaX(-500);
    setTimeout(advance, 300);
  }, [currentProduct, exiting, advance]);

  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true);
    startX.current = clientX;
  }, []);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX.current;
    setDeltaX(diff);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (deltaX > 100) {
      handleLike();
    } else if (deltaX < -100) {
      handleReject();
    } else {
      setDeltaX(0);
    }
  }, [isDragging, deltaX, handleLike, handleReject]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  }, [handleDragStart]);
  const onMouseMove = useCallback((e: React.MouseEvent) => handleDragMove(e.clientX), [handleDragMove]);
  const onMouseUp = useCallback(() => handleDragEnd(), [handleDragEnd]);
  const onMouseLeave = useCallback(() => { if (isDragging) handleDragEnd(); }, [isDragging, handleDragEnd]);
  const onTouchStart = useCallback((e: React.TouchEvent) => handleDragStart(e.touches[0].clientX), [handleDragStart]);
  const onTouchMove = useCallback((e: React.TouchEvent) => handleDragMove(e.touches[0].clientX), [handleDragMove]);
  const onTouchEnd = useCallback(() => handleDragEnd(), [handleDragEnd]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0' }}>
        <div style={{ width: 320, height: 480, background: 'rgba(255,255,255,0.05)', borderRadius: 16, animation: 'pulse 2s infinite' }} />
        <div style={{ marginTop: 24, display: 'flex', gap: 24 }}>
          <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        </div>
      </div>
    );
  }

  if (!currentProduct || currentIndex >= products.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', textAlign: 'center' }}>
        <div style={{ width: 96, height: 96, marginBottom: 24, color: 'rgba(255,255,255,0.3)' }}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: 8 }}>All Done!</h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 400 }}>
          You&apos;ve swiped through all available products. Try adjusting your filters to discover more deals.
        </p>
        <button
          onClick={() => setCurrentIndex(0)}
          style={{ marginTop: 24, padding: '12px 24px', background: '#ff6b00', color: '#fff', fontWeight: 600, borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.95rem' }}
        >
          Start Over
        </button>
      </div>
    );
  }

  const discountPercent = currentProduct.discountPercentage || currentProduct.discount || 0;
  const retailerName = currentProduct.retailer || currentProduct.merchantName || currentProduct.brand || 'Unknown';
  const likeOpacity = Math.min(Math.max(deltaX / 100, 0), 1);
  const rejectOpacity = Math.min(Math.max(-deltaX / 100, 0), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem 0' }}>
      {/* Counter */}
      <div style={{ marginBottom: 16, fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
        <span style={{ fontWeight: 700, color: '#ff6b00' }}>{currentIndex + 1}</span> of{' '}
        <span style={{ fontWeight: 700, color: '#fff' }}>{products.length}</span> products
      </div>

      {/* Card Stack */}
      <div style={{ position: 'relative', width: 320, height: 480 }}>
        {/* Third card */}
        {thirdProduct && (
          <div style={{ position: 'absolute', inset: 0, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', transform: 'scale(0.9) translateY(20px)', opacity: 0.5 }} />
        )}

        {/* Second card */}
        {nextProduct && (
          <div style={{ position: 'absolute', inset: 0, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', transform: 'scale(0.95) translateY(10px)', opacity: 0.7 }}>
            <img src={nextProduct.image} alt="" style={{ width: '100%', height: '75%', objectFit: 'cover' }} draggable={false} />
          </div>
        )}

        {/* Current card */}
        <div
          ref={cardRef}
          style={{
            position: 'absolute', inset: 0, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)', cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none',
            transform: `translateX(${deltaX}px) rotate(${deltaX * 0.08}deg)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease',
            zIndex: 10
          }}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        >
          {/* Product Image */}
          <div style={{ position: 'relative', height: '75%', background: '#111', overflow: 'hidden' }}>
            <img src={currentProduct.image} alt={currentProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />

            {/* Discount badge */}
            {discountPercent > 0 && (
              <div style={{ position: 'absolute', top: 12, left: 12, background: discountPercent >= 50 ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #ff6b00, #ff8533)', padding: '6px 10px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                -{discountPercent}%
              </div>
            )}

            {/* Like overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(34,197,94,0.2)', border: '4px solid #22c55e', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: likeOpacity }}>
              <div style={{ background: '#22c55e', color: '#fff', padding: '12px 24px', borderRadius: 12, fontSize: '1.5rem', fontWeight: 700, transform: 'rotate(-12deg)', border: '4px solid #fff' }}>LIKE</div>
            </div>

            {/* Reject overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(239,68,68,0.2)', border: '4px solid #ef4444', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: rejectOpacity }}>
              <div style={{ background: '#ef4444', color: '#fff', padding: '12px 24px', borderRadius: 12, fontSize: '1.5rem', fontWeight: 700, transform: 'rotate(12deg)', border: '4px solid #fff' }}>NOPE</div>
            </div>
          </div>

          {/* Product Info */}
          <div style={{ padding: 16, height: '25%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {currentProduct.cleanBrand || currentProduct.brand}
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', margin: '4px 0 0', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {currentProduct.name}
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ff6b00' }}>
                  &euro;{currentProduct.salePrice.toFixed(2)}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>
                  &euro;{currentProduct.originalPrice.toFixed(2)}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{retailerName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 32 }}>
        {/* Reject */}
        <button onClick={handleReject} style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '2px solid #ef4444', color: '#ef4444', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#ef4444'; }}
        >
          <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* View Deal */}
        <button onClick={() => onViewDeal(currentProduct)} style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '2px solid #3b82f6', color: '#3b82f6', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#3b82f6'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#3b82f6'; }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </button>

        {/* Like */}
        <button onClick={handleLike} style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '2px solid #22c55e', color: '#22c55e', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#22c55e'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#22c55e'; }}
        >
          <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
        </button>
      </div>

      {/* Keyboard hint */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16, fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
        <span>&#8592; Reject</span>
        <span>&#8594; Like</span>
      </div>
    </div>
  );
};
