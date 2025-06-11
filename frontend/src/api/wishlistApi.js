import { apiInstance } from './apiConfig';

// Get user's wishlist
export const getWishlist = async () => {
  try {
    const response = await apiInstance.get('/wishlist');
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

// Add item to wishlist
export const addToWishlist = async (productId) => {
  try {
    const response = await apiInstance.post('/wishlist/add', { productId });
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (productId) => {
  try {
    const response = await apiInstance.delete(`/wishlist/remove/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

// Clear wishlist
export const clearWishlist = async () => {
  try {
    const response = await apiInstance.delete('/wishlist/clear');
    return response.data;
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    throw error;
  }
};

// Sync wishlist (for when user adds items while offline)
export const syncWishlist = async (items) => {
  try {
    const response = await apiInstance.post('/wishlist/sync', { items });
    return response.data;
  } catch (error) {
    console.error('Error syncing wishlist:', error);
    throw error;
  }
};
