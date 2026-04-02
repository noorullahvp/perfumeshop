import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/ContextPro";
import { CartContext } from "../Context/cartContext";
import { useContext, useEffect, useState, useRef } from "react";
import api from "../../service/api";

// --- Animation Hooks & Components ---
const useScrollReveal = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold });
    
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [threshold]);
  
  return [ref, isVisible];
};

const Reveal = ({ children, direction = "up", delay = 0, className = "" }) => {
  const [ref, isVisible] = useScrollReveal();
  const baseClass = "transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)]";
  
  let translateClass = "";
  if (!isVisible) {
    if (direction === "up") translateClass = "translate-y-16 opacity-0";
    if (direction === "down") translateClass = "-translate-y-16 opacity-0";
    if (direction === "left") translateClass = "-translate-x-16 opacity-0";
    if (direction === "right") translateClass = "translate-x-16 opacity-0";
    if (direction === "none") translateClass = "scale-95 opacity-0";
  } else {
    translateClass = "translate-y-0 translate-x-0 scale-100 opacity-100";
  }
  
  return (
    <div ref={ref} className={`${baseClass} ${translateClass} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

// --- Custom Accordion Component for Aesthetics ---
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-stone-200 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center text-left focus:outline-none group"
      >
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 group-hover:text-amber-600 transition-colors">
          {title}
        </span>
        <span className="text-stone-400 group-hover:text-amber-600 transition-colors">
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 12H4" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-96 opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"}`}
      >
        <div className="text-stone-500 font-light leading-relaxed text-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoggedIn, triggerNotification, addToWishlist } = useContext(AppContext);
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadProduct = async () => {
      try {
        const res = await api.get(`/Product/${id}`);
        setProduct(res.data.data);
      } catch {
        triggerNotification("Product not found", "error");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate, triggerNotification]);

  const onAddToCart = async () => {
    if (!isLoggedIn) {
      triggerNotification("Please login first to interact with cart.", "error");
      navigate("/login");
      return;
    }
    await addToCart(product.id, 1); 
    triggerNotification(`Added ${product.name} to cart 🛒`, "success");
  };

  const onAddToWishlists = async () => {
    if (!isLoggedIn) {
      triggerNotification("Please login first to add to wishlist.", "error");
      navigate("/login");
      return;
    }
    await addToWishlist(product.id);
  };

  // Loading State
  if (loading) return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
      <div className="text-center flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-stone-200 border-t-amber-500 rounded-full animate-spin mb-8"></div>
        <p className="text-xs tracking-[0.3em] uppercase text-stone-500 font-bold animate-pulse">Unveiling Scent</p>
      </div>
    </div>
  );

  // Empty State
  if (!product) return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-5xl font-serif text-stone-900 mb-6">404</h2>
        <p className="text-stone-500 font-light mb-8">The fragrance you are looking for has evaporated.</p>
        <button onClick={() => navigate("/products")} className="border-b border-stone-900 text-stone-900 uppercase tracking-[0.2em] text-xs font-bold pb-1 hover:text-amber-600 transition-colors">
          Return to Collection
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-900 selection:bg-amber-500/30">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12 py-12 md:py-20">
        
        {/* Back Button */}
        <Reveal direction="down" delay={100}>
          <button 
            onClick={() => navigate("/products")} 
            className="group flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-bold text-stone-400 hover:text-stone-900 mb-12 transition-colors"
          >
            <div className="w-8 h-[1px] bg-stone-300 group-hover:w-12 group-hover:bg-stone-900 transition-all duration-300"></div>
            Back to Catalog
          </button>
        </Reveal>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Side: Sticky Image Gallery */}
          <div className="lg:w-1/2">
            <Reveal direction="right" delay={200} className="sticky top-32">
              <div className="aspect-[3/4] bg-neutral-100 rounded-[2rem] overflow-hidden relative group shadow-xl">
                <img
                  src={product.imageUrls?.[0] || "https://via.placeholder.com/600x800?text=No+Image"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-stone-900/5 transition-colors duration-500 group-hover:bg-transparent pointer-events-none"></div>
              </div>
            </Reveal>
          </div>

          {/* Right Side: Product Details Container */}
          <div className="lg:w-1/2 flex flex-col justify-center py-10 lg:py-0">
            
            <Reveal direction="up" delay={300}>
              <span className="text-amber-500 uppercase tracking-[0.3em] text-xs font-bold mb-5 block">
                {product.category || "Signature Eau De Parfum"}
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-stone-900 mb-6 leading-tight">
                {product.name}
              </h1>
              <p className="text-3xl font-light text-stone-500 mb-10 tracking-widest">
                ₹{product.price?.toLocaleString()}
              </p>
            </Reveal>

            <Reveal direction="up" delay={400}>
              <div className="bg-stone-100/50 p-6 rounded-2xl mb-12 border border-stone-100 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">Availability</p>
                  <p className="text-sm font-bold text-emerald-600">In Stock & Ready to Ship</p>
                </div>
                <div className="w-[1px] h-10 bg-stone-200"></div>
                <div>
                   <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">Concentration</p>
                   <p className="text-sm font-bold text-stone-900">Extrait de Parfum</p>
                </div>
              </div>
            </Reveal>

            {/* Action Buttons */}
            <Reveal direction="up" delay={500} className="flex flex-col sm:flex-row gap-4 mb-16">
              <button
                onClick={onAddToCart}
                className="flex-[0.8] bg-stone-900 text-white px-8 py-5 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-stone-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transform skew-x-12"></div>
                Add to Cart
              </button>

              <button
                onClick={onAddToWishlists}
                title="Add to Wishlist"
                className="flex-[0.2] h-[60px] flex items-center justify-center border border-stone-200 text-stone-400 rounded-xl hover:border-rose-500 hover:text-rose-500 transition-all duration-300 hover:bg-rose-50 hover:-translate-y-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </Reveal>

            <Reveal direction="up" delay={600}>
              <div className="flex flex-col border-t border-stone-200 pt-6">
                <Accordion title="Olfactive Description" defaultOpen={true}>
                  {product.description || "An olfactory journey that transcends time. Crafted with the utmost care, this fragrance embodies sophistication and allure. Experience a harmonious blend of rare essences that dance on the skin."}
                </Accordion>
                
                <Accordion title="The Notes">
                  <div className="flex flex-col gap-4 mt-2">
                    <div>
                      <span className="font-bold text-stone-900 text-xs tracking-widest uppercase mr-3">Top:</span>
                      Berglamot, Pink Pepper, Sicilian Lemon
                    </div>
                    <div>
                      <span className="font-bold text-stone-900 text-xs tracking-widest uppercase mr-3">Heart:</span>
                      Jasmine, Bulgarian Rose, Iris 
                    </div>
                    <div>
                      <span className="font-bold text-stone-900 text-xs tracking-widest uppercase mr-3">Base:</span>
                      Oud, Sandalwood, Madagascan Vanilla
                    </div>
                  </div>
                </Accordion>
                
                <Accordion title="Shipping & Returns">
                  Enjoy complimentary express shipping on all orders above ₹5000. Each fragrance arrives beautifully wrapped in our signature box. We accept returns within 14 days, provided the seal remains intact.
                </Accordion>
              </div>
            </Reveal>

          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Product;
