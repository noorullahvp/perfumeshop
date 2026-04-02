import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    if (direction === "up") translateClass = "translate-y-12 opacity-0";
    if (direction === "down") translateClass = "-translate-y-12 opacity-0";
    if (direction === "left") translateClass = "-translate-x-12 opacity-0";
    if (direction === "right") translateClass = "translate-x-12 opacity-0";
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

const Registration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!name || !email || !password) {
      setIsSuccess(false);
      setMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const newUser = {
      name,
      email,
      password,
      role: "user",
      isActive: true,
    };

    try {
      const response = await api.post("/Auth/register", newUser);

      if (response.status === 200 || response.status === 201) {
        setIsSuccess(true);
        setMessage(response.data.message || `Welcome to our collection, ${name}. Your account has been created.`);
        setName("");
        setEmail("");
        setPassword("");

        setTimeout(() => navigate("/login"), 2500);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setIsSuccess(false);

      if (error.response) {
        setMessage(error.response.data.message || "Registration failed. Please try again.");
      } else if (error.request) {
        setMessage("No response from the server. Please check your connection.");
      } else {
        setMessage("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-amber-500/30 flex flex-col lg:flex-row">
      
      {/* Left Side: Cinematic Presentation */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-stone-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2000')] bg-cover bg-center opacity-40 mix-blend-luminosity transform scale-105 animate-[pulse_20s_ease-in-out_infinite]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/50"></div>
        <div className="relative z-10 text-center px-12">
          <Reveal direction="down" delay={200}>
            <h2 className="text-white text-5xl xl:text-6xl font-serif mb-6 drop-shadow-2xl">Step Into Our World</h2>
          </Reveal>
          <Reveal direction="up" delay={400}>
            <p className="text-stone-300 font-light tracking-wide text-lg max-w-md mx-auto">
              Join exclusive access to private collections, early releases, and personalized fragrance styling.
            </p>
          </Reveal>
          <Reveal direction="up" delay={600}>
             <div className="flex items-center justify-center gap-4 mt-12 opacity-60">
                 <div className="w-16 h-[1px] bg-white"></div>
                 <span className="text-white text-xs uppercase tracking-[0.3em]">Est. 1990</span>
                 <div className="w-16 h-[1px] bg-white"></div>
             </div>
          </Reveal>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 relative">
        <div className="absolute top-8 left-8 lg:hidden">
           <span className="text-stone-900 text-xl font-serif tracking-[0.2em] uppercase">Lux Perfumes</span>
        </div>

        <div className="w-full max-w-md mt-12 lg:mt-0">
          <Reveal direction="right" delay={100}>
            <span className="text-amber-500 uppercase tracking-[0.3em] text-xs font-bold mb-3 block">Membership</span>
            <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-8">Create Account</h1>
          </Reveal>

          <Reveal direction="up" delay={200}>
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Name Input */}
              <div className="relative group">
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-colors peer placeholder-transparent"
                  placeholder="Full Name"
                />
                <label 
                  htmlFor="name" 
                  className="absolute left-0 top-3 text-stone-400 text-sm transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-stone-900 peer-focus:font-bold peer-focus:tracking-widest uppercase tracking-wide peer-valid:-top-4 peer-valid:text-xs peer-valid:text-stone-900 peer-valid:font-bold peer-valid:tracking-widest"
                >
                  Full Name
                </label>
              </div>

              {/* Email Input */}
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-colors peer placeholder-transparent"
                  placeholder="Email Address"
                />
                <label 
                  htmlFor="email" 
                  className="absolute left-0 top-3 text-stone-400 text-sm transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-stone-900 peer-focus:font-bold peer-focus:tracking-widest uppercase tracking-wide peer-valid:-top-4 peer-valid:text-xs peer-valid:text-stone-900 peer-valid:font-bold peer-valid:tracking-widest"
                >
                  Email Address
                </label>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-stone-300 py-3 text-stone-900 focus:outline-none focus:border-stone-900 transition-colors peer placeholder-transparent"
                  placeholder="Password"
                />
                <label 
                  htmlFor="password" 
                  className="absolute left-0 top-3 text-stone-400 text-sm transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-stone-900 peer-focus:font-bold peer-focus:tracking-widest uppercase tracking-wide peer-valid:-top-4 peer-valid:text-xs peer-valid:text-stone-900 peer-valid:font-bold peer-valid:tracking-widest"
                >
                  Password
                </label>
              </div>

              {/* Messaging */}
              {message && (
                <div 
                  className={`p-4 border-l-2 text-sm font-medium animate-[fadeIn_0.5s_ease-out] ${
                    isSuccess 
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : "border-rose-500 bg-rose-50 text-rose-800"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-stone-900 text-white py-4 mt-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-amber-600 transition-all duration-500 flex justify-center items-center group relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl"
              >
                 <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="relative z-10">Register</span>
                )}
              </button>
            </form>
          </Reveal>

          <Reveal direction="up" delay={300}>
            <div className="mt-12 text-center">
              <span className="text-stone-500 text-sm">Already a member? </span>
              <Link to="/login" className="text-stone-900 font-bold uppercase text-xs tracking-widest border-b border-stone-900 pb-1 ml-2 hover:text-amber-600 hover:border-amber-600 transition-colors">
                Sign In
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default Registration;
