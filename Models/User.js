const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Customer'], default: 'Customer' },
    address: { type: String },
    location: {
        type: {
            lat: { type: Number, required: false },
            lng: { type: Number, required: false }
        },
        default: {}
    },
    profilePicture: { type: String, default: '' },
    savedAddresses: [{ type: String }],  // Multiple addresses for customers
    favoriteStores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],
    paymentMethods: [{ type: String }],  // For future payment integration
    notificationPreferences: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
