// components/DonorRegistration.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from './Alert';
import { AuthContext } from '../AuthContext';
import useFormValidation from '../hooks/useFormValidation';

const medicalQuestions = [
    {
        question: "Do you currently have any chronic illnesses?",
        type: "boolean",
    },
    {
        question: "Are you currently taking any medications?",
        type: "boolean",
    },
    {
        question: "Have you ever tested positive for HIV?",
        type: "boolean",
    },
    {
        question: "Have you ever been diagnosed with hepatitis?",
        type: "boolean",
    },
    {
        question: "Have you had any surgeries in the last 12 months?",
        type: "boolean",
    },
    {
        question: "Have you experienced any serious infections in the last 12 months?",
        type: "boolean",
    },
    {
        question: "Have you received any vaccinations in the last 4 weeks?",
        type: "boolean",
    },
    {
        question: "Do you smoke?",
        type: "boolean",
    },
    {
        question: "Do you consume alcohol?",
        type: "boolean",
    },
    {
        question: "Have you ever used recreational drugs?",
        type: "boolean",
    },
    {
        question: "Have you traveled outside the country in the last 12 months?",
        type: "boolean",
        followUp: {
            question: "If yes, please list the countries visited:",
            type: "text",
        },
    },
    {
        question: "Are you currently pregnant or breastfeeding?",
        type: "boolean",
    },
    {
        question: "If yes, how long ago did you give birth?",
        type: "text",
    },
    {
        question: "Have you donated blood before?",
        type: "boolean",
    },
    {
        question: "If yes, when was your last donation?",
        type: "text",
    },
    {
        question: "Have you ever been deferred from donating blood?",
        type: "boolean",
    },
    {
        question: "If yes, please explain:",
        type: "text",
    },
    {
        question: "Do you have a family history of any major illnesses?",
        type: "boolean",
    },
    {
        question: "If yes, please specify:",
        type: "text",
    },
    {
        question: "Do you have any allergies?",
        type: "boolean",
    },
    {
        question: "If yes, please specify:",
        type: "text",
    },
    {
        question: "Is there anything else we should know about your health?",
        type: "text",
    },
];

const DonorRegistration = () => {
    const { login } = useContext(AuthContext); // Use login from AuthContext
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        address: '',
        phoneNumber1: '',
        phoneNumber2: '',
        city: '',
        medicalAnswers: {},
    });

    
    const [errors, setErrors] = useState({});

    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const [alert, setAlert] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'bloodType') {
            setFormData({ ...formData, [name]: value });
        } else if (name === 'city') {
            setFormData({ ...formData, [name]: value.toLowerCase() });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleMedicalChange = (question, answer) => {
        setFormData((prevState) => ({
            ...prevState,
            medicalAnswers: { ...prevState.medicalAnswers, [question]: answer },
        }));
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
            const { message, donor, token, user } = response.data;

            // Store token in localStorage
        login(token);
        localStorage.setItem('user', JSON.stringify(user));

        setAlert({ message: 'Thank you! We will be in touch with you as soon as a recipient with a matching blood type needs blood.', type: 'success' });


        // Navigate to profile and pass the alert and donor data
        setTimeout(() => {
            navigate(`/${user.role}Profile/${user._id}`, { state: { donor, alert: { message: 'Registration successful!', type: 'success' } } });
        }, 2000);
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : error.message;
            setAlert({ message: errorMessage, type: 'error' });
        }
    }};

    useEffect(() => {
        console.log("Current errors:", errors);
    }, [errors]);
    
    

    return (
        <form onSubmit={handleSubmit}>
            <h2>Donor Sign Up</h2>
            <Alert message={alert.message} type={alert.type} /> {/* Display the alert */}

            {/* Add input fields for formData properties */}
            <input type="text" name="fullName" className={`form-control ${errors.fullName ? 'is-invalid' : ''}`} placeholder="Full Name" onChange={handleChange} required />
            {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>} {/* Error message */}


            <input type="email" name="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="Email" onChange={handleChange} required />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>} {/* Error message */}


            <input type="password" name="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} placeholder="Password" onChange={handleChange} required />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>} {/* Error message */}


            <input type="text" name="address" className={`form-control ${errors.address ? 'is-invalid' : ''}`} placeholder="Address" onChange={handleChange} required />
            {errors.address && <div className="invalid-feedback">{errors.address}</div>} {/* Error message */}


            <input type="text" name="phoneNumber1" className={`form-control ${errors.phoneNumber1 ? 'is-invalid' : ''}`} placeholder="Phone Number 1" onChange={handleChange} required />
            {errors.phoneNumber1 && <div className="invalid-feedback">{errors.phoneNumber1}</div>} {/* Error message */}

            <input type="text" name="city" className={`form-control ${errors.city ? 'is-invalid' : ''}`} placeholder="City" onChange={handleChange} required />
            {errors.city && <div className="invalid-feedback">{errors.city}</div>} {/* Error message */}


            <select name="bloodType" className={`form-control ${errors.bloodType ? 'is-invalid' : ''}`} onChange={handleChange} required>
                <option value="">Select Blood Type</option>
                {bloodTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select> 
            {errors.bloodType && <div className="invalid-feedback">{errors.bloodType}</div>} {/* Error message */}

            <br /><br/>
            {/* Render medical questions */}
            {medicalQuestions.map((item, index) => (
                <div key={index}>
                    <label>{item.question}</label><br></br>
                    {item.type === 'boolean' ? (
                        <>
                            <input
                                style={{transform: 'scale(1.2)'}}
                                type="radio"
                                name={item.question}
                                value="true"
                                onChange={() => handleMedicalChange(item.question, true)}
                            />Yes
                            <input
                                style={{marginLeft: '50px'}}
                                type="radio"
                                name={item.question}
                                value="false"
                                onChange={() => handleMedicalChange(item.question, false)}
                            />No
                        </>
                
                    ) : (
                        <input
                            type="text"
                            placeholder={item.followUp ? item.followUp.question : ''}
                            onChange={(e) => handleMedicalChange(item.followUp.question, e.target.value)}
                        />
                    )}
                    <hr style={{border: '0.5px solid'}}></hr>
                </div>
            ))}
            
            <button type="submit">Register</button>
        </form>
    );
};

export default DonorRegistration;
