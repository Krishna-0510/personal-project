const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getDashboard,
  getPriceChangeLogs,
  getSettings,
  updateSettings
} = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/verifyToken');

// Public route
router.post('/login', adminLogin);

// Admin protected routes
router.get('/dashboard', verifyAdmin, getDashboard);
router.get('/price-logs', verifyAdmin, getPriceChangeLogs);
router.get('/settings', verifyAdmin, getSettings);
router.put('/settings', verifyAdmin, updateSettings);

module.exports = router;