import { create } from 'zustand'
import { getAllProducts, getProductById, getProductsByCategory, searchProducts } from '../api/productApi'

const useProductStore = create((set) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null })
    try {
      const products = await getAllProducts()
      set({ products, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const product = await getProductById(id)
      set({ selectedProduct: product, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ isLoading: true, error: null })
    try {
      const products = await getProductsByCategory(category)
      set({ products, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  searchProducts: async (query) => {
    set({ isLoading: true, error: null })
    try {
      const products = await searchProducts(query)
      set({ products, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  clearError: () => set({ error: null })
}))

export default useProductStore 