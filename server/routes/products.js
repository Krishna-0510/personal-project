const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getAllCategories,
  createProduct,
  updateProduct,
  updateStock
} = require('../controllers/productController');
const { verifyAdmin } = require('../middleware/verifyToken');

// Public routes
router.get('/', getAllProducts);
router.get('/categories', getAllCategories);
router.get('/:id', getProductById);

// Admin only routes
router.post('/', verifyAdmin, createProduct);
router.put('/:id', verifyAdmin, updateProduct);
router.put('/:id/stock', verifyAdmin, updateStock);

module.exports = router;