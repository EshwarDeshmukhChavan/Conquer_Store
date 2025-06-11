import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useCartStore from '../store/cartStore'
import { createRazorpayOrder, saveOrder } from '../api/paymentApi'
import useAuthStore from '../store/authStore'
import { toast } from 'react-hot-toast'

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const Checkout = () => {
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const { items, getTotalPrice, clearCart, getItemCount } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState('online')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const initializeCheckout = () => {
      if (!user || !token) {
        toast.error('Please login to continue')
        navigate('/login')
        return
      }
      if (!items || items.length === 0) {
        toast.error('Your cart is empty')
        navigate('/cart')
        return
      }
      setPageLoading(false)
    }
    initializeCheckout()
  }, [user, token, items, navigate])

  const validators = {
    street: value => value.length < 5
      ? 'Street address must be at least 5 characters'
      : !/^[a-zA-Z0-9\s,.-]+$/.test(value)
      ? 'Invalid characters in street'
      : '',

    city: value => value.length < 2
      ? 'City must be at least 2 characters'
      : !/^[a-zA-Z\s]+$/.test(value)
      ? 'City can only contain letters and spaces'
      : '',

    state: value => !value ? 'Please select a state' : '',

    pincode: value => !/^[1-9][0-9]{5}$/.test(value)
      ? 'Enter valid 6-digit PIN code'
      : '',

    phone: value => !/^[6-9][0-9]{9}$/.test(value)
      ? 'Enter valid 10-digit mobile number'
      : ''
  }

  const validateAddress = () => {
    const newErrors = {}
    for (const field in address) {
      newErrors[field] = validators[field](address[field])
    }
    setErrors(newErrors)
    return Object.values(newErrors).every(err => !err)
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setAddress(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: validators[name](value) }))
  }

  const handlePayment = async () => {
    if (!validateAddress()) {
      toast.error('Please fix address errors')
      return
    }

    setLoading(true)
    try {
      const orderBody = {
        userId: user._id,
        products: items.map(i => ({
          productId: i._id || i.product,
          quantity: i.quantity,
          price: i.price,
          discount: i.discount || 0,
          size: i.size
        })),
        amount: getTotalPrice(),
        address,
        paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : undefined
      }

      if (paymentMethod === 'online') {
        const razorData = await createRazorpayOrder(getTotalPrice(), token)
        if (!razorData?.id) throw new Error('Failed Razorpay order creation')

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorData.amount,
          currency: razorData.currency,
          name: 'Conquer Store',
          description: 'Your purchase from Conquer Store',
          order_id: razorData.id,
          handler: async (response) => {
            const paymentDetails = {
              ...orderBody,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id
            }
            const saved = await saveOrder(paymentDetails, token)
            if (saved?._id) {
              setOrderId(saved._id)
              setShowConfirmation(true)
              clearCart()
              toast.success('Order placed successfully!')
            } else throw new Error('Save order failed')
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: address.phone
          },
          theme: { color: '#686CFD' }
        }
        new window.Razorpay(options).open()
      } else {
        // Immediate COD order placement
        const saved = await saveOrder(orderBody, token)
        if (saved?._id) {
          setOrderId(saved._id)
          clearCart()
          toast.success('Order placed successfully!')
          navigate('/orders') // Redirect immediately to orders page
        } else throw new Error('Save order failed')
      }
    } catch (err) {
      console.error('Checkout error:', err)
      toast.error(err?.response?.data?.message || 'Order placement failed')
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user || !token || !items.length) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item._id}-${item.size}`} className="flex items-start gap-4 border-b pb-4 last:border-b-0">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <img
                      src={item.image || item.imageData}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/placeholder-image.png' // Add a placeholder image
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-base truncate">{item.name}</h4>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                    {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                    <p className="text-base font-semibold text-green-600 mt-2">
                      ₹{(item.discountedPrice || item.price) * item.quantity}
                      {item.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through ml-2">₹{item.price * item.quantity}</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-medium text-gray-900">Total ({getItemCount()} items)</span>
                <span className="text-lg font-bold text-gray-900">₹{getTotalPrice()}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address and Payment Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['street', 'city', 'pincode', 'phone'].map((field) => (
                <div key={field} className={field === 'street' ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field === 'street' ? 'Street Address' : field}
                  </label>
                  <input
                    type={field === 'phone' ? 'tel' : 'text'}
                    name={field}
                    value={address[field]}
                    onChange={handleAddressChange}
                    maxLength={field === 'pincode' ? 6 : field === 'phone' ? 10 : undefined}
                    className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors[field] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={
                      field === 'pincode' ? 'Enter 6-digit PIN' :
                      field === 'phone' ? 'Enter 10-digit mobile number' :
                      `Enter ${field}`
                    }
                  />
                  {errors[field] && (
                    <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
                  )}
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                )}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Online Payment</p>
                    <p className="text-sm text-gray-500">Pay using Credit/Debit Card or UPI</p>
                  </div>
                </label>
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Cash on Delivery (COD)</p>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="mt-8 w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Order Placed Successfully!</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your order has been placed successfully. Order ID: #{orderId?.slice(-6)}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Order
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Checkout
