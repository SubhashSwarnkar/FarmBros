const express = require("express");
const Store = require("../Models/Store");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Store:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         city:
 *           type: string
 *         address:
 *           type: string
 *         owner:
 *           type: string
 *         isActive:
 *           type: boolean
 *         location:
 *           type: object
 *           properties:
 *             longitude:
 *               type: number
 *             latitude:
 *               type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 6123456789abcdef01234567
 *         name: FreshMart
 *         city: Mumbai
 *         address: "123 Street, Mumbai"
 *         owner: 6123456789abcdef01234567
 *         isActive: true
 *         location:
 *           longitude: 72.8777
 *           latitude: 19.0760
 *         createdAt: 2023-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /api/stores/add:
 *   post:
 *     summary: Add a new store
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Store object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - city
 *               - address
 *               - longitude
 *               - latitude
 *             properties:
 *               name:
 *                 type: string
 *                 example: FreshMart
 *               city:
 *                 type: string
 *                 example: Mumbai
 *               address:
 *                 type: string
 *                 example: "123 Street, Mumbai"
 *               longitude:
 *                 type: number
 *                 example: 72.8777
 *               latitude:
 *                 type: number
 *                 example: 19.076
 *     responses:
 *       201:
 *         description: Store added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Store added successfully
 *                 store:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6123456789abcdef01234567
 *                     name:
 *                       type: string
 *                       example: FreshMart
 *                     city:
 *                       type: string
 *                       example: Mumbai
 *                     address:
 *                       type: string
 *                       example: "123 Street, Mumbai"
 *                     owner:
 *                       type: string
 *                       example: 6123456789abcdef01234567
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     location:
 *                       type: object
 *                       properties:
 *                         longitude:
 *                           type: number
 *                           example: 72.8777
 *                         latitude:
 *                           type: number
 *                           example: 19.076
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-01-01T00:00:00.000Z"
 *       400:
 *         description: Bad request (Missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Longitude and latitude are required"
 *       500:
 *         description: Internal Server Error
 */



// Add a new store
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { name, city, address, longitude, latitude } = req.body;

    // Check for missing longitude and latitude
    if (longitude === undefined || latitude === undefined) {
      return res.status(400).json({ error: "Longitude and latitude are required" });
    }

    // Create a new store instance
    const newStore = new Store({
      name,
      city,
      address,
      owner: req.user.id,  // Store the owner's ID from the token
      isActive: true, // Default to active
      location: { longitude, latitude }
    });

    // Save to database
    await newStore.save();

    // Send the expected response format
    res.status(201).json({
      message: "Store added successfully",
      store: {
        _id: newStore._id,
        name: newStore.name,
        city: newStore.city,
        address: newStore.address,
        owner: newStore.owner,
        isActive: newStore.isActive,
        location: {
          longitude: newStore.location.longitude,
          latitude: newStore.location.latitude
        },
        createdAt: newStore.createdAt
      }
    });

  } catch (error) {
    console.error("Error adding store:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = router;

  
  

/**
 * @swagger
 * /api/stores:
 *   get:
 *     summary: Get all active stores
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: A list of active stores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req, res) => {
    try {
      const stores = await Store.find({ isActive: true }).select("-__v");
      res.json(stores);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

/**
 * @swagger
 * /api/stores/{city}:
 *   get:
 *     summary: Get active stores by city
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City to filter stores
 *     responses:
 *       200:
 *         description: A list of active stores in the specified city
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 *       500:
 *         description: Internal Server Error
 */
router.get("/:city", async (req, res) => {
  try {
    const stores = await Store.find({ city: req.params.city, isActive: true });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/stores/{id}:
 *   delete:
 *     summary: Delete a store (owner only)
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the store to delete
 *     responses:
 *       200:
 *         description: Store deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Store deleted successfully
 *       403:
 *         description: Unauthorized to delete this store
 *       404:
 *         description: Store not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });
    if (store.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized to delete this store" });

    await Store.findByIdAndDelete(req.params.id);
    res.json({ message: "Store deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
