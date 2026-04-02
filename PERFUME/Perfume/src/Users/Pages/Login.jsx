import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../Context/ContextPro";
import { useNavigate, Link } from "react-router-dom";
import api from "../../service/api";
import { jwtDecode } from "jwt-decode";

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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { triggerNotification, isLoggedIn, setIsLoggedIn, setLoggedInUser } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await api.post("/Auth/login", { email, password });

      const token = response.data.accessToken;
      const refreshToken = response.data.refreshToken;

      if (!token) {
        setMessage("Token missing.");
        return;
      }

      localStorage.setItem("token", token);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      const decoded = jwtDecode(token);

      const userId =
        decoded.nameid ||
        decoded.sub ||
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      const name =
        decoded.unique_name ||
        decoded.name ||
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ];

      const userEmail = decoded.email;

      const role =
        decoded.role ||
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      let backendUser = {};
      try {
        const userRes = await api.get(`/User/${userId}`);
        backendUser = userRes.data?.data || userRes.data || {};
      } catch (err) {
        console.warn("User fetch failed:", err);
      }

      const userObject = {
        userId,
        name,
        email: userEmail,
        role,
        ...backendUser,
      };

      localStorage.setItem("user", JSON.stringify(userObject));

      setLoggedInUser(userObject);
      setIsLoggedIn(true);

      triggerNotification("Login successful!", "success");

      if (role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (err) {
      if (err.response?.status === 403) {
        setMessage("Account blocked by admin.");
      } else if (err.response?.status === 401) {
        setMessage("Invalid email or password.");
      } else {
        setMessage("Server error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-amber-500/30 flex flex-col lg:flex-row">
      
      {/* Left Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 relative order-2 lg:order-1">
        <div className="absolute top-8 left-8 lg:hidden">
           <span className="text-stone-900 text-xl font-serif tracking-[0.2em] uppercase">Lux Perfumes</span>
        </div>

        <div className="w-full max-w-md mt-12 lg:mt-0">
          <Reveal direction="left" delay={100}>
            <span className="text-amber-500 uppercase tracking-[0.3em] text-xs font-bold mb-3 block">Welcome Back</span>
            <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-8">Access Account</h1>
          </Reveal>

          <Reveal direction="up" delay={200}>
            <form onSubmit={handleSubmit} className="space-y-8">
              
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
                  className="p-4 border-l-2 text-sm font-medium animate-[fadeIn_0.5s_ease-out] border-rose-500 bg-rose-50 text-rose-800"
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
                  <span className="relative z-10">Sign In</span>
                )}
              </button>
            </form>
          </Reveal>

          <Reveal direction="up" delay={300}>
            <div className="mt-12 text-center flex flex-col gap-4">
              <div>
                <span className="text-stone-500 text-sm">Not registered yet? </span>
                <Link to="/registration" className="text-stone-900 font-bold uppercase text-xs tracking-widest border-b border-stone-900 pb-1 ml-2 hover:text-amber-600 hover:border-amber-600 transition-colors">
                  Create an account
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Right Side: Cinematic Presentation */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-stone-900 items-center justify-center overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2000')] bg-cover bg-center opacity-40 mix-blend-luminosity transform scale-105 animate-[pulse_20s_ease-in-out_infinite]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/50"></div>
        <div className="relative z-10 text-center px-12">
          <Reveal direction="down" delay={200}>
            <h2 className="text-white text-5xl xl:text-6xl font-serif mb-6 drop-shadow-2xl">Return to Elegance</h2>
          </Reveal>
          <Reveal direction="up" delay={400}>
            <p className="text-stone-300 font-light tracking-wide text-lg max-w-md mx-auto">
              Sign in to manage your collection, track deliveries, and discover personalized olfactory recommendations.
            </p>
          </Reveal>
          <Reveal direction="up" delay={600}>
             <div className="flex items-center justify-center gap-4 mt-12 opacity-60">
                 <div className="w-16 h-[1px] bg-white"></div>
                 <span className="text-white text-xs uppercase tracking-[0.3em]">Lux Perfumes</span>
                 <div className="w-16 h-[1px] bg-white"></div>
             </div>
          </Reveal>
        </div>
      </div>

    </div>
  );
};

export default Login;
