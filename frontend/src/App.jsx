import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Categories from './pages/Categories'
import Category from './pages/Category'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import OrderTracking from './pages/OrderTracking'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import useAuthStore from './store/authStore'
import useCartStore from './store/cartStore'
import useWishlistStore from './store/wishlistStore'
import About from './pages/About'
import Contact from './pages/Contact'
import Orders from './pages/Orders'

function App() {
  const { user, isLoading, initialize } = useAuthStore()
  const { initializeCart } = useCartStore()
  const { initializeWishlist } = useWishlistStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  // Initialize cart and wishlist when user is authenticated
  useEffect(() => {
    if (user && user._id) {
      // Store userId in localStorage for cart/wishlist user-specific storage
      localStorage.setItem('userId', user._id)
      // Initialize cart and wishlist with user ID
      initializeCart(user._id)
      initializeWishlist(user._id)
    } else {
      // Clear userId from localStorage when user is not authenticated
      localStorage.removeItem('userId')
    }
  }, [user, initializeCart, initializeWishlist])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:cat" element={<Category />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/orders" element={<Orders />} />
            {/* Admin routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedAdminRoute>
                  <Routes>
                    <Route path="/" element={<div>Admin Dashboard</div>} />
                    <Route path="/products" element={<div>Admin Products</div>} />
                    <Route path="/orders" element={<div>Admin Orders</div>} />
                    <Route path="/users" element={<div>Admin Users</div>} />
                  </Routes>
                </ProtectedAdminRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
