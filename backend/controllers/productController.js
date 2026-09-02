const Product = require('../models/Product');
const { uploadToCloudinary } = require('../config/cloudinary');

const defaultProducts = [
  {
    name: 'Aura Wireless Noise-Canceling Headphones',
    category: 'Electronics',
    price: 2499,
    originalPrice: 2999,
    rating: 4.8,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: 'Immersive sound experience with active noise cancellation and 40-hour battery life.',
    tag: 'Best Seller',
    inStock: true,
  },
  {
    name: 'Chronos Smart Watch Ultra',
    category: 'Electronics',
    price: 1999,
    originalPrice: 2499,
    rating: 4.7,
    reviewsCount: 94,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    description: 'Sleek smart fitness watch with AMOLED retina display, pulse tracking, and GPS.',
    tag: 'Featured',
    inStock: true,
  },
  {
    name: 'Minimalist Leather Daypack',
    category: 'Fashion',
    price: 1199,
    originalPrice: 1499,
    rating: 4.9,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
    description: 'Handcrafted full-grain leather backpack designed for everyday urban commute.',
    tag: 'Trending',
    inStock: true,
  },
  {
    name: 'Luminary Ceramic Desk Lamp',
    category: 'Home & Living',
    price: 799,
    originalPrice: 999,
    rating: 4.6,
    reviewsCount: 56,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    description: 'Modern warm LED accent lamp with touch dimmer control and matte ceramic finish.',
    tag: 'New Arrival',
    inStock: true,
  },
  {
    name: 'Verdant Artisan Ceramic Mug Set',
    category: 'Home & Living',
    price: 450,
    originalPrice: 550,
    rating: 4.9,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    description: 'Set of 4 hand-glazed stoneware coffee mugs designed for warmth and comfort.',
    tag: 'Best Seller',
    inStock: true,
  },
  {
    name: 'Zenith Ergonomic Mechanical Keyboard',
    category: 'Electronics',
    price: 1599,
    originalPrice: 1899,
    rating: 4.8,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    description: 'Custom hot-swappable RGB keyboard with tactile switches and wireless bluetooth.',
    tag: 'Featured',
    inStock: true,
  },
  {
    name: 'Velocity Running Sneakers',
    category: 'Fashion',
    price: 1299,
    originalPrice: 1599,
    rating: 4.7,
    reviewsCount: 79,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    description: 'Ultra-lightweight breathable cushion sneakers engineered for maximum performance.',
    tag: 'Trending',
    inStock: true,
  },
  {
    name: 'Solstice Polarized Sunglasses',
    category: 'Fashion',
    price: 890,
    originalPrice: 1100,
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
const getProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(defaultProducts);
    }

    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    
    // Map _id to id for frontend compatibility
    const formatted = products.map(p => ({
      id: p._id.toString(),
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      image: p.image,
      description: p.description,
      tag: p.tag,
      inStock: p.inStock,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

// @desc    Create new product (Admin Only with Cloudinary Image Upload)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, category, price, originalPrice, description, tag, imageUrl } = req.body;

    let finalImageUrl = imageUrl;

    // Handle file upload to Cloudinary if file provided
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        finalImageUrl = uploadResult.secure_url;
      } catch (uploadErr) {
        console.error('Cloudinary Upload Error:', uploadErr);
        return res.status(500).json({ message: 'Failed to upload image to Cloudinary: ' + uploadErr.message });
      }
    }

    if (!name || !category || !price || !finalImageUrl) {
      return res.status(400).json({
        message: 'Please provide name, category, price, and a product image (file upload or URL)',
      });
    }

    const product = await Product.create({
      name,
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      image: finalImageUrl,
      description,
      tag: tag || 'New Arrival',
    });

    res.status(201).json({
      id: product._id.toString(),
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      rating: product.rating,
      reviewsCount: product.reviewsCount,
      image: product.image,
      description: product.description,
      tag: product.tag,
      inStock: product.inStock,
    });
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(500).json({ message: error.message || 'Server error creating product' });
  }
};

// @desc    Delete a product (Admin Only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};

module.exports = {
  getProducts,
  createProduct,
  deleteProduct,
};
