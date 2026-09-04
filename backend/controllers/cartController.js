const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart from database
// @route   GET /api/cart
// @access  Private (JWT Required)
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

// @desc    Add item to cart or sync items in database
// @route   POST /api/cart
// @access  Private (JWT Required)
const addToCart = async (req, res) => {
  try {
    const { productId, name, price, image, quantity = 1, items } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Bulk sync if array of items provided
    if (items && Array.isArray(items)) {
      for (const item of items) {
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
          let itemName = item.name;
          let itemPrice = item.price;
          let itemImage = item.image;

          if (!itemName || !itemPrice || !itemImage) {
            const dbProduct = await Product.findById(itemProdId);
            if (dbProduct) {
              itemName = itemName || dbProduct.name;
              itemPrice = itemPrice !== undefined ? itemPrice : dbProduct.price;
              itemImage = itemImage || dbProduct.image;
            }
          }

          cart.items.push({
            product: itemProdId,
            name: itemName,
            price: itemPrice,
            image: itemImage,
            quantity: item.quantity || 1,
          });
        }
      }
    } else if (productId) {
      // Single item add
      const existingIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId.toString()
      );

      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += Number(quantity);
      } else {
        let itemName = name;
        let itemPrice = price;
        let itemImage = image;

        if (!itemName || itemPrice === undefined || !itemImage) {
          const dbProduct = await Product.findById(productId);
          if (dbProduct) {
            itemName = itemName || dbProduct.name;
            itemPrice = itemPrice !== undefined ? itemPrice : dbProduct.price;
            itemImage = itemImage || dbProduct.image;
          }
        }

        cart.items.push({
          product: productId,
          name: itemName,
          price: itemPrice,
          image: itemImage,
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

// @desc    Update quantity of item in cart in database
// @route   PUT /api/cart/item
// @access  Private (JWT Required)
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

// @desc    Remove item from cart in database
// @route   DELETE /api/cart/item/:productId
// @access  Private (JWT Required)
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

// @desc    Clear user cart in database
// @route   DELETE /api/cart
// @access  Private (JWT Required)
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
