const DeliveryPerson = require('../Models/DeliveryPerson');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.deliveryLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const deliveryPerson = await DeliveryPerson.findOne({ email });
        if (!deliveryPerson) return res.status(404).json({ error: 'Delivery Person not found' });

        const isMatch = await bcrypt.compare(password, deliveryPerson.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: deliveryPerson._id, role: 'DeliveryPerson' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, deliveryPerson });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
