import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../config/api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [wishlistProductIds, setWishlistProductIds] = useState([]);
  const [wishlistData, setWishlistData] = useState({
    products: [],
    page: 1,
    pageSize: 20,
    pages: 1,
    totalProducts: 0,
  });
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);

  // Show transient toast notification
  const showToast = (message, type = 'info') => {
    setToastNotification({ message, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 3000);
  };

  // Helper to fetch only Wishlist product IDs for heart state checks
  const fetchWishlistIds = useCallback(async () => {
    if (!token) {
      setWishlistProductIds([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlist?page=1&pageSize=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.wishlistProductIds) {
          setWishlistProductIds(data.wishlistProductIds);
        }
      }
    } catch (err) {
      console.error('Error fetching wishlist product IDs:', err);
    }
  }, [token]);

  // Fetch paginated wishlist for UI displays
  const fetchWishlist = useCallback(async (page = 1, pageSize = 20, keyword = '') => {
    if (!token) {
      setWishlistData({
        products: [],
        page: 1,
        pageSize: 20,
        pages: 1,
        totalProducts: 0,
      });
      setWishlistProductIds([]);
      return;
    }

    setLoadingWishlist(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (keyword && keyword.trim()) {
        queryParams.append('keyword', keyword.trim());
      }

      const res = await fetch(`${API_BASE_URL}/api/wishlist?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setWishlistData({
          products: data.products || [],
          page: data.page || 1,
          pageSize: data.pageSize || 20,
          pages: data.pages || 1,
          totalProducts: data.totalProducts || 0,
        });
        if (data.wishlistProductIds) {
          setWishlistProductIds(data.wishlistProductIds);
        }
      }
    } catch (err) {
      console.error('Error fetching full wishlist:', err);
    } finally {
      setLoadingWishlist(false);
    }
  }, [token]);

  // Sync wishlist when token changes (user logs in / out)
  useEffect(() => {
    if (token) {
      fetchWishlistIds();
    } else {
      setWishlistProductIds([]);
      setWishlistData({
        products: [],
        page: 1,
        pageSize: 20,
        pages: 1,
        totalProducts: 0,
      });
    }
  }, [token, fetchWishlistIds]);

  // Check if a given product is wishlisted
  const isInWishlist = (productId) => {
    if (!productId) return false;
    const strId = (typeof productId === 'object' ? productId._id || productId.id : productId).toString();
    return wishlistProductIds.includes(strId);
  };

  // Add product to user wishlist
  const addToWishlist = async (productId) => {
    if (!token) {
      return { success: false, requireAuth: true, message: 'Please sign in to save items to your wishlist' };
    }

    const strId = (typeof productId === 'object' ? productId._id || productId.id : productId).toString();

    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: strId }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.wishlistProductIds) {
          setWishlistProductIds(data.wishlistProductIds);
        }
        
        if (data.alreadyExists) {
          showToast(data.message || 'Already in wishlist', 'warning');
        } else {
          showToast(data.message || 'Added to wishlist!', 'success');
        }

        return {
          success: true,
          alreadyExists: data.alreadyExists,
          message: data.message,
        };
      } else {
        showToast(data.message || 'Failed to update wishlist', 'error');
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      showToast('Network error updating wishlist', 'error');
      return { success: false, message: err.message };
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    if (!token) return { success: false };

    const strId = (typeof productId === 'object' ? productId._id || productId.id : productId).toString();

    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlist/${strId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        if (data.wishlistProductIds) {
          setWishlistProductIds(data.wishlistProductIds);
        }
        // Filter out locally from wishlistData products array if present
        setWishlistData((prev) => ({
          ...prev,
          products: prev.products.filter((p) => (p._id || p.id).toString() !== strId),
          totalProducts: Math.max(0, prev.totalProducts - 1),
        }));
        showToast('Removed from wishlist', 'info');
        return { success: true, message: data.message };
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
    return { success: false };
  };

  // Toggle wishlist state
  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistProductIds,
        wishlistData,
        loadingWishlist,
        toastNotification,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        fetchWishlist,
        fetchWishlistIds,
        showToast,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
