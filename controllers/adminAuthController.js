const Admin = require('../Models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ error: 'Admin not found' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: admin._id, role: 'Admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
