import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import './AdminPage.css';

const AdminPage = ({ onOpenAuth }) => {
  const { user, token, login } = useAuth();

  const [adminTab, setAdminTab] = useState('products'); // 'products' | 'orders'

  // Product form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [tag, setTag] = useState('New Arrival');
  const [description, setDescription] = useState('');
  const [imageMode, setImageMode] = useState('file'); // 'file' or 'url'
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // UI status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Orders management state
  const [ordersList, setOrdersList] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch current products for management
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      if (res.ok) {
        const data = await res.json();
        setProductsList(data);
      }
    } catch (err) {
      console.error('Error fetching admin products list:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch all customer orders for admin
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrdersList(data);
      }
    } catch (err) {
      console.error('Error fetching admin orders list:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (adminTab === 'orders' && token) {
      fetchOrders();
    }
  }, [adminTab, token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!name || !category || !price) {
      setMessage({ type: 'error', text: 'Name, Category, and Price are required.' });
      return;
    }

    if (imageMode === 'file' && !imageFile) {
      setMessage({ type: 'error', text: 'Please select an image file to upload.' });
      return;
    }

    if (imageMode === 'url' && !imageUrl) {
      setMessage({ type: 'error', text: 'Please provide an image URL.' });
      return;
    }

    setIsSubmitting(true);

    try {
      let res;
      if (imageMode === 'file') {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('price', price);
        if (originalPrice) formData.append('originalPrice', originalPrice);
        formData.append('tag', tag);
        formData.append('description', description);
        formData.append('image', imageFile);

        res = await fetch(`${API_BASE_URL}/api/products`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        res = await fetch(`${API_BASE_URL}/api/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            category,
            price,
            originalPrice,
            tag,
            description,
            imageUrl,
          }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add product');
      }

      setMessage({
        type: 'success',
        text: `Product "${data.name}" added successfully!`,
      });

      // Reset Form
      setName('');
      setPrice('');
      setOriginalPrice('');
      setDescription('');
      setImageFile(null);
      setImagePreview('');
      setImageUrl('');

      fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err);
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Product deleted successfully.' });
        fetchProducts();
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete product');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: `Order status updated to "${newStatus}"` });
        fetchOrders();
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update order status');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  // Authorization Check
  if (!user) {
    return (
      <div className="admin-unauth-container container fade-in">
        <div className="admin-auth-card">
          <div className="admin-lock-icon">🔒</div>
          <h2>Admin Authorization Required</h2>
          <p>Please sign in with an Admin account to access the administration panel.</p>
          <button className="btn btn-primary" onClick={() => onOpenAuth('login')}>
            Sign In to Account
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="admin-unauth-container container fade-in">
        <div className="admin-auth-card">
          <div className="admin-lock-icon">⚠️</div>
          <h2>Access Denied</h2>
          <p>
            Your account (<strong>{user.email}</strong>) has <code>role: "{user.role}"</code>.
            Only users with <code>role: "admin"</code> can access this page.
          </p>

          <div className="admin-demo-box">
            <p><strong>Need Admin Access?</strong></p>
            <p>Register with an email containing <code>admin</code> (e.g. <code>admin@smartcart.com</code>) to automatically get admin privileges.</p>
          </div>

          <button className="btn btn-primary" onClick={() => onOpenAuth('register')}>
            Register Admin Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page container fade-in">
      {/* Admin Dashboard Header */}
      <div className="admin-header">
        <div>
          <span className="badge badge-brand">Admin Portal</span>
          <h1 className="admin-title">Store Operations & Dashboard</h1>
          <p className="admin-subtitle">Logged in as <strong>{user.name}</strong> ({user.email})</p>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="admin-top-tabs">
          <button
            className={`admin-tab-btn ${adminTab === 'products' ? 'active' : ''}`}
            onClick={() => setAdminTab('products')}
          >
            📦 Product Catalog ({productsList.length})
          </button>
          <button
            className={`admin-tab-btn ${adminTab === 'orders' ? 'active' : ''}`}
            onClick={() => setAdminTab('orders')}
          >
            🛍️ Customer Orders ({ordersList.length})
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div className={`admin-alert ${message.type}`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {adminTab === 'products' && (
        <div className="admin-grid">
          {/* Left: Add Product Form */}
          <div className="admin-card add-product-card">
            <h3>Add New Product</h3>

            <form onSubmit={handleAddProduct} className="admin-form">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Wireless Smart Speaker"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Living">Home & Living</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tag</label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="form-input"
                  >
                    <option value="New Arrival">New Arrival</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="Featured">Featured</option>
                    <option value="Trending">Trending</option>
                    <option value="Sale">Sale</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 1499"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Original Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1999"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Image Selection Tabs */}
              <div className="form-group">
                <label className="form-label">Product Image *</label>
                <div className="image-mode-tabs">
                  <button
                    type="button"
                    className={`mode-tab ${imageMode === 'file' ? 'active' : ''}`}
                    onClick={() => setImageMode('file')}
                  >
                    Upload File (Cloudinary)
                  </button>
                  <button
                    type="button"
                    className={`mode-tab ${imageMode === 'url' ? 'active' : ''}`}
                    onClick={() => setImageMode('url')}
                  >
                    Image URL
                  </button>
                </div>

                {imageMode === 'file' ? (
                  <div className="file-upload-box">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      id="product-image-file"
                      className="file-input-hidden"
                    />
                    <label htmlFor="product-image-file" className="file-upload-label">
                      {imagePreview ? (
                        <div className="preview-container">
                          <img src={imagePreview} alt="Preview" className="image-preview" />
                          <span>Change File</span>
                        </div>
                      ) : (
                        <div className="upload-placeholder">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                          <span>Click to upload image file</span>
                        </div>
                      )}
                    </label>
                  </div>
                ) : (
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="form-input"
                  />
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  placeholder="Product highlights and features..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input textarea-input"
                  rows="3"
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary submit-product-btn" disabled={isSubmitting}>
                {isSubmitting ? <span className="spinner"></span> : 'Add Product to Store'}
              </button>
            </form>
          </div>

          {/* Right: Existing Products List */}
          <div className="admin-card list-product-card">
            <h3>Manage Inventory ({productsList.length})</h3>

            {loadingProducts ? (
              <p className="admin-loading-text">Loading catalog...</p>
            ) : (
              <div className="admin-products-table-wrapper">
                <table className="admin-products-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsList.map((prod) => (
                      <tr key={prod.id || prod._id}>
                        <td className="prod-cell-main">
                          <img src={prod.image} alt={prod.name} className="table-thumb" />
                          <div>
                            <span className="table-title">{prod.name}</span>
                            {prod.tag && <span className="badge badge-brand table-tag">{prod.tag}</span>}
                          </div>
                        </td>
                        <td>{prod.category}</td>
                        <td className="table-price">₹{prod.price.toLocaleString('en-IN')}</td>
                        <td>
                          <button
                            className="table-delete-btn"
                            onClick={() => handleDeleteProduct(prod.id || prod._id)}
                            title="Delete Product"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ORDERS MANAGEMENT TAB */}
      {adminTab === 'orders' && (
        <div className="admin-card admin-orders-card">
          <div className="admin-card-header">
            <h3>Customer Orders Management ({ordersList.length})</h3>
            <button className="btn btn-secondary btn-sm" onClick={fetchOrders}>
              🔄 Refresh List
            </button>
          </div>

          {loadingOrders ? (
            <p className="admin-loading-text">Loading customer orders from database...</p>
          ) : ordersList.length === 0 ? (
            <div className="admin-empty-box">
              <p>No customer orders placed yet.</p>
            </div>
          ) : (
            <div className="admin-orders-table-wrapper">
              <table className="admin-orders-table">
                <thead>
                  <tr>
                    <th>Order Details</th>
                    <th>Customer</th>
                    <th>Shipping Address</th>
                    <th>Items Purchased</th>
                    <th>Total & Payment</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersList.map((order) => (
                    <tr key={order._id}>
                      <td className="order-details-cell">
                        <strong>#{order._id.slice(-8).toUpperCase()}</strong>
                        <span className="order-date-text">
                          {new Date(order.createdAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      <td className="user-details-cell">
                        <strong>{order.user?.name || 'User'}</strong>
                        <span>{order.user?.email || 'N/A'}</span>
                      </td>

                      <td className="address-details-cell">
                        <p><strong>{order.shippingAddress?.street}</strong></p>
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}</p>
                        <p>📞 {order.shippingAddress?.phone}</p>
                      </td>

                      <td className="items-details-cell">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="admin-order-item">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="muted">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </td>

                      <td className="price-details-cell">
                        <strong className="order-price-val">₹{order.totalPrice.toLocaleString('en-IN')}</strong>
                        <span className="badge badge-secondary">{order.paymentMethod}</span>
                      </td>

                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className={`status-select status-select-${order.status.toLowerCase()}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
