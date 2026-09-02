const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');

// Helper function to decrease product stock on order
const decreaseProductStock = async (orderItems) => {
  for (const item of orderItems) {
    const productId = item.product || item.id || item._id;
    if (!productId) continue;
    try {
      const product = await Product.findById(productId);
      if (product) {
        const currentStock = product.countInStock !== undefined ? product.countInStock : 20;
        const newStock = Math.max(0, currentStock - item.quantity);
        product.countInStock = newStock;
        product.inStock = newStock > 0;
        await product.save();
      }
    } catch (err) {
      console.error(`Error decreasing stock for product ${productId}:`, err);
    }
  }
};

// Helper function to restore product stock on order cancellation
const restoreProductStock = async (orderItems) => {
  for (const item of orderItems) {
    const productId = item.product || item.id || item._id;
    if (!productId) continue;
    try {
      const product = await Product.findById(productId);
      if (product) {
        const currentStock = product.countInStock !== undefined ? product.countInStock : 0;
        const newStock = currentStock + item.quantity;
        product.countInStock = newStock;
        product.inStock = newStock > 0;
        await product.save();
      }
    } catch (err) {
      console.error(`Error restoring stock for product ${productId}:`, err);
    }
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      saveAddressToProfile,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.phone) {
      return res.status(400).json({ message: 'Please provide complete shipping address details' });
    }

    // Save order
    const order = new Order({
      user: req.user._id,
      orderItems: orderItems.map((item) => ({
        product: item.id || item.product || item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      })),
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      itemsPrice: Number(itemsPrice),
      shippingPrice: Number(shippingPrice),
      totalPrice: Number(totalPrice),
    });

    const createdOrder = await order.save();

    // Decrease product stock for purchased items
    await decreaseProductStock(createdOrder.orderItems);

    // Clear user DB cart after order placed
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // Optionally save address to user's profile if requested
    if (saveAddressToProfile) {
      await User.findByIdAndUpdate(req.user._id, { address: shippingAddress });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message || 'Server error creating order' });
  }
};

// @desc    Cancel order (User or Admin)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelMyOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify ownership or admin role
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    if (order.status === 'Delivered') {
      return res.status(400).json({ message: 'Delivered orders cannot be cancelled' });
    }

    order.status = 'Cancelled';
    const updatedOrder = await order.save();

    // Restore stock for cancelled items
    await restoreProductStock(order.orderItems);

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: error.message || 'Server error cancelling order' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure authorized user or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Server error fetching order details' });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const previousStatus = order.status;

    if (status) {
      order.status = status;
      if (status === 'Delivered') {
        order.isPaid = true;
        order.paidAt = Date.now();
      }
    }

    const updatedOrder = await order.save();

    // If changing to Cancelled from another status, restore stock
    if (previousStatus !== 'Cancelled' && status === 'Cancelled') {
      await restoreProductStock(order.orderItems);
    }
    // If changing from Cancelled to another status, decrease stock
    else if (previousStatus === 'Cancelled' && status !== 'Cancelled') {
      await decreaseProductStock(order.orderItems);
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error updating order status' });
  }
};

// @desc    Delete order (Admin)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.deleteOne();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server error deleting order' });
  }
};

module.exports = {
  createOrder,
  cancelMyOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};
