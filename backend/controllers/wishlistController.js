const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get logged in user wishlist with pagination & search
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 20;
    const searchKeyword = (req.query.keyword || req.query.search || '').trim().toLowerCase();

    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      select: 'name price originalPrice image category rating reviewsCount countInStock description tag',
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    // Extract all wishlisted product IDs as string array for easy frontend status checks
    const wishlistProductIds = wishlist.products.map((p) => p._id.toString());

    // Filter products by search keyword if provided
    let allProducts = wishlist.products || [];
    if (searchKeyword) {
      allProducts = allProducts.filter((product) => {
        if (!product) return false;
        const nameMatch = product.name && product.name.toLowerCase().includes(searchKeyword);
        const catMatch = product.category && product.category.toLowerCase().includes(searchKeyword);
        const descMatch = product.description && product.description.toLowerCase().includes(searchKeyword);
        return nameMatch || catMatch || descMatch;
      });
    }

    const totalProducts = allProducts.length;
    const pages = Math.ceil(totalProducts / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedProducts = allProducts.slice(startIndex, startIndex + pageSize);

    res.json({
      products: paginatedProducts,
      page,
      pageSize,
      pages,
      totalProducts,
      wishlistProductIds,
    });
  } catch (error) {
    console.error('Error in getWishlist:', error);
    res.status(500).json({ message: 'Server error retrieving wishlist' });
  }
};

// @desc    Add product to user wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Verify product exists in DB
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const isAlreadyAdded = wishlist.products.some((id) => id.toString() === productId.toString());

    const wishlistProductIds = wishlist.products.map((id) => id.toString());

    if (isAlreadyAdded) {
      return res.status(200).json({
        message: 'Product already in wishlist',
        alreadyExists: true,
        wishlistProductIds,
      });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    const updatedIds = wishlist.products.map((id) => id.toString());

    res.status(201).json({
      message: 'Product added to wishlist',
      alreadyExists: false,
      wishlistProductIds: updatedIds,
    });
  } catch (error) {
    console.error('Error in addToWishlist:', error);
    res.status(500).json({ message: 'Server error adding product to wishlist' });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId.toString());
    await wishlist.save();

    const wishlistProductIds = wishlist.products.map((id) => id.toString());

    res.json({
      message: 'Product removed from wishlist',
      wishlistProductIds,
    });
  } catch (error) {
    console.error('Error in removeFromWishlist:', error);
    res.status(500).json({ message: 'Server error removing product from wishlist' });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
