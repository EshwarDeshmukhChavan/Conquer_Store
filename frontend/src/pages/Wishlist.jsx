import React from 'react'
import { Navigate, Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useWishlistStore from '../store/wishlistStore'
import useCartStore from '../store/cartStore'
import { FaTrash, FaArrowLeft, FaShoppingCart } from 'react-icons/fa'
import { assets } from '../assets/assets'

const Wishlist = () => {
  const { user, token } = useAuthStore()
  const { items, removeItem } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()

  if (!user || !token) {
    return <Navigate to="/login" replace />
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your wishlist is empty</h1>
        <p className="text-gray-600 mb-6">Add some products to your wishlist to see them here.</p>
        <Link to="/categories" className="inline-flex items-center text-blue-600 hover:text-blue-700">
          <FaArrowLeft className="mr-2" />
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/categories" className="text-gray-600 hover:text-blue-600 mr-4">
          <FaArrowLeft className="inline-block mr-1" />
          Continue Shopping
        </Link>
        <h1 className="text-2xl font-bold">My Wishlist</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden group">
            <Link to={`/product/${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="relative">
                <img
                  src={item.imageUrl || assets[item.imageKey] || assets.iphone}
                  alt={item.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      removeItem(item._id)
                    }}
                    className="p-2 rounded-full bg-white text-gray-600 hover:bg-gray-100"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Link>
            <div className="p-4">
              <Link to={`/product/${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <h2 className="text-xl font-semibold mb-2 hover:text-blue-600">{item.name}</h2>
              </Link>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-green-600 font-semibold">₹{item.discountedPrice}</span>
                  {item.discount > 0 && (
                    <span className="ml-2 text-red-400 line-through">₹{item.price}</span>
                  )}
                </div>
                <button
                  onClick={() => {
                    addToCart(item)
                    removeItem(item._id)
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <FaShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist
