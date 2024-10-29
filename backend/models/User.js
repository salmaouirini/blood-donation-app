// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber1: { type: String, required: true },
    phoneNumber2: { type: String },
    city: { type: String, required: true },
    bloodType: { type: String },
    role: { type: String, enum: ['donor', 'recipient', 'hospital'], required: true },
    medicalAnswers: {
        type: Map,
        of: Boolean,
    },
    illnessDetails: { type: String },
    hospitalName: { type: String },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
