import React, { useEffect, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useCartStore from '../store/cartStore'
import useWishlistStore from '../store/wishlistStore'
import { getProductById } from '../api/productApi'
import { assets } from '../assets/assets'
import { FaHeart, FaShoppingCart, FaArrowLeft, FaStar } from 'react-icons/fa'

const Product = () => {
  const { productId } = useParams()
  const { user, token } = useAuthStore()
  const { addItem: addToCart } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState('')

  // Function to get category-specific images (fallback)
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
    const loadProduct = async () => {
      try {
        setLoading(true)
        const productData = await getProductById(productId)
        if (productData) {
          setProduct(productData)
          setError(null)
          if (productData.colors && productData.colors.length > 0) {
            setSelectedColor(productData.colors[0]);
          } else {
            setSelectedColor('');
          }
        } else {
          setError('Product not found')
        }
      } catch (err) {
        console.error('Error loading product:', err)
        setError(err.message || 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    if (user && token && productId) {
      loadProduct()
    }
  }, [productId, user, token])

  const handleAddToCart = async () => {
    try {
      if (!product) return;
      await addToCart(product, quantity, null, selectedColor);
      // Could add toast notification here
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  }

  const handleWishlistToggle = async () => {
    try {
      if (!product) return;
      
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product);
      }
      // Could add toast notification here
    } catch (error) {
      console.error('Failed to update wishlist:', error);
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

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">Product not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <Link to={`/category/${product.category}`} className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6">
        <FaArrowLeft className="mr-2" />
        Back to {product.category}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <img
            src={product.imageData 
              ? `data:image/jpeg;base64,${product.imageData}` 
              : product.imageKey && assets[product.imageKey] 
                ? assets[product.imageKey] 
                : getCategoryImage(product.category)}
            alt={product.name}
            className="w-full rounded-lg shadow-lg object-cover"
          />
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-4 right-4 p-3 rounded-full shadow-md transition-colors ${
              isInWishlist(product._id)
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FaHeart className="w-6 h-6" />
          </button>
          
          {product.discount > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
              {Math.round((product.price - product.discountedPrice) / product.price * 100)}% OFF
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
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
          
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">₹{product.discountedPrice}</span>
              {product.discount > 0 && (
                <span className="text-lg text-gray-400 line-through">₹{product.price}</span>
              )}
            </div>
            {product.discount > 0 && (
              <span className="text-sm text-green-600">You save ₹{product.price - product.discountedPrice} ({Math.round(product.discount)}%)</span>
            )}
          </div>

          <div className="mb-6">
            {/* Color selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`px-4 py-2 rounded border text-sm font-medium focus:outline-none transition-colors ${
                        selectedColor === color
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Quantity selection */}
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border rounded hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border rounded hover:bg-gray-100"
                disabled={quantity >= (product.stock || 10)}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            <FaShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Category:</span> {product.category}</p>
              <p><span className="font-medium">SKU:</span> {product._id}</p>
              <p><span className="font-medium">Stock:</span> {product.stock || 'Available'}</p>
              {product.specifications && (
                <div>
                  <span className="font-medium">Specifications:</span>
                  <ul className="list-disc list-inside ml-4 mt-2">
                    {product.specifications.map((spec, index) => (
                      <li key={index}>{spec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product
