const StoreManager = require('../Models/StoreManager');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.storeManagerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const storeManager = await StoreManager.findOne({ email });
        if (!storeManager) return res.status(404).json({ error: 'Store Manager not found' });

        const isMatch = await bcrypt.compare(password, storeManager.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: storeManager._id, role: 'StoreManager' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, storeManager });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
