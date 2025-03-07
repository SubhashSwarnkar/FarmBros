const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Replacing owner with storeId
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isActive: { type: Boolean, default: true },
  location: {
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Store", StoreSchema);
