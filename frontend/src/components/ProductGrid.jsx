import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const categories = ['All', 'Electronics', 'Fashion', 'Home & Living'];

const ProductGrid = ({ onAddToCart, searchQuery, gridRef }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory !== 'All') {
          queryParams.append('category', selectedCategory);
        }
        if (searchQuery) {
          queryParams.append('search', searchQuery);
        }

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  return (
    <section className="product-grid-section" ref={gridRef} id="catalog">
      <div className="container">
        {/* Section Header */}
        <div className="grid-header">
          <div>
            <span className="badge badge-brand">Curated Selection</span>
            <h2 className="grid-title">Featured Products</h2>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Container */}
        {loading ? (
          <div className="skeleton-grid">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="skeleton-card"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="products-grid fade-in">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="empty-products fade-in">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <h3>No products found</h3>
            <p>Try adjusting your category filter or search keywords.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
