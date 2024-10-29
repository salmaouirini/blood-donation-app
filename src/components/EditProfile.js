import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const EditProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userData = location.state?.user || {}; 

    const [address, setAddress] = useState(userData.address || '');
    const [city, setCity] = useState(userData.city || '');
    const [phoneNumber1, setPhoneNumber1] = useState(userData.phoneNumber1 || '');
    const [phoneNumber2, setPhoneNumber2] = useState(userData.phoneNumber2 || '');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(`Sending request to: http://localhost:5001/api/update-profile/${userData._id}`);
    
        // Create an object to hold the updates
        const updates = {
            address,
            city,
            phoneNumber1,
        };
    
        // Only include oldPassword and newPassword if newPassword is provided
        if (newPassword) {
            updates.oldPassword = oldPassword; // Include oldPassword for verification
            updates.newPassword = newPassword; // Include newPassword for updating
        }
    
        try {
            const response = await axios.put(`http://localhost:5001/api/update-profile/${userData._id}`, updates);
    
            // Handle successful response
            if (response.data) {
                const updatedUser = response.data.user || response.data; // Ensure you extract the user correctly
                localStorage.setItem('user', JSON.stringify(updatedUser));
                // Navigate based on the user's role
                if (updatedUser.role === 'donor') {
                    navigate(`/donorProfile/${updatedUser._id}`, { state: { donor: updatedUser } });
                } else if (updatedUser.role === 'recipient') {
                    navigate(`/recipientProfile/${updatedUser._id}`, { state: { recipient: updatedUser } });
                }
            }
        } catch (error) {
            console.error('Error updating profile:', error.response ? error.response.data : error);
            setError('Failed to update profile: ' + (error.response ? error.response.data.error : 'Unknown error'));
        }
    };
    
    
    

    return (
        <div style={{ marginTop: '20%' }}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label style={{ width: '70%' }}>
                    Address:
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                </label>
                <br></br>
                <label style={{ width: '70%' }}>
                    City:
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                </label>
                <br></br>
                <label style={{ width: '70%' }}>
                    Phone Number 1:
                    <input type="text" value={phoneNumber1} onChange={(e) => setPhoneNumber1(e.target.value)} />
                </label>
                <br></br>
                <label style={{ width: '70%' }}>
                    Old Password:
                    <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                </label>
                <br></br>
                <label style={{ width: '70%' }}>
                    New Password:
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </label>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProfile;
