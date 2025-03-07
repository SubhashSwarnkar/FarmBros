const StoreManager = require('../Models/StoreManager');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.registerStoreManager = async (req, res) => {
    try {
        const { name, email, phone, password, storeId } = req.body;

        // Check if storeId exists (optional validation)
        if (!storeId) {
            return res.status(400).json({ error: "Store ID is required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newStoreManager = new StoreManager({ 
            name, 
            email, 
            phone, 
            storeId, 
            password: hashedPassword 
        });

        await newStoreManager.save();
        res.status(201).json({ message: 'Store Manager registered successfully', storeManager: newStoreManager });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch all store managers (optionally filter by storeId)
exports.getStoreManagers = async (req, res) => {
    try {
        const { storeId } = req.query; // Get storeId from query params
        const filter = storeId ? { storeId } : {}; // If storeId is provided, filter by it

        const storeManagers = await StoreManager.find(filter);
        res.status(200).json(storeManagers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Store Manager
exports.updateStoreManager = async (req, res) => {
    try {
        const updatedStoreManager = await StoreManager.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );

        if (!updatedStoreManager) {
            return res.status(404).json({ error: "Store Manager not found" });
        }

        res.status(200).json(updatedStoreManager);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Store Manager
exports.deleteStoreManager = async (req, res) => {
    try {
        const deletedManager = await StoreManager.findByIdAndDelete(req.params.id);

        if (!deletedManager) {
            return res.status(404).json({ error: "Store Manager not found" });
        }

        res.status(200).json({ message: 'Store Manager deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Store Manager Login
exports.storeManagerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const storeManager = await StoreManager.findOne({ email });

        if (!storeManager) {
            return res.status(404).json({ error: 'Store Manager not found' });
        }

        const isMatch = await bcrypt.compare(password, storeManager.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Include storeId in token payload
        const token = jwt.sign(
            { id: storeManager._id, storeId: storeManager.storeId, role: 'StoreManager' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, storeManager });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
