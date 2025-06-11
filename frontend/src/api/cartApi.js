import { apiInstance } from './apiConfig';

/**
 * Get the user's cart
 */
export const getCart = async () => {
  try {
    const { data } = await apiInstance.get('/cart');
    return data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

/**
 * Add a product to the cart
 * @param {string} productId - The ID of the product to add
 * @param {number} quantity - The quantity to add
 * @param {string} size - Optional size for clothing items
 */
export const addToCart = async (productId, quantity = 1, size = null) => {
  try {
    const payload = { productId, quantity };
    if (size) payload.size = size;
    
    const { data } = await apiInstance.post('/cart/add', payload);
    return data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

/**
 * Update the quantity of a cart item
 * @param {string} productId - The ID of the product to update
 * @param {number} quantity - The new quantity
 * @param {string} size - Optional size for clothing items
 */
export const updateCartItemQuantity = async (productId, quantity, size = null) => {
  try {
    const payload = { productId, quantity };
    if (size) payload.size = size;
    
    const { data } = await apiInstance.put('/cart/update', payload);
    return data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

/**
 * Remove a product from the cart
 * @param {string} productId - The ID of the product to remove
 * @param {string} size - Optional size for clothing items
 */
export const removeFromCart = async (productId, size = null) => {
  try {
    const url = `/cart/remove/${productId}`;
    const params = size ? { params: { size } } : {};
    
    const { data } = await apiInstance.delete(url, params);
    return data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

/**
 * Clear all items from the cart
 */
export const clearCart = async () => {
  try {
    const { data } = await apiInstance.delete('/cart/clear');
    return data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

/**
 * Sync the cart with the server
 * @param {Array} items - The cart items to sync
 */
export const syncCart = async (items) => {
  try {
    const { data } = await apiInstance.post('/cart/sync', { items });
    return data;
  } catch (error) {
    console.error('Error syncing cart:', error);
    throw error;
  }
};
