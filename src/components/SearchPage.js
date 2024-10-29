// components/SearchPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';


const SearchPage = () => {
    const [selectedUser, setSelectedUser] = useState(null);  // To store selected donor for the modal
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([]);

    const [city, setCity] = useState('');
    const [bloodType, setBloodType] = useState('');
    const [role, setRole] = useState('donor'); // Default to donor
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        console.log('City:', city);
        console.log('Blood Type:', bloodType);
        console.log('Role:', role);

        const params = {
            ...(city && { city }), // Add city if it's not an empty string
            ...(bloodType && { bloodType }), // Add bloodType if it's not an empty string
            ...(role && { role }) // Add role if it's not an empty string
        };
        console.log('Searching for:', params); // Debugging log

        try {
            const response = await axios.get('http://localhost:5001/api/users', { params });
            console.log('Response data:', response.data); // Log the response data
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);


    return (
        <div>
        <div className='search-page'>
            <label>
                Role:
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="donor">Donor</option>
                    <option value="recipient">Recipient</option>
                </select>
            </label>
            <label>
                City:
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </label>
            <label>
                Blood Type:
                <select value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                </select>
            </label>
            <button onClick={handleSearch}>Search</button>
            </div>
            <div className='search-result'>
            {results.length > 0 && (
                <div>
                    <h3>Results:</h3>
                    <ul>
                        {results.map((user, index) => (
                            <li key={user._id} style={{ '--order': index }}>
                                <span onClick={() => handleUserClick(user)}>
                                    {user.fullName} - {user.role} - {user.bloodType} - {user.city}
                                </span>
                                
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Modal to show User details */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>User Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div>
                            <p><strong>Name:</strong> {selectedUser.fullName}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Phone Number 1:</strong> {selectedUser.phoneNumber1}</p>
                            <p><strong>City:</strong> {selectedUser.city}</p>
                            <p><strong>Blood Type:</strong> {selectedUser.bloodType}</p>
                            {/* You can add more User details here */}
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

export default SearchPage;
