import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getAllowedCategories = async () => {
  try {
    const { data } = await api.get('/products/allowed-categories')
    return data
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.message || 'Failed to fetch allowed categories')
    }
    throw new Error('Network error occurred')
  }
}

export const getAllProducts = async () => {
  try {
    const { data } = await api.get('/products/filtered')
    return data
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.message || 'Failed to fetch products')
    }
    throw new Error('Network error occurred')
  }
}

export const getProductById = async (id) => {
  try {
    const { data } = await api.get(`/products/${id}`)
    return data
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.message || 'Failed to fetch product')
    }
    throw new Error('Network error occurred')
  }
}

export const getProductsByCategory = async (category) => {
  try {
    const { data } = await api.get(`/products/category/${category}`)
    return data
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.message || 'Failed to fetch products')
    }
    throw new Error('Network error occurred')
  }
}

export const searchProducts = async (query) => {
  try {
    const { data } = await api.get(`/products/search?q=${query}`)
    return data
  } catch (err) {
    if (err.response) {
      throw new Error(err.response.data.message || 'Failed to search products')
    }
    throw new Error('Network error occurred')
  }
}
