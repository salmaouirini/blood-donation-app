import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import '../style.css';

const Navbar = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));




    // Handle logout
    const handleLogout = () => {
        logout(); // Call logout from AuthContext
        navigate('/');
    };


    // Check if user exists and has a role before accessing it
    const onClick = () => {
        if (user && user.role) {
            if (user.role === 'donor') {
                navigate('/DonorProfile/:id', { state: { donor: user } });
            } else if (user.role === 'recipient') {
                navigate('/RecipientProfile/:id', { state: { recipient: user } });
            }
        } else {
            console.warn("User data or role is missing.");
            // Optionally, redirect to login or show an error message
            navigate('/login');
        }
    };

    const scrollToSection = (sectionId) => {
        navigate(`/`, { state: { scrollTo: sectionId } });
    };
    



    return (
        <nav className="navbar  fixed-top">
            <a onClick={() => scrollToSection('home')}><img src='/logo.PNG' className='logo'></img></a>
            
            <ul className="nav-links">
            <li>
                    <button onClick={() => scrollToSection('about')} className="nav-link">About Us</button>
                </li>
                <li>
                    <button onClick={() => scrollToSection('contact')} className="nav-link">Contact Us</button>
                </li>
                

                {isLoggedIn ? (
                    <>
                        <li><a href="/search" className="nav-link">Search</a></li>
                        <li><button className='nav-btn' onClick={onClick}>Profile</button></li>
                        <li><button className='nav-btn' onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><button className='nav-btn' onClick={() => navigate('/login')}>Login</button></li>
                        <li><button className='nav-btn' onClick={() => navigate('/register')}>Register</button></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
