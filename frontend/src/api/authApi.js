import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.message || 'An error occurred')
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.')
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('An error occurred while setting up the request')
    }
  }
)

export const registerUser = async (name, email, password) => {
  try {
    const { data } = await api.post('/auth/register', { name, email, password })
    return data
  } catch (err) {
    throw err
  }
}

export const loginUser = async (email, password) => {
  try {
    const { data } = await api.post('/auth/login', { email, password })
    if (!data.token || !data.user) {
      throw new Error('Invalid response from server')
    }
    return data
  } catch (err) {
    throw err
  }
}

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userId')
  } catch (err) {
    console.error('Logout error:', err)
    // Still clear local storage even if the server request fails
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userId')
  }
}

export const getCurrentUser = async () => {
  try {
    const { data } = await api.get('/auth/me')
    return data
  } catch (err) {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('userId')
    }
    return null
  }
}
