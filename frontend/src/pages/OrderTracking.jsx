import React, { useEffect, useState } from 'react'
import { trackOrders } from '../api/paymentApi'
import useAuthStore from '../store/authStore'

const OrderTracking = () => {
  const { user, token } = useAuthStore()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return
      const data = await trackOrders(user.id, token)
      setOrders(data)
    }
    loadOrders()
  }, [user, token])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Order Tracking</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border rounded-md p-4 mb-4">
            <p className="font-semibold mb-1">Order ID: {order._id}</p>
            <p className="mb-1">Total Amount: ₹{order.amount}</p>
            <p className="mb-2">Status: {order.status}</p>
            <div>
              {order.products.map((pItem) => (
                <div key={pItem._id} className="text-sm text-gray-600 flex justify-between border-b py-1">
                  <span>Product ID: {pItem.productId}</span>
                  <span>Qty: {pItem.quantity}, Price: ₹{pItem.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default OrderTracking
