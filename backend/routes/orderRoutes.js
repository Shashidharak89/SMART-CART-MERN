const express = require('express');
const router = express.Router();
const {
  createOrder,
  cancelMyOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getAllOrders);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById)
  .delete(protect, admin, deleteOrder);

router.route('/:id/cancel')
  .put(protect, cancelMyOrder);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

module.exports = router;
