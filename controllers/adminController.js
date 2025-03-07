const Admin = require('../Models/Admin');

exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const newAdmin = new Admin({ name, email, phone, password });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAdmin = async (req, res) => {
    try {
        const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAdmin = async (req, res) => {
    try {
        await Admin.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
