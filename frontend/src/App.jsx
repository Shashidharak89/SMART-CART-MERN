import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [searchQuery, setSearchQuery] = useState('');

  // Normalize product ID helper
  const getProdId = (item) => item.id || item._id || (item.product && (item.product._id || item.product));

  // Load cart from DB if logged in, or from localStorage if guest
  useEffect(() => {
    const syncAndFetchCart = async () => {
      if (token) {
        try {
          // Check for guest cart items saved locally before login
          const savedLocalCart = localStorage.getItem('smartcart_guest_cart');
          let localItems = [];
          if (savedLocalCart) {
            try {
              localItems = JSON.parse(savedLocalCart);
            } catch (e) {
              console.error('Error parsing guest cart:', e);
            }
          }

          if (localItems.length > 0) {
            // Post guest items to DB to merge
            await fetch(`${API_BASE_URL}/api/cart`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ items: localItems }),
            });
            localStorage.removeItem('smartcart_guest_cart');
          }

          // Fetch full cart from server
          const res = await fetch(`${API_BASE_URL}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();
            const formattedItems = (data.items || []).map((i) => ({
              id: i.product?._id || i.product || i._id,
              name: i.name,
              price: i.price,
              image: i.image,
              quantity: i.quantity,
            }));
            setCartItems(formattedItems);
          }
        } catch (err) {
          console.error('Error fetching DB cart:', err);
        }
      } else {
        // Guest user: load from localStorage
        const savedLocalCart = localStorage.getItem('smartcart_guest_cart');
        if (savedLocalCart) {
          try {
            setCartItems(JSON.parse(savedLocalCart));
          } catch (e) {
            console.error('Error loading guest cart from storage:', e);
          }
        }
      }
    };

    syncAndFetchCart();
  }, [token]);

  // Persist guest cart to local storage
  useEffect(() => {
    if (!token) {
      localStorage.setItem('smartcart_guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleAddToCart = async (product) => {
    const prodId = getProdId(product);

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => getProdId(item) === prodId);
      if (existing) {
        return prevItems.map((item) =>
          getProdId(item) === prodId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevItems,
        {
          id: prodId,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/cart`, {
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
      } catch (err) {
        console.error('Error syncing add-to-cart with DB:', err);
      }
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        getProdId(item) === productId ? { ...item, quantity: newQuantity } : item
      )
    );

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/cart/item`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, quantity: newQuantity }),
        });
      } catch (err) {
        console.error('Error updating cart item in DB:', err);
      }
    }
  };

  const handleRemoveItem = async (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => getProdId(item) !== productId)
    );

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/cart/item/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error('Error removing cart item from DB:', err);
      }
    }
  };

  const handleClearCart = async () => {
    setCartItems([]);

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/cart`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error('Error clearing cart in DB:', err);
      }
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
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
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
