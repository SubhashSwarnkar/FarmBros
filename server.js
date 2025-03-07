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
const allowedOrigins = [
  "http://localhost:5174", // Store Manager App
  "http://localhost:5173",
 "http://localhost:5000", // Customer App
 
];
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: ["https://farmbros-obhk.onrender.com/"]
  })
);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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
