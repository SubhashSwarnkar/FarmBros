const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  image: { type: String, required: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  isTopProduct: { type: Boolean, default: false },
  quantities: [
    {
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", ProductSchema);
