import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaTint } from 'react-icons/fa';
import Alert from './Alert';
import Navbar from './Navbar';

const DonorProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [donorData, setDonorData] = useState(() => {
        const initialDonorData = location.state?.donor || JSON.parse(localStorage.getItem('user'));
        console.log("Initial donor data:", initialDonorData);   
        return initialDonorData || {};
    });
    const [alertMessage, setAlertMessage] = useState(location.state?.alert || {});

    useEffect(() => {
        if (!donorData || !donorData._id) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setDonorData(parsedUser);
                console.log('Fetched donor data from localStorage:', parsedUser);  // Debugging line
            } else {
                console.warn('No donor data found, redirecting to login.');
                navigate('/login');
            }
        }
    }, [donorData, navigate]);

    const handleEdit = () => {
        navigate(`/update-profile/${donorData._id}`, { state: { user: donorData } });
    };

    return (
        <div className='profile-section'>
            <h2>Your Profile</h2>  
            {alertMessage.message && <Alert message={alertMessage.message} type={alertMessage.type} />} 

            {donorData ? (
            <div className="profile-info">
                <p><FaUser /> <strong>Full Name:</strong> {donorData.fullName}</p>
                <p><FaEnvelope /> <strong>Email:</strong> {donorData.email}</p>
                <p><FaMapMarkerAlt /> <strong>Address:</strong> {donorData.address}</p>
                <p><FaPhoneAlt /> <strong>Phone Number 1:</strong> {donorData.phoneNumber1}</p>
                <p><FaMapMarkerAlt /> <strong>City:</strong> {donorData.city}</p>
                <p><FaTint /> <strong>Blood Type:</strong> {donorData.bloodType}</p>
                <hr className='hr'></hr>
                <h3>Medical Information</h3>
                <ul className="medical-info" >
                    {Object.entries(donorData.medicalAnswers || {}).map(([question, answer], index) => (
                        <li key={index}>
                            <strong>{question}:</strong> {answer ? 'Yes' : 'No'}
                        </li>
                    ))}
                </ul>

                <button onClick={handleEdit}>Edit Profile</button>
            </div>
        ) : (
            <p>Loading donor data...</p>
        )}
    </div>
    );
};

export default DonorProfile;
