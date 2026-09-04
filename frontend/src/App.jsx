import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { API_BASE_URL } from './config/api';
import Navbar from './components/Navbar';
import ProfileSidebar from './components/ProfileSidebar';
import HomePage from './pages/HomePage';
import ExploreProductsPage from './pages/ExploreProductsPage';
import AdminPage from './pages/AdminPage';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';

function MainApp() {
  const { user, token } = useAuth();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [searchQuery, setSearchQuery] = useState('');

  // Keep searchQuery input in sync with URL ?search= param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam !== null) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  // Normalize product ID helper
  const getProdId = (item) => item.id || item._id || (item.product && (item.product._id || item.product));

  // Helper to format backend cart items array for React state
  const formatCartItems = (items = []) => {
    return items.map((i) => ({
      id: i.product?._id || i.product || i._id,
      name: i.name,
      price: i.price,
      image: i.image,
      quantity: i.quantity,
    }));
  };

  // Fetch cart directly from database using JWT token
  useEffect(() => {
    const fetchCartFromDB = async () => {
      if (token) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/cart`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            setCartItems(formatCartItems(data.items));
          } else if (res.status === 401) {
            setCartItems([]);
          }
        } catch (err) {
          console.error('Error fetching cart from DB:', err);
        }
      } else {
        // Reset cart when user is logged out (Cart stored in DB only)
        setCartItems([]);
      }
    };

    fetchCartFromDB();
  }, [token]);

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  // Add product to cart directly in DB
  const handleAddToCart = async (product) => {
    if (!token) {
      // Require user to sign in to add items to database cart
      handleOpenAuth('login');
      return;
    }

    const prodId = getProdId(product);

    try {
      const res = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: prodId,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(formatCartItems(data.items));
      } else if (res.status === 401) {
        handleOpenAuth('login');
      }
    } catch (err) {
      console.error('Error updating cart in DB:', err);
    }
  };

  // Update item quantity directly in DB
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    if (!token) {
      handleOpenAuth('login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/item`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(formatCartItems(data.items));
      }
    } catch (err) {
      console.error('Error updating cart item in DB:', err);
    }
  };

  // Remove item directly from DB
  const handleRemoveItem = async (productId) => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/item/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(formatCartItems(data.items));
      }
    } catch (err) {
      console.error('Error removing cart item from DB:', err);
    }
  };

  // Clear all items directly from DB
  const handleClearCart = async () => {
    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Error clearing cart in DB:', err);
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app-root">
      {/* Navigation Bar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={handleOpenAuth}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Route Views */}
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onAddToCart={handleAddToCart}
                onOpenAuth={handleOpenAuth}
              />
            }
          />
          <Route
            path="/products"
            element={
              <ExploreProductsPage
                onAddToCart={handleAddToCart}
                searchQuery={searchQuery}
              />
            }
          />
          {/* Admin Panel Route */}
          <Route
            path="/admin-pannel"
            element={<AdminPage onOpenAuth={handleOpenAuth} />}
          />
          <Route
            path="/admin-panel"
            element={<AdminPage onOpenAuth={handleOpenAuth} />}
          />
        </Routes>
      </main>

      <Footer />

      {/* Profile / Navigation Sidebar Drawer */}
      <ProfileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenAuth={handleOpenAuth}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOpenAuth={handleOpenAuth}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  );
}
