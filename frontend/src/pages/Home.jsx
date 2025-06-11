import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllProducts } from '../api/productApi'
import { assets } from '../assets/assets'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await getAllProducts()
        setProducts(allProducts)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const featuredProducts = products.slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src={assets.macbook}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-2xl">
            <p className="text-gray-300 text-lg mb-4">OUR BESTSELLERS</p>
            <h1 className="text-5xl font-light text-white mb-6">Latest Arrivals</h1>
            <Link
              to="/categories"
              className="inline-block text-white border border-white px-8 py-3 hover:bg-white hover:text-gray-900 transition-colors"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-light text-white text-center mb-12">Featured Products</h2>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {featuredProducts.map((product) => (
                <div key={product._id} className="w-full flex-shrink-0 px-4">
                  <Link to={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div className="relative aspect-w-16 aspect-h-9 group">
                      <img
                        src={product.imageUrl || assets[product.imageKey] || assets.macbook}
                        alt={product.name}
                        className="w-full h-[600px] object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-2xl font-light text-white mb-2">{product.name}</h3>
                          <p className="text-gray-300 mb-4">{product.description}</p>
                          <span className="text-white text-xl">₹{product.discountedPrice}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
          >
            <FaArrowLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
          >
            <FaArrowRight className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="flex justify-center mt-6 space-x-2">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? 'bg-white' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
