import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/ContextPro";
import { CartContext } from "../Context/cartContext";
import api from "../../service/api";

const LuxuryProductCard = ({ product, navigate, onAddToCart, onAddToWishlist }) => (
  <div className="group relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 bg-neutral-900 border border-neutral-800">
    
    {/* Product Image */}
    <div className="absolute inset-0 w-full h-full transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110">
      <img
        src={product.imageUrls?.[0] || "https://via.placeholder.com/400x500?text=No+Image"}
        alt={product.name}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
      />
    </div>

    {/* Elegant Overlays */}
    {/* Permanent bottom gradient for resting text readability */}
    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent z-10 pointer-events-none transition-all duration-700 group-hover:h-full" />
    
    {/* Deep blur overlay on hover for detail focus */}
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 backdrop-blur-[2px] pointer-events-none" />

    {/* Price Tag (Top Left) */}
    <div className="absolute top-5 left-5 z-20 flex items-center justify-center transform transition-transform duration-500 group-hover:-translate-y-1">
      <div className="px-4 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full shadow-lg">
        <span className="text-amber-400 font-medium tracking-[0.1em] text-sm">
          ₹{product.price?.toLocaleString()}
        </span>
      </div>
    </div>

    {/* Wishlist Floating Action (Top Right) */}
    <button 
      onClick={(e) => { e.stopPropagation(); onAddToWishlist(product); }}
      className="absolute top-5 right-5 z-30 p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-rose-500 hover:bg-neutral-900 transition-all duration-300 transform hover:scale-110 hover:border-rose-500/50 shadow-lg group-hover:-translate-y-1"
      title="Add to Wishlist"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>

    {/* Hover Interactive Layer - Entire card click surface */}
    <div 
      className="absolute inset-0 z-20 cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    />

    {/* Content Reveal Container */}
    <div className="absolute inset-x-0 bottom-0 z-30 p-6 md:p-8 flex flex-col justify-end text-left pointer-events-none">
      
      {/* Resting Info (Slides up slightly on hover) */}
      <div className="transform transition-transform duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-4">
        <p className="text-amber-500/90 text-xs font-bold tracking-[0.3em] uppercase mb-3 drop-shadow-md">
          {product.category || "Signature Scent"}
        </p>
        <h4 className="text-2xl sm:text-3xl font-serif text-white leading-tight drop-shadow-xl line-clamp-2 pr-2 transition-colors duration-300 group-hover:text-amber-50">
          {product.name}
        </h4>
      </div>

      {/* Hidden Info (Slides up and fades in on hover) */}
      <div className="grid overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] grid-rows-[0fr] group-hover:grid-rows-[1fr]">
        <div className="min-h-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 flex flex-col">
          <p className="text-neutral-300/90 text-sm mt-4 line-clamp-3 font-light leading-relaxed drop-shadow-md">
            {product.description}
          </p>
          
          <div className="mt-6 flex gap-3 pointer-events-auto w-full">
            {/* View Details Button */}
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
              className="flex-[0.4] bg-white/10 hover:bg-white text-white hover:text-stone-900 border border-white/20 hover:border-white backdrop-blur-sm py-3.5 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300"
            >
              View
            </button>
            {/* Add to Cart Primary Button */}
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="flex-[0.6] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-900 border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] py-3.5 rounded-xl text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 overflow-hidden relative"
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-12"></div>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      
    </div>
  </div>
);

const Products = () => {
  const navigate = useNavigate();
  const { isLoggedIn, triggerNotification, addToWishlist } = useContext(AppContext);
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const res = await api.get("/Product");
        const items = res.data?.data || [];
        setProducts(items.filter((p) => p.isActive));
      } catch (error) {
        triggerNotification("Failed to load products", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [triggerNotification]);

  const onAddToWishlist = async (product) => {
    if (!isLoggedIn) {
      triggerNotification("Please login to manage wishlist.", "error");
      navigate("/login");
      return;
    }
    await addToWishlist(product.id);
  };

  const onAddToCart = async (product) => {
    if (!isLoggedIn) {
      triggerNotification("Please login first to add items to cart.", "error");
      navigate("/login");
      return;
    }
    await addToCart(product.id, 1);
    triggerNotification(`Added ${product.name} to cart 🛒`, "success");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-900 selection:bg-stone-200">
      
      {/* Elegant Header Banner */}
      <div className="relative h-[30vh] min-h-[300px] w-full overflow-hidden bg-stone-900 flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent" />
        <div className="relative z-10 text-center px-4 mt-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 tracking-wide drop-shadow-lg">
            Our Collection
          </h1>
          <div className="w-16 h-[1px] bg-white/50 mx-auto mb-4"></div>
          <p className="text-stone-300 tracking-[0.2em] uppercase text-xs md:text-sm drop-shadow-md">
            Discover Your Signature Fragrance
          </p>
        </div>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 md:px-12 py-16 md:py-24">
        
        {/* Utilities Bar */}
        <div className="flex flex-wrap items-center justify-between mb-12 pb-6 border-b border-stone-200 gap-4">
          <p className="text-stone-500 text-sm font-medium tracking-wide">
            Showing <span className="text-stone-900 font-bold">{loading ? "..." : products.length}</span> Results
          </p>
          <div className="flex gap-4 opacity-50 cursor-not-allowed" title="Coming soon">
             <button className="text-xs tracking-widest uppercase text-stone-500 hover:text-stone-900 transition-colors font-bold flex items-center gap-2">
               Filter 
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
               </svg>
             </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-neutral-900 rounded-[2rem] aspect-[3/4] sm:aspect-[4/5] p-6 md:p-8 border border-neutral-800 flex flex-col justify-end relative shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="relative z-10 w-full flex flex-col gap-4">
                  <div className="h-3 bg-neutral-800 rounded w-1/3 mb-1"></div>
                  <div className="h-6 md:h-8 bg-neutral-800 rounded w-3/4 mb-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-stone-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-2xl font-serif text-stone-900 mb-2">No Fragrances Found</h3>
            <p className="text-stone-500 font-light max-w-md">
              We couldn't find any products matching your criteria at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {products.map((product) => (
              <LuxuryProductCard 
                key={product.id} 
                product={product} 
                navigate={navigate}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
