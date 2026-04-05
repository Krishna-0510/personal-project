const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @route  GET /api/cart
// @desc   Get user cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [], totalAmount: 0 });
    }

    res.status(200).json({ success: true, cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/cart/add
// @desc   Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.inStock) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [], totalAmount: 0 });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        price: product.price,
        quantity: quantity || 1,
        unit: product.unit,
        image: product.image
      });
    }

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );

    await cart.save();
    res.status(200).json({ success: true, cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/cart/update
// @desc   Update item quantity in cart
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );

    await cart.save();
    res.status(200).json({ success: true, cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/cart/remove/:productId
// @desc   Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.productId
    );

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );

    await cart.save();
    res.status(200).json({ success: true, cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/cart/clear
// @desc   Clear entire cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [], totalAmount: 0 },
      { new: true }
    );

    res.status(200).json({ success: true, cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};