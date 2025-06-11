import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const addOrg = async (orgData) => {
  const token = localStorage.getItem('token')
  const res = await axios.post(`${API_BASE_URL}/api/admin/org`, orgData, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

export const setDiscount = async (discountData) => {
  const token = localStorage.getItem('token')
  const res = await axios.post(`${API_BASE_URL}/api/admin/discount`, discountData, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}
