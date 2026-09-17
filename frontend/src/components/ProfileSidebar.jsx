import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { API_BASE_URL } from '../config/api';
import { FiMapPin, FiPhone, FiShoppingBag, FiHeart, FiSearch, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import './ProfileSidebar.css';

const ProfileSidebar = ({ isOpen, onClose, onOpenAuth, onOpenCart, onAddToCart, initialTab = 'menu' }) => {
  const { user, token, updateProfile, logout } = useAuth();
  const {
    wishlistData,
    loadingWishlist,
    wishlistProductIds,
    fetchWishlist,
    removeFromWishlist,
  } = useWishlist();

  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(initialTab); // 'menu' | 'address' | 'orders' | 'wishlist'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Wishlist tab pagination and search state
  const [wishlistPage, setWishlistPage] = useState(1);
  const [wishlistSearch, setWishlistSearch] = useState('');

  // Address edit state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: '',
  });
  const [addressSuccessMsg, setAddressSuccessMsg] = useState('');
  const [addressErrorMsg, setAddressErrorMsg] = useState('');

  // Sync initialTab when provided or when drawer opens
  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveTab(initialTab);
      }
    }
  }, [isOpen, initialTab]);

  // Populate address form when user loads
  useEffect(() => {
    if (user?.address) {
      setAddressForm({
        street: user.address.street || '',
        city: user.address.city || '',
        state: user.address.state || '',
        zipCode: user.address.zipCode || '',
        country: user.address.country || 'India',
        phone: user.address.phone || '',
      });
    }
  }, [user]);

  // Fetch orders when tab switches to 'orders'
  useEffect(() => {
    if (activeTab === 'orders' && token) {
      fetchMyOrders();
    }
  }, [activeTab, token]);

  // Fetch wishlist when tab switches to 'wishlist', page changes, or search keyword changes
  useEffect(() => {
    if (activeTab === 'wishlist' && token) {
      fetchWishlist(wishlistPage, 20, wishlistSearch);
    }
  }, [activeTab, token, wishlistPage, wishlistSearch, fetchWishlist]);

  // Reset tab on drawer close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setActiveTab('menu');
        setIsEditingAddress(false);
        setAddressSuccessMsg('');
        setAddressErrorMsg('');
        setWishlistSearch('');
        setWishlistPage(1);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const fetchMyOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/myorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching user orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setAddressSuccessMsg('');
    setAddressErrorMsg('');

    const res = await updateProfile({ address: addressForm });
    if (res.success) {
      setAddressSuccessMsg('Address updated successfully!');
      setIsEditingAddress(false);
      setTimeout(() => setAddressSuccessMsg(''), 3000);
    } else {
      setAddressErrorMsg(res.message || 'Failed to update address');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Quantities will be restored to store inventory.')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setOrders(orders.map((o) => (o._id === orderId ? data : o)));
      } else {
        alert(data.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Error cancelling order');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'status-delivered';
      case 'Shipped':
        return 'status-shipped';
      case 'Processing':
        return 'status-processing';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const handleWishlistAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="sidebar-overlay" onClick={onClose}>
      <div className="sidebar-drawer slide-left" onClick={(e) => e.stopPropagation()}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-user-card">
            {activeTab !== 'menu' && (
              <button
                className="sidebar-back-btn"
                onClick={() => setActiveTab('menu')}
                title="Back to menu"
              >
                ←
              </button>
            )}
            <div className="sidebar-avatar">
              {user ? user.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div className="sidebar-user-details">
              <h3 className="sidebar-user-name">
                {user ? user.name : 'Guest User'}
                {user && user.role === 'admin' && <span className="badge badge-brand sidebar-role-badge">ADMIN</span>}
              </h3>
              <p className="sidebar-user-email">{user ? user.email : 'Sign in to access profile'}</p>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Sidebar Body */}
        <div className="sidebar-body">
          {/* MENU TAB */}
          {activeTab === 'menu' && (
            <>
              <div className="sidebar-section-title">Navigation</div>
              <nav className="sidebar-nav">
                <button
                  className={`sidebar-link ${location.pathname === '/' ? 'active' : ''}`}
                  onClick={() => handleNav('/')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  Home Page
                </button>

                <button
                  className={`sidebar-link ${location.pathname === '/products' ? 'active' : ''}`}
                  onClick={() => handleNav('/products')}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                  Explore Products
                </button>

                {user && (
                  <button
                    className="sidebar-link"
                    onClick={() => setActiveTab('wishlist')}
                  >
                    <FiHeart style={{ fontSize: '18px' }} />
                    My Wishlist
                    {wishlistProductIds.length > 0 && (
                      <span className="sidebar-link-badge">{wishlistProductIds.length}</span>
                    )}
                  </button>
                )}

                {user && user.role === 'admin' && (
                  <button
                    className={`sidebar-link ${location.pathname === '/admin-pannel' ? 'active' : ''}`}
                    onClick={() => handleNav('/admin-pannel')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                    Admin Panel
                  </button>
                )}

                <button
                  className="sidebar-link"
                  onClick={() => {
                    onClose();
                    onOpenCart();
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                  Shopping Cart
                </button>
              </nav>

              <div className="sidebar-divider"></div>

              <div className="sidebar-section-title">Account & Orders</div>
              {user ? (
                <div className="sidebar-account-menu">
                  <button
                    className="sidebar-link"
                    onClick={() => setActiveTab('wishlist')}
                  >
                    <FiHeart style={{ fontSize: '18px', color: '#ef4444' }} />
                    Saved Wishlist
                    {wishlistProductIds.length > 0 && (
                      <span className="sidebar-link-badge badge-rose">{wishlistProductIds.length}</span>
                    )}
                  </button>

                  <button
                    className="sidebar-link"
                    onClick={() => setActiveTab('address')}
                  >
                    <FiMapPin style={{ fontSize: '18px' }} />
                    Saved Delivery Address
                  </button>

                  <button
                    className="sidebar-link"
                    onClick={() => setActiveTab('orders')}
                  >
                    <FiShoppingBag style={{ fontSize: '18px' }} />
                    My Orders
                  </button>

                  <div className="user-info-box margin-top">
                    <p><strong>Role:</strong> {user.role ? user.role.toUpperCase() : 'USER'}</p>
                    <p><strong>Member ID:</strong> #{user._id ? user._id.slice(-6).toUpperCase() : 'N/A'}</p>
                  </div>

                  <button className="sidebar-btn danger" onClick={handleLogout}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="sidebar-guest-actions">
                  <button
                    className="btn btn-primary sidebar-auth-btn"
                    onClick={() => {
                      onClose();
                      onOpenAuth('login');
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    className="btn btn-secondary sidebar-auth-btn"
                    onClick={() => {
                      onClose();
                      onOpenAuth('register');
                    }}
                  >
                    Register
                  </button>
                </div>
              )}
            </>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="sidebar-tab-content">
              <div className="wishlist-tab-header">
                <h3 className="tab-title">
                  <FiHeart style={{ color: '#ef4444', marginRight: '6px' }} />
                  My Wishlist ({wishlistData.totalProducts || 0})
                </h3>

                {/* Wishlist Search Filter Input */}
                <div className="wishlist-search-box">
                  <FiSearch className="wishlist-search-icon" />
                  <input
                    type="text"
                    placeholder="Search in wishlist..."
                    value={wishlistSearch}
                    onChange={(e) => {
                      setWishlistSearch(e.target.value);
                      setWishlistPage(1);
                    }}
                    className="wishlist-search-input"
                  />
                  {wishlistSearch && (
                    <button className="clear-wishlist-search" onClick={() => setWishlistSearch('')}>×</button>
                  )}
                </div>
              </div>

              {loadingWishlist ? (
                <div className="loading-spinner-box">Loading wishlist items...</div>
              ) : !wishlistData.products || wishlistData.products.length === 0 ? (
                <div className="no-orders-box">
                  <FiHeart style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '0.75rem' }} />
                  <p>{wishlistSearch ? 'No wishlist items match your search.' : 'Your wishlist is empty.'}</p>
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: '1rem' }}
                    onClick={() => handleNav('/products')}
                  >
                    Explore Products
                  </button>
                </div>
              ) : (
                <>
                  <div className="wishlist-items-grid">
                    {wishlistData.products.map((item) => (
                      <div key={item._id || item.id} className="wishlist-item-card">
                        <img src={item.image} alt={item.name} className="wishlist-item-img" />
                        <div className="wishlist-item-info">
                          <span className="wishlist-item-category">{item.category}</span>
                          <h4 className="wishlist-item-title">{item.name}</h4>
                          <div className="wishlist-item-price-row">
                            <span className="wishlist-item-price">₹{item.price?.toLocaleString('en-IN')}</span>
                            {item.originalPrice && (
                              <span className="wishlist-item-original-price">
                                ₹{item.originalPrice?.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="wishlist-item-actions">
                          <button
                            className="btn btn-primary wishlist-add-cart-btn"
                            onClick={() => handleWishlistAddToCart(item)}
                            title="Add to Shopping Cart"
                          >
                            <FiShoppingCart size={15} /> Add
                          </button>
                          <button
                            className="wishlist-remove-btn"
                            onClick={() => removeFromWishlist(item._id || item.id)}
                            title="Remove from Wishlist"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Wishlist Pagination Controls */}
                  {wishlistData.pages > 1 && (
                    <div className="wishlist-pagination">
                      <button
                        disabled={wishlistPage <= 1}
                        onClick={() => setWishlistPage((p) => Math.max(1, p - 1))}
                        className="btn btn-secondary pagination-btn"
                      >
                        Prev
                      </button>
                      <span className="pagination-info">
                        Page {wishlistData.page} of {wishlistData.pages}
                      </span>
                      <button
                        disabled={wishlistPage >= wishlistData.pages}
                        onClick={() => setWishlistPage((p) => Math.min(wishlistData.pages, p + 1))}
                        className="btn btn-secondary pagination-btn"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* SAVED ADDRESS TAB */}
          {activeTab === 'address' && (
            <div className="sidebar-tab-content">
              <h3 className="tab-title"><FiMapPin style={{ marginRight: '6px' }} /> Saved Delivery Address</h3>

              {addressSuccessMsg && <div className="alert-success">{addressSuccessMsg}</div>}
              {addressErrorMsg && <div className="alert-error">{addressErrorMsg}</div>}

              {isEditingAddress ? (
                <form onSubmit={handleSaveAddress} className="sidebar-address-form">
                  <div className="form-group">
                    <label>Street Address</label>
                    <input
                      type="text"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      placeholder="Street name, house no."
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      placeholder="City"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      placeholder="State"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Zip/Pincode</label>
                    <input
                      type="text"
                      value={addressForm.zipCode}
                      onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                      placeholder="Pincode"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      placeholder="Phone number"
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Save Address</button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsEditingAddress(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="address-display-box">
                  {user?.address?.street ? (
                    <div className="address-details">
                      <p className="address-street">{user.address.street}</p>
                      <p>{user.address.city}, {user.address.state} - {user.address.zipCode}</p>
                      <p>{user.address.country}</p>
                      <p className="address-phone"><FiPhone style={{ marginRight: '4px' }} /> Phone: {user.address.phone || 'Not provided'}</p>
                    </div>
                  ) : (
                    <p className="no-address-text">No saved shipping address found in your account.</p>
                  )}

                  <button
                    className="btn btn-secondary sidebar-edit-addr-btn"
                    onClick={() => setIsEditingAddress(true)}
                  >
                    {user?.address?.street ? 'Edit Saved Address' : '+ Add Saved Address'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MY ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="sidebar-tab-content">
              <h3 className="tab-title"><FiShoppingBag style={{ marginRight: '6px' }} /> My Orders</h3>

              {loadingOrders ? (
                <div className="loading-spinner-box">Loading your orders...</div>
              ) : orders.length === 0 ? (
                <div className="no-orders-box">
                  <p>You haven't placed any orders yet.</p>
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: '1rem' }}
                    onClick={() => handleNav('/products')}
                  >
                    Explore Products
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order._id} className="order-card">
                      <div className="order-card-header">
                        <div>
                          <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                          <span className="order-date">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="order-items-preview">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="order-item-row">
                            <span className="item-qty">{item.quantity}x</span>
                            <span className="item-name">{item.name}</span>
                            <span className="item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>

                      <div className="order-card-footer">
                        <div className="order-total">
                          <span>Total Amount</span>
                          <strong>₹{order.totalPrice.toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="order-footer-actions">
                          <span className="payment-tag">{order.paymentMethod}</span>
                          {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                            <button
                              className="cancel-order-btn"
                              onClick={() => handleCancelOrder(order._id)}
                              title="Cancel this order"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
