const express = require('express');
const { registerAdmin, getAdmins, updateAdmin, deleteAdmin } = require('../controllers/adminController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management APIs login
 */

/**
 * @swagger
 * /api/admins/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       500:
 *         description: Internal server error
 */
router.post('/register', registerAdmin);

/**
 * @swagger
 * /api/admins:
 *   get:
 *     summary: Get all admins
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all admins
 *       500:
 *         description: Internal server error
 */
router.get('/', getAdmins);

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Login an admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Admin login successful
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
 *                 admin:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Admin Name
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post("/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });
  
      if (!admin) return res.status(400).json({ message: "Invalid credentials" });
  
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      res.json({
        message: "Login successful",
        token,
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          createdAt: admin.createdAt,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
/**
 * @swagger
 * /api/admins/{id}:
 *   put:
 *     summary: Update an admin
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Name
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updateAdmin);

/**
 * @swagger
 * /api/admins/{id}:
 *   delete:
 *     summary: Delete an admin
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteAdmin);

module.exports = router;
