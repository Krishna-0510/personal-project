const Product = require('../models/Product');
const Category = require('../models/Category');
const PriceChangeLog = require('../models/PriceChangeLog');

// @route  GET /api/products
// @desc   Get all active products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/products/:id
// @desc   Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/products/categories
// @desc   Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1 });

    res.status(200).json({ success: true, categories });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/products
// @desc   Create new product (admin only)
const createProduct = async (req, res) => {
  try {
    const { name, price, unit, category, image } = req.body;

    const product = await Product.create({
      name, price, unit, category, image
    });

    res.status(201).json({ success: true, product });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/products/:id
// @desc   Update product price (admin only) + log price change
const updateProduct = async (req, res) => {
  try {
    const { name, price, unit, category, image } = req.body;

    // Find existing product
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If price changed → save to PriceChangeLog
    if (price && price !== existingProduct.price) {
      await PriceChangeLog.create({
        product: existingProduct._id,
        productName: existingProduct.name,
        oldPrice: existingProduct.price,
        newPrice: price,
        changedBy: 'Father',
        changeMethod: req.body.changeMethod || 'dashboard',
        whatsappCommand: req.body.whatsappCommand || '',
        note: req.body.note || ''
      });
    }

    // Update product
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, unit, category, image, lastPriceUpdate: Date.now() },
      { new: true }
    );

    res.status(200).json({ success: true, product });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/products/:id/stock
// @desc   Update product stock status (admin only)
const updateStock = async (req, res) => {
  try {
    const { inStock } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { inStock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getAllCategories,
  createProduct,
  updateProduct,
  updateStock
};