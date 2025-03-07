const express = require('express');
const { 
    registerStoreManager, 
    getStoreManagers, 
    updateStoreManager, 
    deleteStoreManager, 
    storeManagerLogin 
} = require('../controllers/storeManagerController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Store Manager
 *   description: Store Manager management APIs
 */

/**
 * @swagger
 * /api/store-managers/register:
 *   post:
 *     summary: Register a new Store Manager
 *     tags: [Store Manager]
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
 *                 example: storemanager@example.com
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *               password:
 *                 type: string
 *                 example: password123
 *               storeId:
 *                 type: string
 *                 example: "65d3f1a7c4b1e45f8a9b1234"
 *     responses:
 *       201:
 *         description: Store Manager registered successfully
 *       500:
 *         description: Internal server error
 */
router.post('/register', registerStoreManager);

/**
 * @swagger
 * /api/store-managers:
 *   get:
 *     summary: Get all Store Managers (Optionally filter by storeId)
 *     tags: [Store Manager]
 *     parameters:
 *       - in: query
 *         name: storeId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter store managers by store ID
 *     responses:
 *       200:
 *         description: List of all store managers
 *       500:
 *         description: Internal server error
 */
router.get('/', getStoreManagers);

/**
 * @swagger
 * /api/store-managers/login:
 *   post:
 *     summary: Login a Store Manager
 *     tags: [Store Manager]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: storemanager@example.com
 *               password:
 *                 type: string
 *                 example: storemanager123
 *     responses:
 *       200:
 *         description: Store Manager login successful
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/login', storeManagerLogin);

/**
 * @swagger
 * /api/store-managers/{id}:
 *   put:
 *     summary: Update a Store Manager
 *     tags: [Store Manager]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store Manager ID
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
 *               storeId:
 *                 type: string
 *                 example: "65d3f1a7c4b1e45f8a9b1234"
 *     responses:
 *       200:
 *         description: Store Manager updated successfully
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updateStoreManager);

/**
 * @swagger
 * /api/store-managers/{id}:
 *   delete:
 *     summary: Delete a Store Manager
 *     tags: [Store Manager]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store Manager ID
 *     responses:
 *       200:
 *         description: Store Manager deleted successfully
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteStoreManager);

module.exports = router;
