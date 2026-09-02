const express = require('express');
const router = express.Router();

const products = [
  {
    id: '1',
    name: 'Aura Wireless Noise-Canceling Headphones',
    category: 'Electronics',
    price: 249.99,
    originalPrice: 299.99,
    rating: 4.8,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'Immersive sound experience with active noise cancellation and 40-hour battery life.',
    tag: 'Best Seller',
    inStock: true,
  },
  {
    id: '2',
    name: 'Chronos Smart Watch Ultra',
    category: 'Electronics',
    price: 199.50,
    originalPrice: 249.00,
    rating: 4.7,
    reviewsCount: 94,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    description: 'Sleek smart fitness watch with AMOLED retina display, pulse tracking, and GPS.',
    tag: 'Featured',
    inStock: true,
  },
  {
    id: '3',
    name: 'Minimalist Leather Daypack',
    category: 'Fashion',
    price: 119.00,
    originalPrice: 149.00,
    rating: 4.9,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
    description: 'Handcrafted full-grain leather backpack designed for everyday urban commute.',
    tag: 'Trending',
    inStock: true,
  },
  {
    id: '4',
    name: 'Luminary Ceramic Desk Lamp',
    category: 'Home & Living',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.6,
    reviewsCount: 56,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    description: 'Modern warm LED accent lamp with touch dimmer control and matte ceramic finish.',
    tag: 'New Arrival',
    inStock: true,
  },
  {
    id: '5',
    name: 'Verdant Artisan Ceramic Mug Set',
    category: 'Home & Living',
    price: 45.00,
    originalPrice: 55.00,
    rating: 4.9,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    description: 'Set of 4 hand-glazed stoneware coffee mugs designed for warmth and comfort.',
    tag: 'Best Seller',
    inStock: true,
  },
  {
    id: '6',
    name: 'Zenith Ergonomic Mechanical Keyboard',
    category: 'Electronics',
    price: 159.99,
    originalPrice: 189.99,
    rating: 4.8,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    description: 'Custom hot-swappable RGB keyboard with tactile switches and wireless bluetooth.',
    tag: 'Featured',
    inStock: true,
  },
  {
    id: '7',
    name: 'Velocity Running Sneakers',
    category: 'Fashion',
    price: 129.95,
    originalPrice: 159.95,
    rating: 4.7,
    reviewsCount: 79,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    description: 'Ultra-lightweight breathable cushion sneakers engineered for maximum performance.',
    tag: 'Trending',
    inStock: true,
  },
  {
    id: '8',
    name: 'Solstice Polarized Sunglasses',
    category: 'Fashion',
    price: 89.00,
    originalPrice: 110.00,
    rating: 4.5,
    reviewsCount: 63,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
    description: 'UV400 protection polarized lenses with lightweight titanium frame styling.',
    tag: 'Sale',
    inStock: true,
  }
];

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let filtered = [...products];

  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
  }

  res.json(filtered);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

module.exports = router;
