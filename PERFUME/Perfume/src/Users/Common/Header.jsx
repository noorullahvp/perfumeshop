import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AppContext } from "../Context/ContextPro";

function Header() {
  const { loggedInUser, isLoggedIn, handleLogout, carts } = useContext(AppContext);
  const isAdmin = loggedInUser?.role === "admin";
  const [scrolled, setScrolled] = useState(false);

  // Add a scroll listener for sticky nav effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userCartItems =
    Array.isArray(carts) && loggedInUser
      ? carts.filter(
          (c) =>
            c?.userId === loggedInUser?.userId || c?.userId === loggedInUser?.id
        )
      : [];

  const navLinkClass = ({ isActive }) =>
    `text-xs font-semibold tracking-[0.15em] uppercase transition-colors duration-300 relative group ${
      isActive 
        ? "text-rose-600" 
        : "text-stone-500 hover:text-stone-900"
    }`;

  const ActiveIndicator = ({ isActive }) => (
    <span className={`absolute -bottom-1 left-0 w-full h-[2px] bg-rose-600 transition-transform duration-300 origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
  );

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm py-3 lg:py-4" 
          : "bg-white/95 backdrop-blur-sm border-b border-stone-100 py-5 lg:py-6"
      }`}
    >
      <div className="max-w-[90rem] mx-auto px-4 md:px-8 lg:px-12 flex flex-wrap lg:flex-nowrap justify-between items-center gap-y-4">
        
        {/* Left: Navigation (Desktop) */}
        <nav className="flex-1 hidden md:flex items-center space-x-10">
          <NavLink to="/" className={navLinkClass}>
            {({ isActive }) => (
              <>Home<ActiveIndicator isActive={isActive}/></>
            )}
          </NavLink>
          {!isAdmin && (
            <NavLink to="/products" className={navLinkClass}>
              {({ isActive }) => (
                <>Shop<ActiveIndicator isActive={isActive}/></>
              )}
            </NavLink>
          )}
        </nav>

        {/* Center: Logo */}
        <div className="flex-1 md:flex-none flex justify-center w-full md:w-auto order-first md:order-none">
          <Link
            to="/"
            className="text-3xl md:text-3xl lg:text-4xl font-serif tracking-[0.15em] text-stone-900 hover:text-stone-500 transition-colors uppercase text-center"
          >
            Lux Perfumes
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex items-center justify-end space-x-4 sm:space-x-6 w-full md:w-auto">
          {!isAdmin && (
            <>
              {/* Wishlist Icon */}
              <NavLink to="/wishlist" className="text-stone-500 hover:text-rose-600 transition-colors hidden sm:block" title="Wishlist">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </NavLink>

              {/* Cart Icon */}
              <NavLink to="/cart" className="relative text-stone-500 hover:text-rose-600 transition-colors flex items-center" title="Cart">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {userCartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[10px] font-bold rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center shadow-sm">
                    {userCartItems.length}
                  </span>
                )}
              </NavLink>
              
              {isLoggedIn && (
                 <NavLink to="/orders" className="text-stone-500 hover:text-stone-900 transition-colors hidden sm:block" title="Orders">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                 </NavLink>
              )}
            </>
          )}

          {/* User Auth */}
          <div className="flex items-center space-x-4 pl-4 border-l border-stone-200">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="hidden lg:block text-xs font-semibold tracking-wider text-stone-500 uppercase">
                  Hi, {loggedInUser?.name?.split(' ')[0] || "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold tracking-widest text-stone-900 uppercase hover:text-rose-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="bg-stone-900 text-white px-5 py-2 lg:px-8 lg:py-3 text-xs font-bold tracking-widest uppercase hover:bg-stone-700 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <nav className="w-full flex md:hidden items-center justify-center space-x-6 pt-3 mt-1 border-t border-stone-100">
          <NavLink to="/" className={navLinkClass}>
             {({ isActive }) => (<>Home<ActiveIndicator isActive={isActive}/></>)}
          </NavLink>
          {!isAdmin && (
             <>
               <NavLink to="/products" className={navLinkClass}>
                  {({ isActive }) => (<>Shop<ActiveIndicator isActive={isActive}/></>)}
               </NavLink>
               <NavLink to="/wishlist" className={navLinkClass}>
                  {({ isActive }) => (<>Wishlist<ActiveIndicator isActive={isActive}/></>)}
               </NavLink>
               {isLoggedIn && (
                  <NavLink to="/orders" className={navLinkClass}>
                     {({ isActive }) => (<>Orders<ActiveIndicator isActive={isActive}/></>)}
                  </NavLink>
               )}
             </>
          )}
        </nav>

      </div>
    </header>
  );
}

export default Header;
