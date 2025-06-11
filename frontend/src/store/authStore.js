// If using Zustand
import { create } from 'zustand';
import { getCurrentUser } from '../api/authApi';
import useCartStore from './cartStore';
import useWishlistStore from './wishlistStore';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token'),
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token) {
        // First try to use the stored user data
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          set({ user: userData, token, isLoading: false });
          localStorage.setItem('userId', userData._id);
          
          // Initialize cart and wishlist with user data
          useCartStore.getState().initializeCart(userData._id);
          useWishlistStore.getState().initializeWishlist(userData._id);
        }
        
        // Then validate with the server and update if needed
        const userData = await getCurrentUser();
        if (userData) {
          set({ user: userData, token, isLoading: false });
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('userId', userData._id);
          
          // Initialize cart and wishlist with fresh user data
          useCartStore.getState().initializeCart(userData._id);
          useWishlistStore.getState().initializeWishlist(userData._id);
        } else {
          // Clear everything if the token is invalid
          set({ user: null, token: null, isLoading: false });
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userId');
          
          // Clear cart and wishlist state
          useCartStore.getState().setLocalState({ items: [], userId: null });
          useWishlistStore.getState().setLocalState({ items: [], userId: null });
        }
      } else {
        set({ isLoading: false });
        localStorage.removeItem('userId');
        
        // Clear cart and wishlist state
        useCartStore.getState().setLocalState({ items: [], userId: null });
        useWishlistStore.getState().setLocalState({ items: [], userId: null });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ error: error.message, isLoading: false });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      
      // Clear cart and wishlist state
      useCartStore.getState().setLocalState({ items: [], userId: null });
      useWishlistStore.getState().setLocalState({ items: [], userId: null });
    }
  },

  setUser: (userData, token) => {
    if (!userData || !token) {
      console.error('Invalid user data or token');
      return;
    }

    set({ user: userData, token, error: null });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userId', userData._id);
    
    // Initialize cart and wishlist with new user data
    useCartStore.getState().initializeCart(userData._id);
    useWishlistStore.getState().initializeWishlist(userData._id);
  },

  logout: async () => {
    try {
      await getCurrentUser(); // This will clear the token if it's invalid
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ user: null, token: null, error: null });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      
      // Clear cart and wishlist state
      useCartStore.getState().setLocalState({ items: [], userId: null });
      useWishlistStore.getState().setLocalState({ items: [], userId: null });
    }
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;
