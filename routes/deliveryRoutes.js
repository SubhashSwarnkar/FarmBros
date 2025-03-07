const express = require('express');
const {
  registerDeliveryPerson,
  getDeliveryPersons,
  updateDeliveryPerson,
  deleteDeliveryPerson
} = require('../controllers/deliveryController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Delivery
 *   description: Delivery management APIs
 */

/**
 * @swagger
 * /api/deliveries/register:
 *   post:
 *     summary: Register a new delivery person for a specific store
 *     tags: [Delivery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Delivery
 *               email:
 *                 type: string
 *                 example: delivery@example.com
 *               phone:
 *                 type: string
 *                 example: +1234567892
 *               password:
 *                 type: string
 *                 example: password123
 *               storeId:
 *                 type: string
 *                 example: 65f1c72a9e823c001e4f9b12
 *                 description: Store ID to associate the delivery person with
 *     responses:
 *       201:
 *         description: Delivery person registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Delivery Person registered successfully
 *                 deliveryPerson:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 65f2a73d9e823c001e4fa234
 *                     name:
 *                       type: string
 *                       example: John Delivery
 *                     email:
 *                       type: string
 *                       example: delivery@example.com
 *                     phone:
 *                       type: string
 *                       example: +1234567892
 *                     storeId:
 *                       type: string
 *                       example: 65f1c72a9e823c001e4f9b12
 *       400:
 *         description: Store ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Store ID is required
 *       500:
 *         description: Internal server error
 */
router.post('/register', registerDeliveryPerson);

/**
 * @swagger
 * /api/deliveries/{storeId}:
 *   get:
 *     summary: Get all delivery persons for a specific store
 *     tags: [Delivery]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID to filter delivery persons
 *     responses:
 *       200:
 *         description: List of all delivery persons for the store
 *       500:
 *         description: Internal server error
 */
router.get('/:storeId', getDeliveryPersons);

/**
 * @swagger
 * /api/deliveries/login:
 *   post:
 *     summary: Login a delivery person
 *     tags: [Delivery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: delivery@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                 deliveryPerson:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: John Delivery
 *                     email:
 *                       type: string
 *                       example: delivery@example.com
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const deliveryPerson = await DeliveryPerson.findOne({ email });

      if (!deliveryPerson)
        return res.status(400).json({ message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, deliveryPerson.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: deliveryPerson._id, role: "delivery" },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.json({
        message: "Login successful",
        token,
        deliveryPerson: {
          _id: deliveryPerson._id,
          name: deliveryPerson.name,
          email: deliveryPerson.email,
          phone: deliveryPerson.phone,
          storeId: deliveryPerson.storeId,
          createdAt: deliveryPerson.createdAt,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /api/deliveries/{storeId}/{id}:
 *   put:
 *     summary: Update a delivery person for a specific store
 *     tags: [Delivery]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Delivery Person ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Delivery Person
 *     responses:
 *       200:
 *         description: Delivery person updated successfully
 *       500:
 *         description: Internal server error
 */
router.put('/:storeId/:id', updateDeliveryPerson);

/**
 * @swagger
 * /api/deliveries/{storeId}/{id}:
 *   delete:
 *     summary: Delete a delivery person for a specific store
 *     tags: [Delivery]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Delivery Person ID
 *     responses:
 *       200:
 *         description: Delivery person deleted successfully
 *       500:
 *         description: Internal server error
 */
router.delete('/:storeId/:id', deleteDeliveryPerson);

module.exports = router;
