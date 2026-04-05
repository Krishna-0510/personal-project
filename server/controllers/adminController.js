const Admin = require('../models/Admin');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const PriceChangeLog = require('../models/PriceChangeLog');
const Settings = require('../models/Settings');
const jwt = require('jsonwebtoken');

// Generate admin token
const generateAdminToken = (id, phone) => {
  return jwt.sign(
    { id, phone, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @route  POST /api/admin/login
// @desc   Admin login with phone + password
const adminLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ phone });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateAdminToken(admin._id, admin.phone);

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        phone: admin.phone
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/admin/dashboard
// @desc   Get dashboard stats
const getDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get stats
    const totalOrders = await Order.countDocuments();
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments({ isActive: true });

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name phone')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        todayOrders,
        pendingOrders,
        totalUsers,
        totalProducts
      },
      recentOrders
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/admin/price-logs
// @desc   Get all price change logs
const getPriceChangeLogs = async (req, res) => {
  try {
    const logs = await PriceChangeLog.find()
      .populate('product', 'name price')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, logs });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/admin/settings
// @desc   Get shop settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.status(200).json({ success: true, settings });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/admin/settings
// @desc   Update shop settings
const updateSettings = async (req, res) => {
  try {
    const {
      cutoffTime,
      ordersOpenForToday,
      upiId,
      upiQrImage,
      pickupSlots,
      shopMessage,
      isShopOpen
    } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findOneAndUpdate(
        {},
        {
          cutoffTime,
          ordersOpenForToday,
          upiId,
          upiQrImage,
          pickupSlots,
          shopMessage,
          isShopOpen
        },
        { new: true }
      );
    }

    res.status(200).json({ success: true, settings });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  adminLogin,
  getDashboard,
  getPriceChangeLogs,
  getSettings,
  updateSettings
};