'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// Translations
const translations = {
  en: {
    title: 'PROMO',
    titleAccent: 'FINDER',
    subtitle: 'Real-time fashion deals from top brands',
    searchPlaceholder: 'Search brands, styles, products...',
    searchButton: 'Search Deals',
    filters: 'Filters',
    categories: 'Categories',
    all: 'All',
    clothing: 'Clothing',
    shoes: 'Shoes',
    accessories: 'Accessories',
    priceRange: 'Price Range',
    discount: 'Min. Discount',
    brands: 'Brands',
    sortBy: 'Sort By',
    relevance: 'Relevance',
    priceLow: 'Price: Low to High',
    priceHigh: 'Price: High to Low',
    discountHigh: 'Biggest Discount',
    newest: 'Newest',
    results: 'deals found',
    loading: 'Searching for the best deals...',
    viewDeal: 'View Deal',
    off: 'OFF',
    originalPrice: 'Was',
    noResults: 'No deals found. Try a different search.',
    trending: 'Trending Now',
    featuredBrands: 'Featured Brands',
    liveDeals: 'Live Deals',
    lastUpdated: 'Last updated',
    seconds: 'seconds ago',
    language: 'Language'
  },
  it: {
    title: 'PROMO',
    titleAccent: 'FINDER',
    subtitle: 'Offerte moda in tempo reale dai top brand',
    searchPlaceholder: 'Cerca brand, stili, prodotti...',
    searchButton: 'Cerca Offerte',
    filters: 'Filtri',
    categories: 'Categorie',
    all: 'Tutto',
    clothing: 'Abbigliamento',
    shoes: 'Scarpe',
    accessories: 'Accessori',
    priceRange: 'Fascia di Prezzo',
    discount: 'Sconto Min.',
    brands: 'Brand',
    sortBy: 'Ordina Per',
    relevance: 'Rilevanza',
    priceLow: 'Prezzo: Crescente',
    priceHigh: 'Prezzo: Decrescente',
    discountHigh: 'Sconto Maggiore',
    newest: 'Più Recenti',
    results: 'offerte trovate',
    loading: 'Cerco le migliori offerte...',
    viewDeal: 'Vai all\'Offerta',
    off: 'SCONTO',
    originalPrice: 'Era',
    noResults: 'Nessuna offerta trovata. Prova una ricerca diversa.',
    trending: 'Di Tendenza',
    featuredBrands: 'Brand in Evidenza',
    liveDeals: 'Offerte Live',
    lastUpdated: 'Ultimo aggiornamento',
    seconds: 'secondi fa',
    language: 'Lingua'
  },
  es: {
    title: 'PROMO',
    titleAccent: 'FINDER',
    subtitle: 'Ofertas de moda en tiempo real de las mejores marcas',
    searchPlaceholder: 'Buscar marcas, estilos, productos...',
    searchButton: 'Buscar Ofertas',
    filters: 'Filtros',
    categories: 'Categorías',
    all: 'Todo',
    clothing: 'Ropa',
    shoes: 'Zapatos',
    accessories: 'Accesorios',
    priceRange: 'Rango de Precio',
    discount: 'Descuento Mín.',
    brands: 'Marcas',
    sortBy: 'Ordenar Por',
    relevance: 'Relevancia',
    priceLow: 'Precio: Menor a Mayor',
    priceHigh: 'Precio: Mayor a Menor',
    discountHigh: 'Mayor Descuento',
    newest: 'Más Recientes',
    results: 'ofertas encontradas',
    loading: 'Buscando las mejores ofertas...',
    viewDeal: 'Ver Oferta',
    off: 'DESCUENTO',
    originalPrice: 'Antes',
    noResults: 'No se encontraron ofertas. Intenta otra búsqueda.',
    trending: 'Tendencias',
    featuredBrands: 'Marcas Destacadas',
    liveDeals: 'Ofertas en Vivo',
    lastUpdated: 'Última actualización',
    seconds: 'segundos',
    language: 'Idioma'
  },
  fr: {
    title: 'PROMO',
    titleAccent: 'FINDER',
    subtitle: 'Offres mode en temps réel des meilleures marques',
    searchPlaceholder: 'Rechercher marques, styles, produits...',
    searchButton: 'Chercher Offres',
    filters: 'Filtres',
    categories: 'Catégories',
    all: 'Tout',
    clothing: 'Vêtements',
    shoes: 'Chaussures',
    accessories: 'Accessoires',
    priceRange: 'Gamme de Prix',
    discount: 'Remise Min.',
    brands: 'Marques',
    sortBy: 'Trier Par',
    relevance: 'Pertinence',
    priceLow: 'Prix: Croissant',
    priceHigh: 'Prix: Décroissant',
    discountHigh: 'Plus Grande Remise',
    newest: 'Plus Récents',
    results: 'offres trouvées',
    loading: 'Recherche des meilleures offres...',
    viewDeal: 'Voir l\'Offre',
    off: 'REMISE',
    originalPrice: 'Était',
    noResults: 'Aucune offre trouvée. Essayez une autre recherche.',
    trending: 'Tendances',
    featuredBrands: 'Marques Vedettes',
    liveDeals: 'Offres en Direct',
    lastUpdated: 'Dernière mise à jour',
    seconds: 'secondes',
    language: 'Langue'
  },
  de: {
    title: 'PROMO',
    titleAccent: 'FINDER',
    subtitle: 'Mode-Angebote in Echtzeit von Top-Marken',
    searchPlaceholder: 'Marken, Stile, Produkte suchen...',
    searchButton: 'Angebote Suchen',
    filters: 'Filter',
    categories: 'Kategorien',
    all: 'Alle',
    clothing: 'Kleidung',
    shoes: 'Schuhe',
    accessories: 'Accessoires',
    priceRange: 'Preisbereich',
    discount: 'Min. Rabatt',
    brands: 'Marken',
    sortBy: 'Sortieren Nach',
    relevance: 'Relevanz',
    priceLow: 'Preis: Aufsteigend',
    priceHigh: 'Preis: Absteigend',
    discountHigh: 'Größter Rabatt',
    newest: 'Neueste',
    results: 'Angebote gefunden',
    loading: 'Suche nach den besten Angeboten...',
    viewDeal: 'Zum Angebot',
    off: 'RABATT',
    originalPrice: 'War',
    noResults: 'Keine Angebote gefunden. Versuchen Sie eine andere Suche.',
    trending: 'Im Trend',
    featuredBrands: 'Top Marken',
    liveDeals: 'Live Angebote',
    lastUpdated: 'Zuletzt aktualisiert',
    seconds: 'Sekunden',
    language: 'Sprache'
  },
  pt: {
    title: 'PROMO',
    titleAccent: 'FINDER',
    subtitle: 'Ofertas de moda em tempo real das melhores marcas',
    searchPlaceholder: 'Pesquisar marcas, estilos, produtos...',
    searchButton: 'Buscar Ofertas',
    filters: 'Filtros',
    categories: 'Categorias',
    all: 'Tudo',
    clothing: 'Roupas',
    shoes: 'Sapatos',
    accessories: 'Acessórios',
    priceRange: 'Faixa de Preço',
    discount: 'Desconto Mín.',
    brands: 'Marcas',
    sortBy: 'Ordenar Por',
    relevance: 'Relevância',
    priceLow: 'Preço: Menor para Maior',
    priceHigh: 'Preço: Maior para Menor',
    discountHigh: 'Maior Desconto',
    newest: 'Mais Recentes',
    results: 'ofertas encontradas',
    loading: 'Procurando as melhores ofertas...',
    viewDeal: 'Ver Oferta',
    off: 'DESCONTO',
    originalPrice: 'Era',
    noResults: 'Nenhuma oferta encontrada. Tente outra pesquisa.',
    trending: 'Em Alta',
    featuredBrands: 'Marcas em Destaque',
    liveDeals: 'Ofertas ao Vivo',
    lastUpdated: 'Última atualização',
    seconds: 'segundos',
    language: 'Idioma'
  }
};

