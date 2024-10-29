// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import DonorRegistration from './components/DonorRegistration';
import RecipientRegistration from './components/RecipientRegistration';
import DonorList from './components/DonorList';
import HomePage from './components/HomePage';
import DonorProfile from './components/DonorProfile';
import EditProfile from './components/EditProfile';
import RecipientProfile from './components/RecipientProfile';
import Login from './components/Login';
import SearchPage from './components/SearchPage';
import Navbar from './components/Navbar';
import { AuthProvider } from './AuthContext';

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user')); // Assuming user data is stored in localStorage
        setUser(storedUser);
    }, []);

    return (
        <AuthProvider>
        <Router>
            <Navbar user={user} />
            <Routes>
                <Route path="/" element={<HomePage />} />  
                <Route path="/DonorProfile/:id" element={<DonorProfile />} />
                <Route path="/update-profile/:id" element={<EditProfile />} />
                <Route path="/RecipientProfile/:id" element={<RecipientProfile />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register-donor" component={DonorRegistration} />
                <Route path="/register-recipient" element={RecipientRegistration} />
                <Route path="/donors" component={DonorList} />
                <Route path="/search" element={<SearchPage />} />

                {/* Add other routes as necessary */}
            </Routes>
        </Router>
        </AuthProvider>
    );
};

export default App;
