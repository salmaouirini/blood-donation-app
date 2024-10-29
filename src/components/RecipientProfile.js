// components/RecipientProfile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaTint } from 'react-icons/fa';
import Navbar from './Navbar';

const RecipientProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [recipient, setRecipient] = useState(() => {
        // Try to get recipient data from location state or localStorage
        return location.state?.recipient || JSON.parse(localStorage.getItem('user'));
    });    
    const [donors, setDonors] = useState([]);
    const [city, setCity] = useState('');
    const [selectedDonor, setSelectedDonor] = useState(null);  // To store selected donor for the modal
    const [showModal, setShowModal] = useState(false);  // Modal visibility state

        useEffect(() => {
            if (recipient) {
                fetchDonors();
            } else {
                // If recipient data is not found, navigate to login
                navigate('/login');
            }
        }, [recipient, navigate]);


    const fetchDonors = async () => {
        if (!recipient) return;
        try {
            const response = await axios.get('http://localhost:5001/api/donors', {
                params: { bloodType: recipient.bloodType, city },
            });
            setDonors(response.data);
        } catch (error) {
            console.error('Error fetching donors:', error);
        }
    };

    const handleDonorClick = (donor) => {
        setSelectedDonor(donor);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    

    const handleEdit = () => {
        navigate(`/update-profile/${recipient._id}`, { state: { user: recipient } });
    };

    return (
        <div className="profile-section">
            <h2>Available Donors</h2>
            <input type="text" placeholder="Filter by city" onChange={(e) => setCity(e.target.value)} />
            <button onClick={fetchDonors}>Filter</button>
            <div className='search-result'>
            <ul >
                {donors.map((donor, index) => (
                    <li key={donor._id} style={{ '--order': index }}>
                        <span onClick={() => handleDonorClick(donor)}>
                            {donor.fullName} - {donor.bloodType}
                        </span>
                    </li>
                ))}
            </ul></div>
            <br></br>
            <hr className='hr'></hr>
            <br></br>
            <h2>Your Profile</h2>
            <div className="profile-info">
            {recipient ? (
            <>
            <p><FaUser /><strong>Name:</strong> {recipient.fullName}</p>
            <p><FaEnvelope /><strong>Email:</strong> {recipient.email}</p>
            <p><FaMapMarkerAlt /><strong>Address:</strong> {recipient.address}</p>
            <p><FaPhoneAlt /><strong>Phone Number:</strong> {recipient.phoneNumber1}</p>
            <p><FaMapMarkerAlt /><strong>City:</strong> {recipient.city}</p>
            <p><strong>Hospital Name:</strong> {recipient.hospitalName}</p>
            <p><strong>Illness Details:</strong> {recipient.illnessDetails}</p>
            <p><FaTint /><strong>Blood Type:</strong> {recipient.bloodType}</p>
            <button onClick={handleEdit}>Edit DonorProfile</button>
            
            </>
            
            ) : (
                <p>Recipient not found.</p>
            )}

            {/* Modal to show donor details */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Donor Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedDonor && (
                        <div>
                            <p><strong>Name:</strong> {selectedDonor.fullName}</p>
                            <p><strong>Email:</strong> {selectedDonor.email}</p>
                            <p><strong>Phone Number 1:</strong> {selectedDonor.phoneNumber1}</p>
                            <p><strong>City:</strong> {selectedDonor.city}</p>
                            <p><strong>Blood Type:</strong> {selectedDonor.bloodType}</p>
                            {/* You can add more donor details here */}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            </div>
        </div>
    );
};

export default RecipientProfile;
