const express = require("express");
const Product = require("../Models/Product");
const { verifyToken } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         image:
 *           type: string
 *         storeId:
 *           type: string
 *         isTopProduct:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 6123456789abcdef01234567
 *         name: Apple
 *         description: Fresh red apple
 *         price: 50
 *         category: Fruits
 *         image: https://example.com/apple.jpg
 *         storeId: 6123456789abcdef01234567
 *         isTopProduct: true
 *         quantities: [
  *          { "quantity": 1, "price": 50 },
  *          { "quantity": 5, "price": 240 },
  *          { "quantity": 10, "price": 450 }
  *           ]
 *         createdAt: 2023-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /api/products/add:
 *   post:
 *     summary: Add a new product associated with a store
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Product object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - image
 *               - storeId
 *               - quantities
 *             properties:
 *               name:
 *                 type: string
 *                 example: Apple
 *               description:
 *                 type: string
 *                 example: Fresh red apple
 *               category:
 *                 type: string
 *                 example: Fruits
 *               image:
 *                 type: string
 *                 example: https://example.com/apple.jpg
 *               storeId:
 *                 type: string
 *                 example: 6123456789abcdef01234567
 *               isTopProduct:
 *                 type: boolean
 *                 example: true
 *               quantities:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     quantity:
 *                       type: number
 *                       example: 1
 *                     price:
 *                       type: number
 *                       example: 50
 *     responses:
 *       201:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product added successfully
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal Server Error
 */

router.post("/add", verifyToken, async (req, res) => {
    try {
      console.log("Received data:", req.body);
      const { name, description, category, image, storeId, isTopProduct, quantities } = req.body;
  
      if (!quantities || !Array.isArray(quantities)) {
        return res.status(400).json({ error: "Quantities must be an array" });
      }
  
      const newProduct = new Product({
        name,
        description,
        category,
        image,
        storeId,
        isTopProduct,
        quantities
      });
  
      await newProduct.save();
      res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

  /**
 * @swagger
 * /api/products/store/{storeId}/product/{productId}:
 *   put:
 *     summary: Update details of a specific product in a selected store
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the store
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *               isTopProduct:
 *                 type: boolean
 *               quantities:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/store/:storeId/product/:productId", async (req, res) => {
    try {
      const { storeId, productId } = req.params;
      const updates = req.body;
  
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId, storeId },
        { $set: updates },
        { new: true }
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found in this store" });
      }
  
      res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


/**
 * @swagger
 * /api/products/store/{storeId}/products:
 *   get:
 *     summary: Get all products for a selected store
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the store
 *     responses:
 *       200:
 *         description: A list of products for the selected store
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal Server Error
 */
router.get("/store/:storeId/products", async (req, res) => {
    try {
      const storeId = req.params.storeId; // Store ID from request params
      console.log("Received storeId:", storeId); // Debugging
  
      const products = await Product.find({ storeId: storeId });
  
      console.log("Products found:", products); // Debugging
  
      if (products.length === 0) {
        return res.status(404).json({ message: "No products found for this store" });
      }
  
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

/**
 * @swagger
 * /api/products/store/{storeId}/categories-products:
 *   get:
 *     summary: Get distinct categories for a selected store
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the store
 *     responses:
 *       200:
 *         description: A list of categories available in the selected store
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Internal Server Error
 */
router.get("/store/:storeId/categories-products", async (req, res) => {
    try {
      const { storeId } = req.params;
  
      // Step 1: Get unique categories for the store
      const categories = await Product.distinct("category", { storeId });
  
      // Step 2: Fetch products for each category
      const categoryProducts = await Promise.all(
        categories.map(async (category) => {
          const products = await Product.find({ storeId, category });
          return { category, products };
        })
      );
  
      res.json(categoryProducts);
    } catch (error) {
      console.error("Error fetching categories and products:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
/**
 * @swagger
 * /api/products/store/{storeId}/product/{productId}:
 *   delete:
 *     summary: Delete a product from a selected store
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the store
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/store/:storeId/product/:productId", async (req, res) => {
  try {
    const { storeId, productId } = req.params;

    // Find and delete the product
    const deletedProduct = await Product.findOneAndDelete({ _id: productId, storeId });

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found in this store" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/products/store/{storeId}/product/{productId}:
 *   get:
 *     summary: Get details of a specific product in a selected store
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the store
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found in this store
 *       500:
 *         description: Internal Server Error
 */
router.get("/store/:storeId/product/:productId", async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.productId, storeId: req.params.storeId });
    if (!product) return res.status(404).json({ message: "Product not found in this store" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
