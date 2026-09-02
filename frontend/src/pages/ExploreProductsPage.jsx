import React from 'react';
import ProductGrid from '../components/ProductGrid';
import './ExploreProductsPage.css';

const ExploreProductsPage = ({ onAddToCart, searchQuery }) => {
  return (
    <div className="explore-products-page fade-in">
      <div className="explore-hero-banner">
        <div className="container">
          <span className="badge badge-brand">Catalog Overview</span>
          <h1 className="explore-page-title">Explore All Products</h1>
          <p className="explore-page-subtitle">
            Browse our complete collection of high-tech gadgets, apparel, and lifestyle decor.
          </p>
        </div>
      </div>

      <ProductGrid
        onAddToCart={onAddToCart}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default ExploreProductsPage;
