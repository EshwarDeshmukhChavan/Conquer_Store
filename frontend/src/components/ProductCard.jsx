import React from 'react'
import { Link } from 'react-router-dom'
import assets from '../assets/assets'

const ProductCard = ({ product }) => {
  // product: { _id, name, price, discount, discountedPrice, imageKey }
  // imageKey must match a property in assets.js (e.g., 'iphone', 'ipad', etc.)

  // Function to get category-specific image (fallback)
  const getCategoryImage = (category) => {
    switch(category?.toLowerCase()) {
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

  // Get the image source with fallbacks
  const getImageSource = () => {
    if (product.imageData) {
      return `data:image/jpeg;base64,${product.imageData}`;
    }
    if (product.imageKey && assets[product.imageKey]) {
      return assets[product.imageKey];
    }
    if (product.image && Array.isArray(product.image) && product.image.length > 0) {
      return product.image[0];
    }
    return getCategoryImage(product.category);
  }

  return (
    <div className="border rounded-2xl p-4 shadow hover:shadow-md transition">
      <img
        src={getImageSource()}
        alt={product.name}
        className="w-full h-48 object-cover rounded-xl"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = getCategoryImage(product.category);
        }}
      />

      <h2 className="mt-4 text-lg font-semibold">{product.name}</h2>
      
      {product.discount && product.discount > 0 ? (
        <div className="mt-1">
          <span className="text-red-500 line-through mr-2">₹{product.price}</span>
          <span className="text-green-600 font-medium">₹{product.discountedPrice}</span>
          <span className="ml-2 text-sm text-red-600">-{product.discount}%</span>
        </div>
      ) : (
        <p className="text-green-600 font-medium mt-1">₹{product.price}</p>
      )}

      <Link
        to={`/product/${product._id || product.name.toLowerCase().replace(/\s+/g, '-')}`}
        className="mt-3 inline-block text-blue-500 hover:underline text-sm"
      >
        View Details
      </Link>
    </div>
  )
}

export default ProductCard
