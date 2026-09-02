import React, { useState } from 'react';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) => {
  const [checkedOut, setCheckedOut] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 499 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + shipping;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setCheckedOut(true);
    setTimeout(() => {
      onClearCart();
      setCheckedOut(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer slide-left" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-header">
          <div className="cart-title-wrapper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <h2>Shopping Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)})</h2>
          </div>
          <button className="cart-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Checkout Success Message */}
        {checkedOut ? (
          <div className="cart-success-view fade-in">
            <div className="success-icon">✓</div>
            <h3>Order Placed Successfully!</h3>
            <p>Thank you for shopping with SmartCart. Your items are being prepared for dispatch.</p>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="cart-body">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-cart-icon">🛒</div>
                  <p className="empty-cart-title">Your cart is empty</p>
                  <p className="empty-cart-desc">Add some items from our catalog to get started.</p>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <img src={item.image} alt={item.name} className="cart-item-image" />
                      <div className="cart-item-info">
                        <h4 className="cart-item-name">{item.name}</h4>
                        <span className="cart-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        
                        <div className="cart-item-controls">
                          <div className="qty-picker">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="qty-btn"
                            >
                              -
                            </button>
                            <span className="qty-value">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="qty-btn"
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="remove-item-btn"
                            title="Remove item"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer Summary */}
            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span className="summary-val">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="summary-val">
                    {shipping === 0 ? <span className="free-tag">FREE</span> : `₹${shipping.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span className="total-val">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>

                <button
                  className="btn btn-primary checkout-btn"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
