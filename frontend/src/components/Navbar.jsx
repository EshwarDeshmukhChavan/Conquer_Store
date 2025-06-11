import React from 'react'
import { Link } from 'react-router-dom'
import { FaUser, FaShoppingCart, FaHeart } from 'react-icons/fa'
import useAuthStore from '../store/authStore'
import useCartStore from '../store/cartStore'
import useWishlistStore from '../store/wishlistStore'
import { assets } from '../assets/assets'
import SearchBar from './SearchBar'

const Navbar = () => {
  const { user, logout } = useAuthStore()
  const { getItemCount: getCartCount } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900 text-white z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={assets.logo} alt="Conquer Store" className="h-8 w-auto" />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              HOME
            </Link>
            <Link to="/categories" className="hover:text-blue-400 transition-colors">
              CATALOGUE
            </Link>
            <Link to="/about" className="hover:text-blue-400 transition-colors">
              ABOUT
            </Link>
            <Link to="/contact" className="hover:text-blue-400 transition-colors">
              CONTACT
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block w-72">
            <SearchBar />
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/wishlist" className="hover:text-blue-400 transition-colors relative">
                  <FaHeart className="w-5 h-5" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="hover:text-blue-400 transition-colors relative">
                  <FaShoppingCart className="w-5 h-5" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="hover:text-blue-400 transition-colors">
                    <FaUser className="w-5 h-5" />
                  </button>
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out"
                    style={{ transitionDelay: '150ms' }}
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="hover:text-blue-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
