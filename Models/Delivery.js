const mongoose = require('mongoose');

const DeliveryPersonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['delivery-person'], default: 'delivery-person' }, // Role added
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true } // Store ID added
}, { timestamps: true });

module.exports = mongoose.model('DeliveryPerson', DeliveryPersonSchema);
