import React from 'react'
import { Navigate, Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useCartStore from '../store/cartStore'
import { FaTrash, FaArrowLeft } from 'react-icons/fa'
import { assets } from '../assets/assets'

const Cart = () => {
  const { user, token } = useAuthStore()
  const { items, removeItem, updateQuantity, getItemCount, getTotalPrice } = useCartStore()

  if (!user || !token) {
    return <Navigate to="/login" replace />
  }

  if (getItemCount() === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Add some products to your cart to see them here.</p>
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
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <div key={item._id + (item.color || '')} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow mb-4">
              <img
                src={item.imageUrl || assets[item.imageKey] || assets.iphone}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
                {item.color && (
                  <p className="text-sm text-gray-500">Color: {item.color}</p>
                )}
                <div className="mt-2">
                  <span className="text-green-600 font-semibold">₹{item.discountedPrice}</span>
                  {item.discount > 0 && (
                    <span className="ml-2 text-red-400 line-through text-sm">₹{item.price}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1), item.size, item.color)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1, item.size, item.color)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item._id, item.size, item.color)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal ({getItemCount()} items)</span>
              <span>₹{getTotalPrice()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{getTotalPrice()}</span>
              </div>
            </div>
          </div>
          <Link
            to="/checkout"
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
