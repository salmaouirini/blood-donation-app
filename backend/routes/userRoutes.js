require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;




// User Registration
router.post('/register', async (req, res) => {
    const userData = req.body;
    console.log("Received user data:", userData);

    // Basic eligibility check for donors
    if (userData.role === 'donor') {
        const { medicalAnswers } = userData;
        const ineligibleReasons = [];

        // Define conditions that make the donor ineligible
        if (medicalAnswers['Do you currently have any chronic illnesses?'] === true) {
            ineligibleReasons.push('you have a chronic illness');
        }
        if (medicalAnswers['Have you ever tested positive for HIV?'] === true) {
            ineligibleReasons.push('you have tested positive for HIV');
        }
        if (medicalAnswers['Have you ever been diagnosed with hepatitis?'] === true) {
            ineligibleReasons.push('you have been diagnosed with hepatitis');
        }
        if (medicalAnswers['Have you experienced any serious infections in the last 12 months?'] === true) {
            ineligibleReasons.push('you had a serious infection in the past year');
        }
        if (medicalAnswers['Are you currently pregnant or breastfeeding?'] === true) {
            ineligibleReasons.push('you are currently pregnant or breastfeeding');
        }

        // Add more conditions as necessary...

        if (ineligibleReasons.length > 0) {
            return res.status(400).json({ 
                message: 'Thank you, but you are not eligible to donate because ' + ineligibleReasons.join(', ') + '.' 
            });
        }
    }

    try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = new User({ ...userData, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: `${userData.role.charAt(0).toUpperCase() + userData.role.slice(1)} registered successfully.`, user: newUser, token });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(400).json({ message: 'Error registering user', error: err });
    }
});

// Get Donors by Blood Type and City
router.get('/donors', async (req, res) => {
    const { bloodType, city } = req.query;
    try {
        const users = await User.find({ bloodType, city, role: 'donor' });
        res.json(users);
    } catch (err) {
        res.status(400).json({ message: 'Error fetching donors', error: err });
    }
});


// Backend route for login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

// GET route for fetching user profile (Add this to retrieve user data)
router.get('/update-profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Error fetching user profile' });
    }
});


router.put('/update-profile/:id', async (req, res) => {
    const userId = req.params.id;
    console.log('Request body for update:', req.body);

    const { address, city, phoneNumber1, oldPassword, newPassword } = req.body;
    const updates = { address, city, phoneNumber1};

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('User found:', user); // Log user details

        // Check if oldPassword is provided and verify it
        if (oldPassword && newPassword) {
            console.log('Old Password:', oldPassword);
            console.log('User Password:', user.password);

            // Verify the old password against the stored hashed password
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Incorrect old password' });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updates.password = hashedPassword;
        }

        // Update user with the provided fields
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Error updating profile' });
    }
});


router.get('/users', async (req, res) => {
    const { city, bloodType, role } = req.query;

    // Build query conditions dynamically
    const conditions = {};
    if (city) conditions.city = city;
    if (bloodType) conditions.bloodType = bloodType;
    if (role) conditions.role = role;

    console.log("Final query conditions:", conditions); // Log conditions to verify

    try {
        const users = await User.find(conditions);     // Query with only defined conditions
        console.log("Users found with conditions:", users);
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
});









module.exports = router;
