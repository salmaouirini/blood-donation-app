// components/DonorList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DonorList = ({ bloodType, city }) => {
    const [donors, setDonors] = useState([]);

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/donors?bloodType=${bloodType}&city=${city}`);
                setDonors(response.data);
            } catch (error) {
                console.error('Error fetching donors', error);
            }
        };

        fetchDonors();
    }, [bloodType, city]);

    return (
        <div>
            <h2>Available Donors</h2>
            <ul>
                {donors.map((donor) => (
                    <li key={donor._id}>
                        {donor.fullName} - {donor.city} - {donor.bloodType}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DonorList;
