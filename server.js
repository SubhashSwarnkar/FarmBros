require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const storeManagerRoutes = require("./routes/storeManagerRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const storeRoutes = require("./routes/storeRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes"); // Add Cart API
const { swaggerUi, swaggerSpec } = require("./config/swagger");

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",  // 🌎 Allows API access from anywhere
  methods: ["GET", "POST", "PUT", "DELETE"],  // Allow all HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"],  // Allow necessary headers
}));



mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes); // Add Cart API route
app.use('/api/admins', adminRoutes);
app.use('/api/store-managers', storeManagerRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
