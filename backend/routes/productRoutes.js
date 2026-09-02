const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public route to get products
router.get('/', getProducts);

// Admin-only route to create product
router.post('/', protect, admin, upload.single('image'), createProduct);

// Admin-only route to update product
router.put('/:id', protect, admin, upload.single('image'), updateProduct);

// Admin-only route to delete product
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
