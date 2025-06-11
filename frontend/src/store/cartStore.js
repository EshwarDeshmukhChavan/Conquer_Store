// Enhanced Zustand cart store with user-specific storage and backend sync
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as cartApi from '../api/cartApi';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,
      
      // Set local state without affecting MongoDB
      setLocalState: (state) => {
        set(state);
      },
      
      // Initialize cart with user-specific data
      initializeCart: async (userId) => {
        if (!userId) {
          // Clear local state if no user
          set({ items: [], userId: null, isLoading: false });
          return;
        }
        
        try {
          set({ isLoading: true, userId });
          
          // Try to fetch cart from backend
          try {
            const cart = await cartApi.getCart();
            if (cart && cart.items) {
              set({ items: cart.items, isLoading: false });
              return;
            }
          } catch (error) {
            console.error('Failed to fetch cart from API:', error);
            // If API fails, just clear local state
            set({ items: [], isLoading: false });
          }
          
          set({ isLoading: false });
        } catch (error) {
          console.error('Failed to initialize cart:', error);
          set({ error: error.message, isLoading: false, items: [] });
        }
      },
      
      // Clear cart data (used on logout)
      clearCartData: async () => {
        const { userId } = get();
        if (userId) {
          try {
            // Clear cart in MongoDB
            await cartApi.clearCart();
          } catch (error) {
            console.error('Failed to clear cart in MongoDB:', error);
          }
        }
        // Clear local state
        set({ items: [], userId: null, error: null });
      },
      
      // Sync cart with backend
      syncCart: async () => {
        const { items, userId } = get();
        if (!userId) return;
        
        try {
          await cartApi.syncCart(items);
        } catch (error) {
          console.error('Failed to sync cart with backend:', error);
          set({ error: error.message });
        }
      },
      
      // Add item to cart
      addItem: async (product, quantity = 1, size = null, color = null) => {
        try {
          const { items, userId } = get();
          // Find existing item with the same product ID, size, and color
          const existingItem = items.find(item => {
            const productIdMatch =
              item._id === product._id ||
              item.product === product._id ||
              (item.product && item.product._id === product._id);
            const sizeMatch = size ? item.size === size : true;
            const colorMatch = color ? item.color === color : !item.color;
            return productIdMatch && sizeMatch && colorMatch;
          });
          let newItems;
          if (existingItem) {
            // Update quantity of existing item
            newItems = items.map(item => {
              const productIdMatch =
                item._id === product._id ||
                item.product === product._id ||
                (item.product && item.product._id === product._id);
              const sizeMatch = size ? item.size === size : true;
              const colorMatch = color ? item.color === color : !item.color;
              const shouldUpdate = productIdMatch && sizeMatch && colorMatch;
              return shouldUpdate
                ? { ...item, quantity: item.quantity + quantity }
                : item;
            });
          } else {
            // Add new item with size and color if provided
            const newItem = {
              ...product,
              quantity: quantity,
              size: size || null,
              color: color || null
            };
            newItems = [...items, newItem];
          }
          set({ items: newItems });
          // If user is logged in, sync with backend
          if (userId) {
            try {
              const productId = product._id;
              await cartApi.addToCart(productId, quantity, size, color);
            } catch (error) {
              console.error('API error when adding to cart:', error);
              // Revert local state if API call fails
              set({ items });
            }
          }
        } catch (error) {
          console.error('Failed to add item to cart:', error);
          set({ error: error.message });
        }
      },
      
      // Remove item from cart
      removeItem: async (productId, size = null, color = null) => {
        try {
          const { items, userId } = get();
          // Filter out the item with the matching product ID, size, and color
          const newItems = items.filter(item => {
            const productIdMatch =
              item._id === productId ||
              item.product === productId ||
              (item.product && item.product._id === productId);
            const sizeMatch = size ? item.size === size : !item.size;
            const colorMatch = color ? item.color === color : !item.color;
            // Remove only if all match
            return !(productIdMatch && sizeMatch && colorMatch);
          });
          set({ items: newItems });
          // If user is logged in, sync with backend
          if (userId) {
            try {
              await cartApi.removeFromCart(productId, size, color);
            } catch (error) {
              console.error('API error when removing from cart:', error);
              // Revert local state if API call fails
              set({ items });
            }
          }
        } catch (error) {
          console.error('Failed to remove item from cart:', error);
          set({ error: error.message });
        }
      },
      
      // Update item quantity
      updateQuantity: async (productId, quantity, size = null, color = null) => {
        try {
          const { items, userId } = get();
          // Update the quantity of the matching item
          const newItems = items.map(item => {
            const productIdMatch =
              item._id === productId ||
              item.product === productId ||
              (item.product && item.product._id === productId);
            const sizeMatch = size ? item.size === size : true;
            const colorMatch = color ? item.color === color : !item.color;
            const shouldUpdate = productIdMatch && sizeMatch && colorMatch;
            return shouldUpdate
              ? { ...item, quantity: Math.max(1, quantity) }
              : item;
          });
          set({ items: newItems });
          // If user is logged in, sync with backend
          if (userId) {
            try {
              await cartApi.updateCartItemQuantity(productId, quantity, size, color);
            } catch (error) {
              console.error('API error when updating cart quantity:', error);
              // Revert local state if API call fails
              set({ items });
            }
          }
        } catch (error) {
          console.error('Failed to update cart item quantity:', error);
          set({ error: error.message });
        }
      },
      
      // Clear cart
      clearCart: async () => {
        try {
          const { items, userId } = get();
          set({ items: [] });
          
          // If user is logged in, sync with backend
          if (userId) {
            try {
              await cartApi.clearCart();
            } catch (error) {
              console.error('API error when clearing cart:', error);
              // Revert local state if API call fails
              set({ items });
            }
          }
        } catch (error) {
          console.error('Failed to clear cart:', error);
          set({ error: error.message });
        }
      },
      
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.discountedPrice || item.price) * item.quantity,
          0
        );
      }
    }),
    {
      name: 'cart-storage',
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

export default useCartStore;