const languageFlags = {
  en: '🇬🇧',
  it: '🇮🇹',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  pt: '🇵🇹'
};

const featuredBrands = [
  { name: 'Nike', logo: '✓', color: '#111' },
  { name: 'Adidas', logo: '⦿', color: '#000' },
  { name: 'Zara', logo: 'Z', color: '#1a1a1a' },
  { name: 'H&M', logo: 'H&M', color: '#e50010' },
  { name: 'ASOS', logo: 'A', color: '#2d2d2d' },
  { name: 'Uniqlo', logo: 'U', color: '#ff0000' },
  { name: 'Mango', logo: 'M', color: '#000' },
  { name: 'Pull&Bear', logo: 'P&B', color: '#333' }
];

// Product Card Component
const ProductCard = ({ product, t, index }: any) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Get retailer name from various possible fields
  const retailerName = product.retailer || product.merchantName || product.brand || 'Unknown';

  const handleCardClick = () => {
    const url = product.affiliateUrl || product.url || product.productUrl;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="product-card"
      style={{
        animationDelay: `${index * 0.05}s`,
        cursor: 'pointer'
      }}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image-container">
        <div className={`discount-badge ${product.discount >= 50 ? 'hot' : ''}`}>
          -{product.discount}% {t.off}
        </div>

        {/* Smart Badges - Top Right */}
        <div className="smart-badges">
          {product.bestValue && (
            <div className="smart-badge best-value">Best Value</div>
          )}
          {product.topDeal && !product.bestValue && (
            <div className="smart-badge top-deal">Top Deal</div>
          )}
          {product.priceDrop && (
            <div className="smart-badge price-drop">Price Drop</div>
          )}
        </div>

        {/* Gender Badge - Bottom Left */}
        {product.gender && product.gender !== 'unisex' && (
          <div className={`gender-badge gender-${product.gender}`}>
            {product.gender === 'men' ? 'Men' : product.gender === 'women' ? 'Women' : 'Kids'}
          </div>
        )}

        {!imageError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            quality={90}
            className={`product-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            priority={index < 4}
          />
        ) : (
          <div className="product-image-placeholder">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>{product.brand}</span>
          </div>
        )}
        <div className={`product-overlay ${isHovered ? 'visible' : ''}`}>
          <a
            href={product.affiliateUrl || product.url || product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="view-deal-btn"
          >
            {t.viewDeal}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </a>
        </div>
      </div>
      <div className="product-info">
        <span className="product-brand">{product.brand}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-pricing">
          <span className="current-price">€{product.salePrice.toFixed(2)}</span>
          <span className="original-price">{t.originalPrice} €{product.originalPrice.toFixed(2)}</span>
        </div>
        <div className="product-retailer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <span>{retailerName}</span>
          {product.dealScore && product.dealScore >= 70 && (
            <span className="deal-score">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              {product.dealScore}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function PromoFinder() {
  const [language, setLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minDiscount, setMinDiscount] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // New smart filter states
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedRetailers, setSelectedRetailers] = useState<string[]>([]);
  const [smartFilters, setSmartFilters] = useState({ bestValue: false, topDeal: false, priceDrop: false });
  const [filterOptions, setFilterOptions] = useState<any>({ retailers: [], genders: {}, smartFilters: {} });
  const [showRetailerDropdown, setShowRetailerDropdown] = useState(false);

  const t = translations[language as keyof typeof translations];

  const [error, setError] = useState<string | null>(null);

  // API URL - Next.js API routes
  const API_URL = '/api';

  const searchDeals = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (minDiscount > 0) params.append('minDiscount', minDiscount.toString());
      if (priceRange[1] < 500) params.append('maxPrice', priceRange[1].toString());
      if (sortBy !== 'relevance') params.append('sortBy', sortBy);

      // New smart filters
      if (selectedGenders.length > 0) params.append('genders', selectedGenders.join(','));
      if (selectedRetailers.length > 0) params.append('retailers', selectedRetailers.join(','));
      if (smartFilters.bestValue) params.append('bestValue', 'true');
      if (smartFilters.topDeal) params.append('topDeal', 'true');
      if (smartFilters.priceDrop) params.append('priceDrop', 'true');

      const url = `${API_URL}/deals?${params.toString()}`;
      console.log('Fetching deals from:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setProducts(data.deals || []);
        setLastUpdated(data.lastUpdated ? new Date(data.lastUpdated) : new Date());
      } else {
        throw new Error(data.message || 'Failed to fetch deals');
      }

    } catch (err: any) {
      console.error('Error fetching deals:', err);
      setError(err.message);
      // On error, show empty state instead of crashing
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Products are already filtered by the API
  const filteredProducts = products;

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch(`${API_URL}/filters`);
        const data = await response.json();
        if (data.success) {
          setFilterOptions({
            retailers: data.retailers || [],
            genders: data.genders || {},
            smartFilters: data.smartFilters || {}
          });
        }
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Auto-search on component mount and when filters change
  useEffect(() => {
    searchDeals();
  }, [selectedCategory, minDiscount, priceRange[1], sortBy, selectedGenders, selectedRetailers, smartFilters]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        searchDeals();
      }
    }, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="promo-finder">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .promo-finder {
          min-height: 100vh;
          background: #0a0a0a;
          color: #fff;
          font-family: 'Space Grotesk', sans-serif;
          overflow-x: hidden;
        }

        /* Animated Background */
        .bg-pattern {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(255, 107, 0, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.05) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .noise-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          z-index: 1;
        }

        /* Header */
        .header {
          position: relative;
          z-index: 10;
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .logo {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #fff;
        }

        .logo-accent {
          background: linear-gradient(135deg, #ff6b00, #ff8533);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .language-selector {
          position: relative;
          z-index: 20;
        }

        .language-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.75rem 1rem;
          border-radius: 12px;
          color: #fff;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .language-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
        }

        .language-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          overflow: hidden;
          min-width: 150px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          animation: slideDown 0.2s ease;
          z-index: 50;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .language-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 0.9rem;
        }

        .language-option span {
          pointer-events: none;
        }

        .language-option:hover {
          background: rgba(255,255,255,0.1);
        }

        .language-option.active {
          background: rgba(255, 107, 0, 0.2);
        }

        /* Hero Section */
        .hero {
          position: relative;
          z-index: 10;
          padding: 4rem 2rem;
          text-align: center;
        }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1rem;
          letter-spacing: -0.03em;
        }

        .hero-title span {
          display: block;
          background: linear-gradient(135deg, #ff6b00, #ff8533, #ffa366);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.6);
          max-width: 500px;
          margin: 0 auto 3rem;
        }

        /* Search Box */
        .search-container {
          max-width: 700px;
          margin: 0 auto;
        }

        .search-box {
          display: flex;
          gap: 0.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 0.5rem;
          transition: all 0.3s;
        }

        .search-box:focus-within {
          border-color: rgba(255, 107, 0, 0.5);
          box-shadow: 0 0 0 4px rgba(255, 107, 0, 0.1);
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          padding: 1rem 1.5rem;
          font-size: 1rem;
          color: #fff;
          font-family: inherit;
          outline: none;
        }

        .search-input::placeholder {
          color: rgba(255,255,255,0.4);
        }

        .search-btn {
          background: linear-gradient(135deg, #ff6b00, #ff8533);
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          color: #fff;
          font-family: inherit;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .search-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 107, 0, 0.3);
        }

        .search-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Featured Brands */
        .brands-section {
          position: relative;
          z-index: 10;
          padding: 2rem;
          overflow: hidden;
        }

        .brands-scroll {
          display: flex;
          gap: 1rem;
          animation: scroll 30s linear infinite;
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .brand-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.75rem 1.5rem;
          border-radius: 100px;
          white-space: nowrap;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .brand-logo {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          color: #000;
          border-radius: 50%;
          font-weight: 700;
          font-size: 0.7rem;
        }

        /* Main Content */
        .main-content {
          position: relative;
          z-index: 10;
          padding: 2rem;
          max-width: 1600px;
          margin: 0 auto;
        }

        /* Toolbar */
        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .results-count {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.6);
        }

        .results-count strong {
          color: #ff6b00;
          font-weight: 600;
        }

        .toolbar-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.75rem 1.25rem;
          border-radius: 10px;
          color: #fff;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .filter-toggle:hover {
          background: rgba(255,255,255,0.1);
        }

        .filter-toggle.active {
          background: rgba(255, 107, 0, 0.2);
          border-color: rgba(255, 107, 0, 0.3);
        }

        .sort-select {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.75rem 1.25rem;
          border-radius: 10px;
          color: #fff;
          font-family: inherit;
          font-size: 0.9rem;
          cursor: pointer;
          outline: none;
        }

        .sort-select option {
          background: #1a1a1a;
        }

        /* Filters Panel */
        .filters-panel {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .filter-group h4 {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }

        .category-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .category-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          font-family: inherit;
          font-size: 0.85rem;
          transition: all 0.2s;
        }

        .category-btn:hover {
          background: rgba(255,255,255,0.1);
        }

        .category-btn.active {
          background: #ff6b00;
          border-color: #ff6b00;
          color: #fff;
        }

        .range-slider {
          width: 100%;
        }

        .range-slider input {
          width: 100%;
          accent-color: #ff6b00;
        }

        .range-values {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .product-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s;
          animation: cardAppear 0.5s ease both;
        }

        @keyframes cardAppear {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .product-card:hover {
          border-color: rgba(255, 107, 0, 0.3);
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .product-image-container {
          position: relative;
          aspect-ratio: 1;
          background: #111;
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: all 0.5s;
        }

        .product-image.loaded {
          opacity: 1;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .discount-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: linear-gradient(135deg, #ff6b00, #ff8533);
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          z-index: 2;
        }

        .discount-badge.hot {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .new-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #22d3ee;
          color: #000;
          padding: 0.4rem 0.6rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          z-index: 2;
        }

        .product-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s;
        }

        .product-overlay.visible {
          opacity: 1;
        }

        .view-deal-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #fff;
          color: #000;
          padding: 1rem 1.5rem;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transform: translateY(10px);
          transition: all 0.3s;
        }

        .product-overlay.visible .view-deal-btn {
          transform: translateY(0);
        }

        .view-deal-btn:hover {
          background: #ff6b00;
          color: #fff;
        }

        .product-info {
          padding: 1.25rem;
        }

        .product-brand {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .product-name {
          font-size: 1rem;
          font-weight: 500;
          margin: 0.5rem 0;
          line-height: 1.3;
        }

        .product-pricing {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .current-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ff6b00;
        }

        .original-price {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.4);
          text-decoration: line-through;
        }

        .product-retailer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
        }

        .source-dot {
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Loading State */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 2rem;
        }

        .loader {
          width: 60px;
          height: 60px;
          border: 3px solid rgba(255,255,255,0.1);
          border-top-color: #ff6b00;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          margin-top: 1.5rem;
          color: rgba(255,255,255,0.6);
        }

        /* No Results */
        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          color: rgba(255,255,255,0.5);
        }

        /* Last Updated */
        .last-updated {
          text-align: center;
          padding: 2rem;
          color: rgba(255,255,255,0.3);
          font-size: 0.85rem;
        }

        /* Smart badges */
        .smart-badges {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: flex-end;
          z-index: 2;
        }

        .smart-badge {
          padding: 0.4rem 0.6rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .smart-badge.best-value {
          background: #22d3ee;
          color: #000;
        }

        .smart-badge.top-deal {
          background: #ef4444;
          color: #fff;
        }

        .smart-badge.price-drop {
          background: #10b981;
          color: #fff;
        }

        /* Gender badges */
        .gender-badge {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          padding: 0.4rem 0.6rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          z-index: 2;
        }

        .gender-badge.gender-men {
          background: #3b82f6;
          color: #fff;
        }

        .gender-badge.gender-women {
          background: #ec4899;
          color: #fff;
        }

        .gender-badge.gender-kids {
          background: #f59e0b;
          color: #fff;
        }

        /* Product image placeholder */
        .product-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: rgba(255,255,255,0.3);
        }

        /* Active filters */
        .active-filters-summary {
          grid-column: 1 / -1;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .active-label {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .active-pill {
          background: rgba(255, 107, 0, 0.2);
          border: 1px solid rgba(255, 107, 0, 0.3);
          padding: 0.4rem 0.8rem;
          border-radius: 100px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .active-pill:hover {
          background: rgba(255, 107, 0, 0.3);
        }

        .clear-all-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.4rem 0.8rem;
          border-radius: 100px;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          font-family: inherit;
          font-size: 0.85rem;
          transition: all 0.2s;
        }

        .clear-all-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }

        .count {
          margin-left: 0.25rem;
          opacity: 0.6;
        }

        .deal-score {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #fbbf24;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header {
            padding: 1rem;
          }

          .hero {
            padding: 2rem 1rem;
          }

          .search-box {
            flex-direction: column;
          }

          .search-btn {
            width: 100%;
            justify-content: center;
          }

          .main-content {
            padding: 1rem;
          }

          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .toolbar-actions {
            justify-content: space-between;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1rem;
          }

          .product-info {
            padding: 1rem;
          }

          .product-name {
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="bg-pattern" />
      <div className="noise-overlay" />

      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-text">{t.title}</span>
          <span className="logo-text logo-accent">{t.titleAccent}</span>
        </div>

        <div className="language-selector">
          <button
            className="language-btn"
            onClick={() => {
              console.log('Language button clicked, current state:', showLanguageMenu);
              setShowLanguageMenu(!showLanguageMenu);
            }}
          >
            {languageFlags[language as keyof typeof languageFlags]} {language.toUpperCase()}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
          {showLanguageMenu && (
            <div className="language-menu">
              {Object.keys(translations).map(lang => (
                <div
                  key={lang}
                  className={`language-option ${lang === language ? 'active' : ''}`}
                  onClick={() => {
                    console.log('Language option clicked:', lang);
                    console.log('Current language:', language);
                    setLanguage(lang);
                    setShowLanguageMenu(false);
                  }}
                >
                  <span>{languageFlags[lang as keyof typeof languageFlags]}</span>
                  <span>{lang.toUpperCase()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">
          {t.liveDeals}
          <span>{t.trending}</span>
        </h1>
        <p className="hero-subtitle">{t.subtitle}</p>

        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchDeals()}
            />
            <button
              className="search-btn"
              onClick={searchDeals}
              disabled={loading}
            >
              {loading ? (
                <div className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} />
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                  {t.searchButton}
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Featured Brands Scroll */}
      <section className="brands-section">
        <div className="brands-scroll">
          {[...featuredBrands, ...featuredBrands].map((brand, i) => (
            <div key={i} className="brand-tag">
              <span className="brand-logo" style={{ background: brand.color, color: '#fff' }}>
                {brand.logo}
              </span>
              {brand.name}
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="results-count">
            <strong>{filteredProducts.length}</strong> {t.results}
          </div>
          <div className="toolbar-actions">
            <button
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
              </svg>
              {t.filters}
            </button>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">{t.sortBy}: {t.relevance}</option>
              <option value="priceLow">{t.priceLow}</option>
              <option value="priceHigh">{t.priceHigh}</option>
              <option value="discountHigh">{t.discountHigh}</option>
              <option value="newest">{t.newest}</option>
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            {/* Gender Filter */}
            <div className="filter-group">
              <h4>Gender</h4>
              <div className="category-buttons">
                {['men', 'women', 'kids'].map(gender => (
                  <button
                    key={gender}
                    className={`category-btn ${selectedGenders.includes(gender) ? 'active' : ''}`}
                    onClick={() => {
                      if (selectedGenders.includes(gender)) {
                        setSelectedGenders(selectedGenders.filter(g => g !== gender));
                      } else {
                        setSelectedGenders([...selectedGenders, gender]);
                      }
                    }}
                  >
                    {gender === 'men' ? 'Men' : gender === 'women' ? 'Women' : 'Kids'}
                    {filterOptions.genders[gender] > 0 && (
                      <span className="count">({filterOptions.genders[gender]})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Retailer Filter */}
            <div className="filter-group">
              <h4>Retailers</h4>
              <div className="category-buttons">
                {filterOptions.retailers.slice(0, 8).map((retailer: any) => (
                  <button
                    key={retailer.name}
                    className={`category-btn ${selectedRetailers.includes(retailer.name) ? 'active' : ''}`}
                    onClick={() => {
                      if (selectedRetailers.includes(retailer.name)) {
                        setSelectedRetailers(selectedRetailers.filter(r => r !== retailer.name));
                      } else {
                        setSelectedRetailers([...selectedRetailers, retailer.name]);
                      }
                    }}
                  >
                    {retailer.name}
                    <span className="count">({retailer.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Filters */}
            <div className="filter-group">
              <h4>Smart Filters</h4>
              <div className="category-buttons">
                <button
                  className={`category-btn ${smartFilters.bestValue ? 'active' : ''}`}
                  onClick={() => setSmartFilters({...smartFilters, bestValue: !smartFilters.bestValue})}
                >
                  💎 Best Value
                  {filterOptions.smartFilters?.bestValue > 0 && (
                    <span className="count">({filterOptions.smartFilters.bestValue})</span>
                  )}
                </button>
                <button
                  className={`category-btn ${smartFilters.topDeal ? 'active' : ''}`}
                  onClick={() => setSmartFilters({...smartFilters, topDeal: !smartFilters.topDeal})}
                >
                  🔥 Top Deal
                  {filterOptions.smartFilters?.topDeal > 0 && (
                    <span className="count">({filterOptions.smartFilters.topDeal})</span>
                  )}
                </button>
                <button
                  className={`category-btn ${smartFilters.priceDrop ? 'active' : ''}`}
                  onClick={() => setSmartFilters({...smartFilters, priceDrop: !smartFilters.priceDrop})}
                >
                  📉 Price Drop
                  {filterOptions.smartFilters?.priceDrop > 0 && (
                    <span className="count">({filterOptions.smartFilters.priceDrop})</span>
                  )}
                </button>
              </div>
            </div>

            <div className="filter-group">
              <h4>{t.categories}</h4>
              <div className="category-buttons">
                {['all', 'clothing', 'shoes', 'accessories'].map(cat => (
                  <button
                    key={cat}
                    className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {t[cat as keyof typeof t] as string}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>{t.priceRange}</h4>
              <div className="range-slider">
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                />
                <div className="range-values">
                  <span>€{priceRange[0]}</span>
                  <span>€{priceRange[1]}</span>
                </div>
              </div>
            </div>

            <div className="filter-group">
              <h4>{t.discount}</h4>
              <div className="range-slider">
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={minDiscount}
                  onChange={(e) => setMinDiscount(parseInt(e.target.value))}
                />
                <div className="range-values">
                  <span>{minDiscount}%+</span>
                </div>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(selectedGenders.length > 0 || selectedRetailers.length > 0 || smartFilters.bestValue || smartFilters.topDeal || smartFilters.priceDrop) && (
              <div className="active-filters-summary">
                <span className="active-label">Active:</span>
                {selectedGenders.map(g => (
                  <span key={g} className="active-pill" onClick={() => setSelectedGenders(selectedGenders.filter(x => x !== g))}>
                    {g} ×
                  </span>
                ))}
                {selectedRetailers.map(r => (
                  <span key={r} className="active-pill" onClick={() => setSelectedRetailers(selectedRetailers.filter(x => x !== r))}>
                    {r} ×
                  </span>
                ))}
                {smartFilters.bestValue && (
                  <span className="active-pill" onClick={() => setSmartFilters({...smartFilters, bestValue: false})}>
                    Best Value ×
                  </span>
                )}
                {smartFilters.topDeal && (
                  <span className="active-pill" onClick={() => setSmartFilters({...smartFilters, topDeal: false})}>
                    Top Deal ×
                  </span>
                )}
                {smartFilters.priceDrop && (
                  <span className="active-pill" onClick={() => setSmartFilters({...smartFilters, priceDrop: false})}>
                    Price Drop ×
                  </span>
                )}
                <button
                  className="clear-all-btn"
                  onClick={() => {
                    setSelectedGenders([]);
                    setSelectedRetailers([]);
                    setSmartFilters({ bestValue: false, topDeal: false, priceDrop: false });
                  }}
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loader" />
            <p className="loading-text">{t.loading}</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="products-grid">
            {filteredProducts.map((product: any, index: number) => (
              <ProductCard
                key={product.id}
                product={product}
                t={t}
                index={index}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredProducts.length === 0 && (
          <div className="no-results">
            <p>{t.noResults}</p>
          </div>
        )}
      </main>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="last-updated">
          {t.lastUpdated}: {Math.floor((Date.now() - lastUpdated.getTime()) / 1000)} {t.seconds}
        </div>
      )}
    </div>
  );
}
