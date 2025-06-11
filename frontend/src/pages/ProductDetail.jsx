import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProductById } from '../api/productApi';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import useAuthStore from '../store/authStore';
import SizeSelector from '../components/SizeSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import assets from '../assets';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const { isLoggedIn } = useAuthStore();
  const addToCart = useCartStore(state => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
        
        // If the product has sizes, default to the first size
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to fetch product');
        toast.error(err.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // For products with sizes, make sure a size is selected
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    addToCart(product, quantity, selectedSize);
    toast.success(`Added ${product.name} to cart`);
  };

  const toggleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.info(`Removed ${product.name} from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`Added ${product.name} to wishlist`);
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, value);
    setQuantity(newQuantity);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]">
      <LoadingSpinner />
    </div>;
  }

  if (error) {
    return <div className="text-center py-10">
      <h2 className="text-2xl text-red-600 mb-4">Error</h2>
      <p>{error}</p>
      <Link to="/" className="text-blue-600 mt-4 inline-block">Go back to homepage</Link>
    </div>;
  }

  if (!product) {
    return <div className="text-center py-10">
      <h2 className="text-2xl mb-4">Product not found</h2>
      <Link to="/" className="text-blue-600 mt-4 inline-block">Go back to homepage</Link>
    </div>;
  }

  // Determine product images to display
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : product.imageData 
      ? [product.imageData] 
      : [assets.productPlaceholder];

  const discountedPrice = product.discount > 0 
    ? product.price - (product.price * product.discount / 100) 
    : product.price;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="md:w-1/2">
          <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden aspect-square">
            <img 
              src={productImages[selectedImage]} 
              alt={product.name} 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Thumbnail Images */}
          {productImages.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 border rounded ${selectedImage === index ? 'border-blue-500' : 'border-gray-300'}`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} thumbnail ${index + 1}`} 
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className="md:w-1/2">
          <div className="mb-2">
            <Link to="/" className="text-blue-600 hover:underline">Home</Link>
            {" > "}
            <Link to={`/category/${product.category}`} className="text-blue-600 hover:underline">{product.category}</Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          {product.bestseller && (
            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium inline-block mb-2">
              Bestseller
            </div>
          )}
          
          <div className="flex items-center space-x-4 mb-4">
            {product.discount > 0 ? (
              <>
                <span className="text-2xl font-bold">${discountedPrice.toFixed(2)}</span>
                <span className="text-gray-500 line-through">${product.price.toFixed(2)}</span>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                  {product.discount}% OFF
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <SizeSelector 
              sizes={product.sizes} 
              selectedSize={selectedSize} 
              onSizeSelect={setSelectedSize} 
            />
          )}
          
          {/* Quantity Selector */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700">Quantity</h3>
            <div className="flex items-center mt-2">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => handleQuantityChange(parseInt(e.target.value || 1))}
                className="w-12 h-8 border-t border-b border-gray-300 text-center"
              />
              <button 
                onClick={() => handleQuantityChange(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium">Specifications</h3>
              <ul className="list-disc list-inside mt-2 text-gray-600">
                {product.specifications.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium"
            >
              Add to Cart
            </button>
            
            <button
              onClick={toggleWishlist}
              className={`w-12 h-12 flex items-center justify-center rounded-lg border ${
                isInWishlist(product._id) 
                  ? 'bg-red-50 border-red-300 text-red-600' 
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="material-icons">
                {isInWishlist(product._id) ? 'favorite' : 'favorite_border'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
