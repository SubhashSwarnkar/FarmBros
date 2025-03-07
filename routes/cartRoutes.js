const express = require("express");
const router = express.Router();
const Cart = require("../Models/Cart");

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping Cart Management
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get all items in the user's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID to fetch the cart for
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
 */
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.json(cart || { items: [], totalPrice: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 */
router.post("/add", async (req, res) => {
  const { userId, productId, quantity, price } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find((item) => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price });
    }

    cart.totalPrice += price * quantity;
    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/cart/update/{itemId}:
 *   put:
 *     summary: Update quantity of a cart item
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 */
router.put("/update/:itemId", async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ "items._id": itemId });
    if (!cart) return res.status(404).json({ message: "Item not found" });

    const item = cart.items.id(itemId);
    cart.totalPrice -= item.price * item.quantity;
    item.quantity = quantity;
    cart.totalPrice += item.price * quantity;

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/cart/remove/{itemId}:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed successfully
 */
router.delete("/remove/:itemId", async (req, res) => {
  const { itemId } = req.params;

  try {
    const cart = await Cart.findOne({ "items._id": itemId });
    if (!cart) return res.status(404).json({ message: "Item not found" });

    const item = cart.items.id(itemId);
    cart.totalPrice -= item.price * item.quantity;
    item.remove();

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear the entire cart for a user
 *     tags: [Cart]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 */
router.delete("/clear", async (req, res) => {
  const { userId } = req.query;
  try {
    await Cart.findOneAndDelete({ userId });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
