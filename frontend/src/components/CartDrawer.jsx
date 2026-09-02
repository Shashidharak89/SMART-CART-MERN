import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import './CartDrawer.css';

const CartDrawer = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenAuth,
}) => {
  const { user, token, updateProfile } = useAuth();
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  // Address form state
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: '',
  });
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  // Pre-fill address when user changes or drawer opens
  useEffect(() => {
    if (user?.address) {
      setAddress({
        street: user.address.street || '',
        city: user.address.city || '',
        state: user.address.state || '',
        zipCode: user.address.zipCode || '',
        country: user.address.country || 'India',
        phone: user.address.phone || '',
      });
    }
  }, [user, isOpen]);

  // Reset checkout state on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCheckoutStep('cart');
        setOrderError('');
        setCreatedOrder(null);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 499 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + shipping;

  const handleStartCheckout = () => {
    if (cartItems.length === 0) return;
    if (!token || !user) {
      onClose();
      onOpenAuth('login');
      return;
    }
    setCheckoutStep('checkout');
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setOrderError('');

    if (!address.street || !address.city || !address.state || !address.zipCode || !address.phone) {
      setOrderError('Please fill in all address details including phone number');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderPayload = {
        orderItems: cartItems,
        shippingAddress: address,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        totalPrice: grandTotal,
        saveAddressToProfile,
      };

      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      // If user opted to save address, sync auth context
      if (saveAddressToProfile) {
        updateProfile({ address });
      }

      setCreatedOrder(data);
      onClearCart();
      setCheckoutStep('success');
    } catch (err) {
      console.error('Error placing order:', err);
      setOrderError(err.message || 'Something went wrong while placing your order.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer slide-left" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-header">
          <div className="cart-title-wrapper">
            {checkoutStep === 'checkout' && (
              <button
                className="cart-back-btn"
                onClick={() => setCheckoutStep('cart')}
                title="Back to cart"
              >
                ←
              </button>
            )}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <h2>
              {checkoutStep === 'checkout'
                ? 'Delivery Address & Payment'
                : checkoutStep === 'success'
                ? 'Order Placed'
                : `Shopping Cart (${cartItems.reduce((a, b) => a + b.quantity, 0)})`}
            </h2>
          </div>
          <button className="cart-close-btn" onClick={onClose}>×</button>
        </div>

        {/* STEP 1: CART ITEMS VIEW */}
        {checkoutStep === 'cart' && (
          <>
            <div className="cart-body">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-cart-icon">🛒</div>
                  <p className="empty-cart-title">Your cart is empty</p>
                  <p className="empty-cart-desc">Add items from our store to get started.</p>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <img src={item.image} alt={item.name} className="cart-item-image" />
                      <div className="cart-item-info">
                        <h4 className="cart-item-name">{item.name}</h4>
                        <span className="cart-item-price">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>

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

                {!token && (
                  <p className="login-notice">
                    🔑 You will be asked to sign in before placing your order.
                  </p>
                )}

                <button
                  className="btn btn-primary checkout-btn"
                  onClick={handleStartCheckout}
                >
                  {token ? 'Proceed to Checkout' : 'Sign In & Checkout'}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT & ADDRESS FORM */}
        {checkoutStep === 'checkout' && (
          <div className="cart-body checkout-form-body">
            {orderError && <div className="checkout-error">{orderError}</div>}

            <form onSubmit={handlePlaceOrder} id="checkout-form">
              <div className="checkout-section">
                <h3 className="section-heading">📍 Shipping Address</h3>
                
                <div className="form-group">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    placeholder="House/Flat No., Street Name, Area"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      placeholder="City"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      placeholder="State"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Zip/Pincode *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={address.zipCode}
                      onChange={handleAddressChange}
                      placeholder="6-digit Pincode"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleAddressChange}
                      placeholder="10-digit Mobile No."
                      required
                    />
                  </div>
                </div>

                <div className="form-checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={saveAddressToProfile}
                      onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                    />
                    Save address to my profile for future orders
                  </label>
                </div>
              </div>

              <div className="checkout-section margin-top">
                <h3 className="section-heading">💳 Payment Method</h3>
                <div className="payment-options">
                  <label className={`payment-option ${paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div>
                      <strong>Cash on Delivery (COD)</strong>
                      <p>Pay in cash when your parcel is delivered</p>
                    </div>
                  </label>

                  <label className={`payment-option ${paymentMethod === 'UPI / NetBanking' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI / NetBanking"
                      checked={paymentMethod === 'UPI / NetBanking'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div>
                      <strong>UPI / NetBanking / Wallet</strong>
                      <p>Instant digital payment via Google Pay, PhonePe, Paytm</p>
                    </div>
                  </label>

                  <label className={`payment-option ${paymentMethod === 'Credit / Debit Card' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Credit / Debit Card"
                      checked={paymentMethod === 'Credit / Debit Card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div>
                      <strong>Credit / Debit Card</strong>
                      <p>Visa, MasterCard, RuPay</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="checkout-summary-box">
                <div className="summary-row">
                  <span>Items Total ({cartItems.reduce((a, b) => a + b.quantity, 0)})</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping Fee</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total-row">
                  <span>Amount Payable</span>
                  <span className="total-val">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary checkout-btn"
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? 'Placing Order...' : `Confirm & Place Order (₹${grandTotal.toLocaleString('en-IN')})`}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: ORDER SUCCESS VIEW */}
        {checkoutStep === 'success' && (
          <div className="cart-success-view fade-in">
            <div className="success-icon">✓</div>
            <h3>Order Placed Successfully!</h3>
            <p className="order-id-badge">Order ID: #{createdOrder?._id}</p>
            <p>Thank you for shopping with SmartCart. Your order has been saved to your account and is currently being processed.</p>
            <div className="order-summary-mini">
              <p><strong>Total Amount:</strong> ₹{createdOrder?.totalPrice?.toLocaleString('en-IN')}</p>
              <p><strong>Payment Method:</strong> {createdOrder?.paymentMethod}</p>
              <p><strong>Deliver To:</strong> {createdOrder?.shippingAddress?.street}, {createdOrder?.shippingAddress?.city}</p>
            </div>
            <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '1.5rem', width: '100%' }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
