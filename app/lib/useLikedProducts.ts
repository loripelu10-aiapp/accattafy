'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'accattafy_liked_products';

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

export function useLikedProducts() {
  const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setLikedProducts(JSON.parse(stored));
    } catch { /* empty */ }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(likedProducts));
    }
  }, [likedProducts, isHydrated]);

  const addLike = useCallback((product: LikedProduct) => {
    setLikedProducts(prev => {
      if (prev.some(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeLike = useCallback((productId: string) => {
    setLikedProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const isLiked = useCallback((productId: string) => {
    return likedProducts.some(p => p.id === productId);
  }, [likedProducts]);

  const clearAll = useCallback(() => {
    setLikedProducts([]);
  }, []);

  return { likedProducts, addLike, removeLike, isLiked, clearAll, likedCount: likedProducts.length };
}
