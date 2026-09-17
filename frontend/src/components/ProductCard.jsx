import React, { useState } from 'react';
import { FaStar, FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, onOpenAuth }) => {
  const [added, setAdded] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { token } = useAuth();

  const prodId = product._id || product.id;
  const isWishlisted = isInWishlist(prodId);

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    if (!token) {
      if (onOpenAuth) {
        onOpenAuth('login');
      }
      return;
    }

    if (isWishlisted) {
      // Toggle remove or attempt add (User requested: if added says already there in wishlist)
      // Clicking heart when already wishlisted can offer remove or state notification
      await addToWishlist(prodId);
    } else {
      await addToWishlist(prodId);
    }
  };

  const getTagBadgeClass = (tag) => {
    switch (tag) {
      case 'Best Seller':
        return 'badge-emerald';
      case 'Sale':
        return 'badge-rose';
      case 'Featured':
        return 'badge-brand';
      default:
        return 'badge-amber';
    }
  };

  return (
    <div className="product-card">
      {/* Product Image Wrapper */}
      <div className="product-image-container">
        {product.tag && (
          <span className={`badge product-tag ${getTagBadgeClass(product.tag)}`}>
            {product.tag}
          </span>
        )}

        {/* Wishlist Heart Icon Button */}
        <button
          className={`wishlist-heart-btn ${isWishlisted ? 'is-wishlisted' : ''}`}
          onClick={handleWishlistClick}
          title={isWishlisted ? 'Already in Wishlist' : 'Add to Wishlist'}
          type="button"
          aria-label="Wishlist"
        >
          {isWishlisted ? (
            <FaHeart className="heart-icon filled-heart" />
          ) : (
            <FiHeart className="heart-icon outline-heart" />
          )}
        </button>

        <img src={product.image} alt={product.name} className="product-image" />
      </div>

      {/* Product Information */}
      <div className="product-content">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title" title={product.name}>{product.name}</h3>

        {/* Rating Stars */}
        <div className="product-rating">
          <FaStar className="stars" />
          <span className="rating-score">{product.rating}</span>
          <span className="reviews-count">({product.reviewsCount})</span>
        </div>

        {/* Price & Action Button */}
        <div className="product-footer">
          <div className="price-container">
            <span className="price-current">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="price-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>

          <button
            className={`btn ${added ? 'btn-added' : 'btn-primary'} add-cart-btn`}
            onClick={handleAdd}
          >
            {added ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Added!
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
