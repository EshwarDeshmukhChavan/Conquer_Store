import React, { useEffect, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useCartStore from '../store/cartStore'
import useWishlistStore from '../store/wishlistStore'
import { getAllProducts, getProductsByCategory } from '../api/productApi'
import { assets } from '../assets/assets'
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa'

const Category = () => {
  const { cat } = useParams()
  const { user, token } = useAuthStore()
  const { addItem: addToCart } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Function to get category-specific images
  const getCategoryImage = (category) => {
    switch(category) {
      case 'iphones':
        return assets.iphone;
      case 'ipads':
        return Math.random() > 0.5 ? assets.ipad : assets.ipad2;
      case 'macbooks':
        return Math.random() > 0.5 ? assets.macbook : assets.macbook2;
      case 'watches':
        return Math.random() > 0.5 ? assets.appleWatch : assets.appleWatch2;
      case 'airpods':
        return Math.random() > 0.5 ? assets.appleAirpods : assets.appleAirpods2;
      default:
        return assets.iphone;
    }
  }

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        // Use category-specific API endpoint instead of filtering all products
        const categoryProducts = await getProductsByCategory(cat)
        setProducts(categoryProducts)
        setError(null)
      } catch (err) {
        console.error('Error loading products:', err)
        setError(err.message || 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    
    if (user && token) {
      loadProducts()
    }
  }, [cat, user, token])

  const handleAddToCart = async (product, event) => {
    event.preventDefault() // Prevent navigation when clicking the cart button
    try {
      await addToCart(product)
      // Could add a visual confirmation like toast notification here
    } catch (error) {
      console.error('Failed to add item to cart:', error)
    }
  }

  const handleWishlistToggle = async (product, event) => {
    event.preventDefault() // Prevent navigation when clicking the wishlist button
    try {
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id)
      } else {
        await addToWishlist(product)
      }
      // Could add a visual confirmation like toast notification here
    } catch (error) {
      console.error('Failed to update wishlist:', error)
    }
  }

  if (!user || !token) {
    return <Navigate to="/login" replace />
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 capitalize">{cat}</h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-yellow-700">No products available in this category.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold capitalize text-gray-800">{cat}</h1>
        <div className="text-sm text-gray-600">
          {products.length} product{products.length !== 1 ? 's' : ''} found
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div 
            key={product._id} 
            className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300"
          >
            <Link to={`/product/${product._id}`}>
              <div className="relative overflow-hidden">
                <img
                  src={product.imageData 
                    ? `data:image/jpeg;base64,${product.imageData}` 
                    : product.imageKey && assets[product.imageKey] 
                      ? assets[product.imageKey] 
                      : getCategoryImage(product.category)}
                  alt={product.name}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {product.discount > 0 && (
                  <div className="absolute top-0 left-0 bg-red-500 text-white px-3 py-1 m-2 rounded-full text-xs font-bold">
                    {Math.round((product.price - product.discountedPrice) / product.price * 100)}% OFF
                  </div>
                )}
                
                <div className="absolute top-2 right-2 flex flex-col space-y-2">
                  <button
                    onClick={(e) => handleWishlistToggle(product, e)}
                    className={`p-2 rounded-full shadow-md transition-colors ${
                      isInWishlist(product._id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                    aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <FaHeart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Link>
            
            <div className="p-4">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={i < (product.rating || 4) ? "text-yellow-400" : "text-gray-300"} 
                    />
                  ))}
                </div>
                <span className="text-gray-500 text-sm ml-2">
                  {product.reviewCount || Math.floor(Math.random() * 50) + 5} reviews
                </span>
              </div>
              
              <Link to={`/product/${product._id}`}>
                <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">{product.name}</h2>
              </Link>
              
              <p className="text-gray-600 mb-4 text-sm line-clamp-2">{product.description}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-baseline">
                  <span className="text-xl text-green-600 font-bold">₹{product.discountedPrice}</span>
                  {product.discount > 0 && (
                    <span className="ml-2 text-gray-400 line-through text-sm">₹{product.price}</span>
                  )}
                </div>
                
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  aria-label="Add to cart"
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

export default Category
