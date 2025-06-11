import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const searchProducts = async (query, token) => {
  const res = await axios.get(`${API_BASE_URL}/api/search?query=${query}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

export const compareProducts = async (ids, token) => {
  const res = await axios.post(`${API_BASE_URL}/api/search/compare`, { ids }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}
