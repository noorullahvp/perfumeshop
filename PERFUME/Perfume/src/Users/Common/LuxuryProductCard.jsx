import React from "react";

const LuxuryProductCard = ({ 
  product, 
  navigate, 
  onAddToCart, 
  onAddToWishlist, 
  onRemoveFromWishlist,
  isWishlistItem 
}) => {
  return (
    <div className="group relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 bg-neutral-900 border border-neutral-800">
      <div className="absolute inset-0 w-full h-full transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110">
        <img
          src={product?.imageUrls?.[0] || product?.imageUrl || "https://via.placeholder.com/400x500?text=No+Image"}
          alt={product?.name || "Product"}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
        />
      </div>
      
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent z-10 pointer-events-none transition-all duration-700 group-hover:h-full" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 backdrop-blur-[2px] pointer-events-none" />

      <div className="absolute top-5 left-5 z-20 flex items-center justify-center transform transition-transform duration-500 group-hover:-translate-y-1">
        <div className="px-4 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full shadow-lg">
          <span className="text-amber-400 font-medium tracking-[0.1em] text-sm">
            ₹{product?.price?.toLocaleString() || 0}
          </span>
        </div>
      </div>

      {isWishlistItem ? (
        <button 
          onClick={(e) => { e.stopPropagation(); onRemoveFromWishlist && onRemoveFromWishlist(product); }}
          className="absolute top-5 right-5 z-30 p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-rose-500 hover:bg-neutral-900 transition-all duration-300 transform hover:scale-110 hover:border-rose-500/50 shadow-lg group-hover:-translate-y-1"
          title="Remove from Wishlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ) : (
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToWishlist && onAddToWishlist(product); }}
          className="absolute top-5 right-5 z-30 p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-rose-500 hover:bg-neutral-900 transition-all duration-300 transform hover:scale-110 hover:border-rose-500/50 shadow-lg group-hover:-translate-y-1"
          title="Add to Wishlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      )}

      <div className="absolute inset-0 z-20 cursor-pointer" onClick={() => navigate(`/product/${product?.id}`)} />

      <div className="absolute inset-x-0 bottom-0 z-30 p-6 md:p-8 flex flex-col justify-end text-left pointer-events-none">
        <div className="transform transition-transform duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-4">
          <p className="text-amber-500/90 text-xs font-bold tracking-[0.3em] uppercase mb-3 drop-shadow-md">
            {product?.category || "Signature Scent"}
          </p>
          <h4 className="text-2xl sm:text-3xl font-serif text-white leading-tight drop-shadow-xl line-clamp-2 pr-2 transition-colors duration-300 group-hover:text-amber-50">
            {product?.name}
          </h4>
        </div>

        <div className="grid overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] grid-rows-[0fr] group-hover:grid-rows-[1fr]">
          <div className="min-h-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 flex flex-col">
            <p className="text-neutral-300/90 text-sm mt-4 line-clamp-3 font-light leading-relaxed drop-shadow-md">
              {product?.description || "Experience the sheer extravagance of an artfully crafted fragrance."}
            </p>
            
            <div className="mt-6 flex gap-3 pointer-events-auto w-full">
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/product/${product?.id}`); }}
                className="flex-[0.4] bg-white/10 hover:bg-white text-white hover:text-stone-900 border border-white/20 hover:border-white backdrop-blur-sm py-3.5 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300"
              >
                View
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onAddToCart && onAddToCart(product); }}
                className="flex-[0.6] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-900 border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] py-3.5 rounded-xl text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 overflow-hidden relative"
              >
                <div className="absolute inset-0 -translate-x-full hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-12"></div>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuxuryProductCard;
