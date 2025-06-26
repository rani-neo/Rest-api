const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');



/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ProductCode
 *               - ProductName
 *               - ProductQuantity
 *               - Product_price
 *             properties:
 *               ProductCode:
 *                 type: number
 *               ProductName:
 *                 type: string
 *               ProductQuantity:
 *                 type: number
 *               Product_price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

// Secure: Only admin can view all products
router.get('/', verifyToken, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.get('/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  const product = new Product(req.body);
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', verifyToken,async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id', verifyToken,  async (req, res) => {
  try {
    const patched = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!patched) return res.status(404).json({ message: 'Product not found' });
    res.json(patched);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', verifyToken,  async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
