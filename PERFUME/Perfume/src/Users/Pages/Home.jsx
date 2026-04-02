import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/ContextPro";
import { CartContext } from "../Context/cartContext";
import axios from "axios";

const LuxuryProductCard = ({ product, navigate, onAddToCart, onAddToWishlist }) => (
  <div className="group relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 bg-neutral-900 border border-neutral-800">
    <div className="absolute inset-0 w-full h-full transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110">
      <img
        src={product.imageUrls?.[0] || "https://via.placeholder.com/400x500?text=No+Image"}
        alt={product.name}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
      />
    </div>
    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent z-10 pointer-events-none transition-all duration-700 group-hover:h-full" />
    <div className="absolute top-5 left-5 z-20 flex items-center justify-center transform transition-transform duration-500 group-hover:-translate-y-1">
      <div className="px-4 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full shadow-lg">
        <span className="text-amber-400 font-medium tracking-[0.1em] text-sm">₹{product.price?.toLocaleString()}</span>
      </div>
    </div>
    <button onClick={(e) => { e.stopPropagation(); onAddToWishlist(product); }} className="absolute top-5 right-5 z-30 p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-rose-500 transition-all duration-300 transform hover:scale-110 shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
    <div className="absolute inset-0 z-20 cursor-pointer" onClick={() => navigate(`/product/${product.id}`)} />
    <div className="absolute inset-x-0 bottom-0 z-30 p-6 md:p-8 flex flex-col justify-end text-left pointer-events-none">
      <div className="transform transition-transform duration-[600ms] group-hover:-translate-y-4">
        <p className="text-amber-500/90 text-xs font-bold tracking-[0.3em] uppercase mb-3">{product.category || "Signature Scent"}</p>
        <h4 className="text-2xl sm:text-3xl font-serif text-white leading-tight line-clamp-2">{product.name}</h4>
      </div>
      <div className="grid overflow-hidden transition-all duration-[600ms] grid-rows-[0fr] group-hover:grid-rows-[1fr]">
        <div className="min-h-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 flex flex-col">
          <p className="text-neutral-300/90 text-sm mt-4 line-clamp-3 font-light leading-relaxed">{product.description}</p>
          <div className="mt-6 flex gap-3 pointer-events-auto w-full">
            <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }} className="flex-[0.4] bg-white/10 hover:bg-white text-white hover:text-stone-900 border border-white/20 py-3.5 rounded-xl text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300">View</button>
            <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} className="flex-[0.6] bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900 py-3.5 rounded-xl text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const HeroSection = ({ navigate }) => {
  const images = [
    { url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2000&auto=format&fit=crop", title: "Elegance Captured", subtitle: "Discover Your Signature Scent" },
    { url: "https://images.unsplash.com/photo-1622618991746-fe6004db3a47?q=80&w=2000&auto=format&fit=crop", title: "Pure Luxury", subtitle: "The Art of Perfumery" },
    { url: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2000&auto=format&fit=crop", title: "Timeless Classics", subtitle: "Find The Perfect Gift" }
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrentIndex((i) => (i + 1) % images.length), 6000);
    return () => clearInterval(timer);
  }, [images.length]);
  return (
    <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-stone-900">
      {images.map((img, idx) => (
        <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <div className="absolute inset-0 bg-cover bg-center transform transition-transform duration-[8000ms]" style={{ backgroundImage: `url(${img.url})`, transform: idx === currentIndex ? "scale(1)" : "scale(1.1)" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/40 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 md:px-12 w-full text-white">
              <span className="tracking-[0.3em] uppercase text-xs mb-6 block">{img.subtitle}</span>
              <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-[1.1]">{img.title}</h1>
              <div className="flex gap-4">
                <button onClick={() => navigate("/products")} className="bg-white text-stone-900 px-8 py-4 uppercase tracking-widest text-xs font-bold">Shop Collection</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, triggerNotification, addToWishlist } = useContext(AppContext);
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const saved = localStorage.getItem("user");
    if (saved) {
      const u = JSON.parse(saved);
      if (u.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
        return;
      }
    }
    const load = async () => {
      try {
        const res = await axios.get("https://perfumeshop-api-noorullah-cydkgsazbdeuf5f2.southindia-01.azurewebsites.net/api/Product");
        setProducts(res.data?.data || res.data || []);
      } catch (err) {
        console.error("❌ Product load error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [navigate]);

  const toAddToCart = async (product) => {
    if (!isLoggedIn) {
      triggerNotification("Please login first", "error");
      return navigate("/login");
    }
    await addToCart(product.id, 1);
    triggerNotification(`Added ${product.name} to cart`, "success");
  };

  const onAddToWishlist = async (product) => {
    if (!isLoggedIn) {
      triggerNotification("Please login", "error");
      return navigate("/login");
    }
    await addToWishlist(product.id);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <HeroSection navigate={navigate} />
      <section className="py-24 px-6 md:px-12 max-w-[90rem] mx-auto">
        <div className="text-center mb-20">
          <h3 className="text-4xl md:text-5xl font-serif mb-8">The Exclusive Collection</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            products.slice(0, 8).map((product) => (
              <LuxuryProductCard key={product.id} product={product} navigate={navigate} onAddToCart={toAddToCart} onAddToWishlist={onAddToWishlist} />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;