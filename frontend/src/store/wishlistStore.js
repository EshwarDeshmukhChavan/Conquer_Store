// Enhanced Zustand wishlist store with user-specific storage and backend sync
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as wishlistApi from '../api/wishlistApi';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      userId: null,
      isLoading: false,
      error: null,
      
      // Set local state without affecting MongoDB
      setLocalState: (state) => {
        set(state);
      },
      
      // Initialize wishlist with user-specific data
      initializeWishlist: async (userId) => {
        if (!userId) {
          // Clear local state if no user
          set({ items: [], userId: null, isLoading: false });
          return;
        }
        
        try {
          set({ isLoading: true, userId });
          
          // Try to fetch wishlist from backend
          try {
            const wishlist = await wishlistApi.getWishlist();
            if (wishlist && wishlist.items) {
              set({ items: wishlist.items, isLoading: false });
              return;
            }
          } catch (error) {
            console.error('Failed to fetch wishlist from API:', error);
            // If API fails, just clear local state
            set({ items: [], isLoading: false });
          }
          
          set({ isLoading: false });
        } catch (error) {
          console.error('Failed to initialize wishlist:', error);
          set({ error: error.message, isLoading: false, items: [] });
        }
      },
      
      // Clear wishlist data (used on logout)
      clearWishlistData: async () => {
        const { userId } = get();
        if (userId) {
          try {
            // Clear wishlist in MongoDB
            await wishlistApi.clearWishlist();
          } catch (error) {
            console.error('Failed to clear wishlist in MongoDB:', error);
          }
        }
        // Clear local state
        set({ items: [], userId: null, error: null });
      },
      
      // Sync wishlist with backend
      syncWishlist: async () => {
        const { items, userId } = get();
        if (!userId) return;
        
        try {
          await wishlistApi.syncWishlist(items);
        } catch (error) {
          console.error('Failed to sync wishlist with backend:', error);
          set({ error: error.message });
        }
      },
      
      // Add item to wishlist
      addItem: async (product) => {
        try {
          const { items, userId } = get();
          // Check if product is already in wishlist
          const existingItem = items.find(item => 
            item._id === product._id || 
            (item.product && item.product === product._id)
          );
          
          if (!existingItem) {
            set({ items: [...items, product] });
            
            // If user is logged in, sync with backend
            if (userId) {
              try {
                await wishlistApi.addToWishlist(product._id);
              } catch (error) {
                console.error('API error when adding to wishlist:', error);
                // Revert local state if API call fails
                set({ items });
              }
            }
          }
        } catch (error) {
          console.error('Failed to add item to wishlist:', error);
          set({ error: error.message });
        }
      },
      
      // Remove item from wishlist
      removeItem: async (productId) => {
        try {
          const { items, userId } = get();
          const newItems = items.filter(item => 
            item._id !== productId && 
            (item.product !== productId)
          );
          
          set({ items: newItems });
          
          // If user is logged in, sync with backend
          if (userId) {
            try {
              await wishlistApi.removeFromWishlist(productId);
            } catch (error) {
              console.error('API error when removing from wishlist:', error);
              // Revert local state if API call fails
              set({ items });
            }
          }
        } catch (error) {
          console.error('Failed to remove item from wishlist:', error);
          set({ error: error.message });
        }
      },
      
      // Clear wishlist
      clearWishlist: async () => {
        try {
          const { items, userId } = get();
          set({ items: [] });
          
          // If user is logged in, sync with backend
          if (userId) {
            try {
              await wishlistApi.clearWishlist();
            } catch (error) {
              console.error('API error when clearing wishlist:', error);
              // Revert local state if API call fails
              set({ items });
            }
          }
        } catch (error) {
          console.error('Failed to clear wishlist:', error);
          set({ error: error.message });
        }
      },
      
      isInWishlist: (productId) => {
        return get().items.some(item => 
          item._id === productId || 
          (item.product && item.product === productId)
        );
      }
    }),
    {
      name: 'wishlist-storage',
      // Only persist items and userId
      partialize: (state) => ({ 
        items: state.items,
        userId: state.userId 
      }),
      // Generate a unique storage key for each user
      getStorage: () => ({
        getItem: (name) => {
          const userId = localStorage.getItem('userId');
          const key = userId ? `${name}-${userId}` : name;
          return localStorage.getItem(key);
        },
        setItem: (name, value) => {
          const userId = localStorage.getItem('userId');
          const key = userId ? `${name}-${userId}` : name;
          localStorage.setItem(key, value);
        },
        removeItem: (name) => {
          const userId = localStorage.getItem('userId');
          const key = userId ? `${name}-${userId}` : name;
          localStorage.removeItem(key);
        }
      })
    }
  )
);

export default useWishlistStore;
