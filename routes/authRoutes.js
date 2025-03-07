const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [ User login]
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
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Internal Server Error
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, phone, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [User login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john@example.com
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user)
        return res.status(400).json({ message: "Invalid credentials" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      res.json({
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
/**
 * @swagger
 * /profile/{id}:
 *   put:
 *     summary: Update user profile by ID
 *     description: Update user profile details including name, phone, address, preferences, and location.
 *     tags: [User login]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *               address:
 *                 type: string
 *                 example: "123 Main St, NY"
 *               profilePicture:
 *                 type: string
 *                 example: "https://example.com/profile.jpg"
 *               savedAddresses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Home", "Office"]
 *               favoriteStores:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["65fd1bca5e6b490011c8f221"]
 *               paymentMethods:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Credit Card", "UPI"]
 *               notificationPreferences:
 *                 type: boolean
 *                 example: true
 *               location:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     example: 40.712776
 *                   longitude:
 *                     type: number
 *                     example: -74.005974
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "65fd1bca5e6b490011c8f220"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *                     phone:
 *                       type: string
 *                       example: "+1234567890"
 *                     address:
 *                       type: string
 *                       example: "123 Main St, NY"
 *                     profilePicture:
 *                       type: string
 *                       example: "https://example.com/profile.jpg"
 *                     savedAddresses:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Home", "Office"]
 *                     favoriteStores:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["65fd1bca5e6b490011c8f221"]
 *                     paymentMethods:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Credit Card", "UPI"]
 *                     notificationPreferences:
 *                       type: boolean
 *                       example: true
 *                     location:
 *                       type: object
 *                       properties:
 *                         latitude:
 *                           type: number
 *                           example: 40.712776
 *                         longitude:
 *                           type: number
 *                           example: -74.005974
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: User not found
 *       401:
 *         description: Unauthorized (Invalid Token)
 *       500:
 *         description: Internal Server Error
 */


router.put("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from request parameters
    const { name, phone, password, address, profilePicture, savedAddresses, favoriteStores, paymentMethods, notificationPreferences, location } = req.body;

    let updateFields = { name, phone, address, profilePicture, savedAddresses, favoriteStores, paymentMethods, notificationPreferences };

    if (location && location.lat !== undefined && location.lng !== undefined) {
      updateFields.location = location;
    }
    

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(400).json({ message: "User not found" });

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        profilePicture: updatedUser.profilePicture,
        savedAddresses: updatedUser.savedAddresses,
        favoriteStores: updatedUser.favoriteStores,
        paymentMethods: updatedUser.paymentMethods,
        notificationPreferences: updatedUser.notificationPreferences,
        location: updatedUser.location,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/auth/profile/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [User login]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       400:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude password
    if (!user) return res.status(400).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/auth/profile/all:
 *   get:
 *     summary: Get all users
 *     tags: [User login]
 *     responses:
 *       200:
 *         description: List of all users retrieved successfully
 *       500:
 *         description: Internal Server Error
 */
router.get("/profile/all", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
/**
 * @swagger
 * /api/auth/profile:
 *   delete:
 *     summary: Delete user profile
 *     tags: [User login]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/profile",  async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) return res.status(400).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
