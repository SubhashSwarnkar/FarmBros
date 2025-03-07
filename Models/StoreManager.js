const mongoose = require('mongoose');

const StoreManagerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'StoreManager' },
    profilePicture: { type: String, default: '' },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true } // Added storeId
}, { timestamps: true });

module.exports = mongoose.model('StoreManager', StoreManagerSchema);
