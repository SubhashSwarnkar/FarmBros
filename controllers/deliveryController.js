const DeliveryPerson = require('../Models/Delivery'); // Ensure the model exists

// Register a new Delivery Person
exports.registerDeliveryPerson = async (req, res) => {
    try {
        const { name, email, phone, password, storeId } = req.body;
        if (!storeId) {
            return res.status(400).json({ error: 'Store ID is required' });
        }
        const deliveryPerson = new DeliveryPerson({ name, email, phone, password, storeId });
        await deliveryPerson.save();
        res.status(201).json({ message: 'Delivery Person registered successfully', deliveryPerson });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all Delivery Personnel
exports.getDeliveryPersons = async (req, res) => {
    try {
        const deliveryPersons = await DeliveryPerson.find().populate('storeId', 'name'); // Populating store details
        res.status(200).json(deliveryPersons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Delivery Person
exports.updateDeliveryPerson = async (req, res) => {
    try {
        const updatedDeliveryPerson = await DeliveryPerson.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('storeId', 'name'); // Populating store details
        res.status(200).json(updatedDeliveryPerson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Delivery Person
exports.deleteDeliveryPerson = async (req, res) => {
    try {
        await DeliveryPerson.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Delivery Person deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
