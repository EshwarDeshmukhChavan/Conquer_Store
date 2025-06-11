import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const createRazorpayOrder = async (amount, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/payment/create`,
      { amount },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
}

export const saveOrder = async (orderData, token) => {
  try {
    console.log('Sending order data:', orderData); // Debug log
    const response = await axios.post(
      `${API_URL}/api/payment/save`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Order save response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
}

export const trackOrders = async (userId, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/payment/orders/${userId}`,
      {
      headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error tracking orders:', error);
    throw error;
  }
}
