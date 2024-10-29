// hooks/useFormValidation.js
import { useState } from 'react';

const useFormValidation = (initialState) => {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});

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

    const validate = () => {
        let tempErrors = {};
        // Add your validation checks here
        if (!formData.fullName) tempErrors.fullName = "Full Name is required";
        if (!formData.email) tempErrors.email = "Email is required";
        if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email format is invalid";
        if (!formData.password) tempErrors.password = "Password is required";
        if (formData.password.length < 8) tempErrors.password = "Password must be at least 8 characters";
        if (!formData.phoneNumber1) tempErrors.phoneNumber1 = "Phone number is required";
        if (!formData.city) tempErrors.city = "City is required";
        if (!formData.bloodType) tempErrors.bloodType = "Blood type is required";
        
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    return {
        formData,
        errors,
        handleChange,
        validate,
        setFormData,
        setErrors,
    };
};

export default useFormValidation;
