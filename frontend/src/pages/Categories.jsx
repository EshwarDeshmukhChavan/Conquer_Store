import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { getAllowedCategories } from '../api/productApi'
import { assets } from '../assets/assets'

// Map of category keys to their display names and images
// This allows for a more maintainable and extensible approach
const categoryMap = {
  iphones: {
    name: 'iPhones',
    primaryImage: assets.iphone,
    secondaryImage: assets.iphone, // Can add alternate images here
    description: 'Explore our range of powerful and sleek iPhones.'
  },
  ipads: {
    name: 'iPads',
    primaryImage: assets.ipad,
    secondaryImage: assets.ipad2,
    description: 'Find your perfect iPad for work and play.'
  },
  macbooks: {
    name: 'MacBooks', 
    primaryImage: assets.macbook,
    secondaryImage: assets.macbook2,
    description: 'Professional-grade laptops for any task.'
  },
  watches: {
    name: 'Apple Watches',
    primaryImage: assets.appleWatch,
    secondaryImage: assets.appleWatch2,
    description: 'Stay connected with stylish Apple Watches.'
  },
  airpods: {
    name: 'AirPods',
    primaryImage: assets.appleAirpods,
    secondaryImage: assets.appleAirpods2,
    description: 'Wireless audio experiences without compromise.'
  },
  accessories: {
    name: 'Accessories',
    primaryImage: assets.appleHeadphones,
    secondaryImage: assets.appleHeadphones,
    description: 'Enhance your Apple products with premium accessories.'
  }
}

const Categories = () => {
  const { user, token } = useAuthStore()
  const [allowedCategories, setAllowedCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hoveredCategory, setHoveredCategory] = useState(null)

  useEffect(() => {
    const loadAllowedCategories = async () => {
      try {
        setLoading(true)
        const categories = await getAllowedCategories()
        setAllowedCategories(categories)
        setError(null)
      } catch (err) {
        console.error('Error loading categories:', err)
        setError(err.message || 'Failed to load categories')
      } finally {
        setLoading(false)
      }
    }
    
    if (user && token) {
      loadAllowedCategories()
    }
  }, [user, token])

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

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50">
      <h1 className="text-4xl font-bold mb-2 text-gray-800">Browse Categories</h1>
      <p className="text-gray-600 mb-8">Explore our collection of premium Apple products</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allowedCategories.map((category) => {
          const categoryInfo = categoryMap[category] || {
            name: category.charAt(0).toUpperCase() + category.slice(1),
            primaryImage: assets.iphone, // Fallback image
            secondaryImage: assets.iphone,
            description: 'Explore our products in this category.'
          };
          
          return (
            <Link
              key={category}
              to={`/category/${category}`}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hoveredCategory === category ? categoryInfo.secondaryImage : categoryInfo.primaryImage}
                  alt={categoryInfo.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
                  style={{ transform: hoveredCategory === category ? 'scale(1.05)' : 'scale(1)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60 flex items-end">
                  <h2 className="text-white text-2xl font-bold p-6">{categoryInfo.name}</h2>
                </div>
              </div>
              <div className="p-5 flex-grow">
                <p className="text-gray-600">{categoryInfo.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {/* This could show the product count if available from API */}
                    View collection
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                    New Arrivals
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  )
}

export default Categories