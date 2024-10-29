// components/RecipientRegistration.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from './Alert';
import { AuthContext } from '../AuthContext';




const RecipientRegistration = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Use login from AuthContext
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        address: '',
        phoneNumber1: '',
        phoneNumber2: '',
        city: '',
        illnessDetails: '',
        hospitalName: '',
        medicalHistory: {},
    });

    
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [errors, setErrors] = useState({});



    const handleChange = (e) => {
        const { name, value } = e.target;
        // Convert city input to lowercase if the field name is 'city'
        if (name === 'city') {
            setFormData({ ...formData, [name]: value.toLowerCase() });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validate = () => {
            let tempErrors = {};
            // Validation checks
            if (!formData.fullName) tempErrors.fullName = "Full Name is required";
            if (!formData.email) tempErrors.email = "Email is required";
            if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email format is invalid";
            if (!formData.password) tempErrors.password = "Password is required";
            if (formData.password.length < 8) tempErrors.password = "Password must be at least 8 characters";
            if (!formData.phoneNumber1) tempErrors.phoneNumber1 = "Phone number is required";
            if (!formData.city) tempErrors.city = "City is required";
            if (!formData.bloodType) tempErrors.bloodType = "Blood type is required";
        
            setErrors(tempErrors);
            return Object.keys(tempErrors).length === 0; // Return true if no errors
        };

        if (validate()) {
            console.log("Form submitted successfully!");
            const dataToSubmit = {...formData, role: 'donor'};
            // Proceed with form submission logic (e.g., send data to the server)
        
        try {
            const response = await axios.post('http://localhost:5001/api/register', dataToSubmit);
            const { token, user, recipient } = response.data; // Extract token from response
            const alert = { message: response.data.message, type: 'success' };
            login(token);
            localStorage.setItem('user', JSON.stringify(user));

    
            // Navigate to profile and pass the alert and Recipient data
            setTimeout(() => {
                navigate('/RecipientProfile/${recipient._id}', { state: { recipient, alert } });
            }, 2000);
        } catch (error) {
            setAlert({ message: error.response.data.message, type: 'error' }); // Update alert state
        }
    }};
    

    return (
        <form onSubmit={handleSubmit}>
            <h2>Recipient Sign Up</h2>
            <Alert message={alert.message} type={alert.type} /> {/* Display the alert */}

            <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
            {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>} {/* Error message */}

            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>} {/* Error message */}

            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>} {/* Error message */}

            <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
            {errors.address && <div className="invalid-feedback">{errors.address}</div>} {/* Error message */}

            <input type="text" name="phoneNumber1" placeholder="Phone Number 1" onChange={handleChange} required />
            {errors.phoneNumber1 && <div className="invalid-feedback">{errors.phoneNumber1}</div>} {/* Error message */}

            <input type="text" name="city" placeholder="City" onChange={handleChange} required />
            {errors.city && <div className="invalid-feedback">{errors.city}</div>} {/* Error message */}

            <input type="text" name="hospitalName" placeholder="Hospital Name" onChange={handleChange} />
            <input type="text" name="illnessDetails" placeholder="Details of Illness" onChange={handleChange} />

            <select name="bloodType" onChange={handleChange} required>
                <option value="">Select Blood Type</option>
                {bloodTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
            {errors.bloodType && <div className="invalid-feedback">{errors.bloodType}</div>} {/* Error message */}


            {/* Add medical questions for recipients as necessary */}
            {/* You can create a similar array for recipient-specific questions if needed */}

            <button type="submit">Register</button>
        </form>
    );
};

export default RecipientRegistration;
