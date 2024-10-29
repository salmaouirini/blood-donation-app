import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);  
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5001/api/login', formData);
    
            console.log('Response data:', response.data);  // Log the response
            const { token, user } = response.data;
    
            if (!token || !user || !user._id) {
                console.log('Invalid login response data:', { token, user });
                throw new Error(`Invalid login response: ${JSON.stringify({ token, user })}`);
            }
            
            
    
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
    
            navigate(`/${user.role}Profile/${user._id}`, { state: { recipient: user } });
            
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || 'Login failed');
            } else {
                setError(err.message || 'An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '20%' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
