import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useProductStore from '../store/productStore'
import useAuthStore from '../store/authStore'

const Products = () => {
  const { products, isLoading, error, fetchProducts } = useProductStore()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Products</h1>
        {user && (
          <div className="flex space-x-4">
            <Link to="/wishlist" className="text-blue-600 hover:text-blue-800">
              My Wishlist
            </Link>
            <Link to="/cart" className="text-blue-600 hover:text-blue-800">
              My Cart
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">
                    ${product.price}
                  </span>
                  {user && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        // Add to cart functionality
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Products 