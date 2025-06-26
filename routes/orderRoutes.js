const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders
 */

//  TEMPORARILY REMOVED verifyToken for testing
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Secure: Only admin can view all products
router.get('/:id', verifyToken, async (req, res) => {
 
  try {
    const orders = await order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', verifyToken,  async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id',  verifyToken,async (req, res) => {
  try {
    const patchedOrder = await Order.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(patchedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
