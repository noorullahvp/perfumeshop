import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Users/Pages/Home";
import Products from "./Users/Pages/Products";
import Product from "./Users/Pages/Product";
import Cart from "./Users/Pages/Cart";
import Checkout from "./Users/Pages/Checkout";
import Registration from "./Users/Pages/Registration";
import Login from "./Users/Pages/Login";
import OrdersPage from "./Users/Pages/OrdersPage";
import Wishlist from "./Users/Pages/Wishlist";

import Header from "./Users/Common/Header";
import Footbar from "./Users/Common/Footer";

import ContextPro from "./Users/Context/ContextPro";
import CartProvider from "./Users/Context/cartContext";

import AdminLogin from "./Admin/AdminLogin";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminProducts from "./Admin/AdminProducts";
import AdminUsers from "./Admin/AdminUsers";
import ProtectedRoute from "./Admin/ProtectedRoute";
import OrderManagement from "./Admin/OrderManagement";

function App() {
  return (
    <Router>
      
      <CartProvider>
        <ContextPro>
          <Header />

          <Routes>
            
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/product" element={<AdminProducts />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/manageorders" element={<OrderManagement />} />
          </Routes>

          <Footbar />
        </ContextPro>
      </CartProvider>
    </Router>
  );
}

export default App;
