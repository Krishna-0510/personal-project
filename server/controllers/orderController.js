const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Settings = require('../models/Settings');

// @route  POST /api/orders
// @desc   Place a new order
const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, pickupSlot, pickupDate, paymentMethod } = req.body;

    // Check if orders are open today
    const settings = await Settings.findOne();
    if (settings && !settings.ordersOpenForToday) {
      return res.status(400).json({ message: 'Orders are closed for today. Please try tomorrow.' });
    }

    // Check max 5 orders per user per hour (anti-fake orders)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentOrders = await Order.countDocuments({
      user: req.user.id,
      createdAt: { $gte: oneHourAgo }
    });

    if (recentOrders >= 5) {
      return res.status(400).json({ message: 'Too many orders. Please try again later.' });
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      pickupSlot,
      pickupDate,
      paymentMethod: paymentMethod || 'pay_at_shop'
    });

    // Clear cart after order placed
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [], totalAmount: 0 }
    );

    res.status(201).json({ success: true, order });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/orders/my-orders
// @desc   Get logged in user orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/orders/:id
// @desc   Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Make sure user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ success: true, order });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/orders/:id/cancel
// @desc   Cancel order within 5 minutes
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check ownership
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check 5 minute cancellation window
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (order.createdAt < fiveMinutesAgo) {
      return res.status(400).json({ message: 'Cancellation window of 5 minutes has passed.' });
    }

    // Check if already accepted
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel order that is already being processed.' });
    }

    order.status = 'declined';
    order.cancelledAt = new Date();
    await order.save();

    res.status(200).json({ success: true, message: 'Order cancelled successfully', order });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/orders
// @desc   Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/orders/:id/status
// @desc   Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
};