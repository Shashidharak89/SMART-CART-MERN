const Cart = require('../models/Cart');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error fetching cart' });
  }
};

// @desc    Add item to cart or sync multiple items
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, name, price, image, quantity = 1, items } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Bulk sync if array of items provided
    if (items && Array.isArray(items)) {
      items.forEach((item) => {
        const itemProdId = item.id || item.productId || item._id;
        const existingIdx = cart.items.findIndex(
          (i) => i.product.toString() === itemProdId.toString()
        );

        if (existingIdx > -1) {
          cart.items[existingIdx].quantity = Math.max(
            cart.items[existingIdx].quantity,
            item.quantity || 1
          );
        } else {
          cart.items.push({
            product: itemProdId,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity || 1,
          });
        }
      });
    } else if (productId) {
      // Single item add
      const existingIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId.toString()
      );

      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += Number(quantity);
      } else {
        cart.items.push({
          product: productId,
          name,
          price,
          image,
          quantity: Number(quantity),
        });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: error.message || 'Server error updating cart' });
  }
};

// @desc    Update quantity of item in cart
// @route   PUT /api/cart/item
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = Number(quantity);
      }
      await cart.save();
      return res.json(cart);
    }

    res.status(404).json({ message: 'Item not found in cart' });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: error.message || 'Server error updating cart item' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/item/:productId
// @access  Private
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Server error removing item from cart' });
  }
};

// @desc    Clear user cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared successfully', items: [] });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error clearing cart' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
