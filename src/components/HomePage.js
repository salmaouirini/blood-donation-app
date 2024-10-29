// components/HomePage.js
import { useEffect, React } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import '../style.css'
const HomePage = () => {
    const location = useLocation();

    useEffect(() => {
        // Check if we have a section to scroll to
        if (location.state && location.state.scrollTo) {
            const section = document.getElementById(location.state.scrollTo);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }

        const sections = document.querySelectorAll('.section');
        const handleScroll = () => {
            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom >= 0) {
                    section.classList.add('animate');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Call once on mount to trigger animations immediately if in view

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location.state]);
    return (
        <div>
            
            {/* First Section with Image and Description */}
            <section className="section">
                <div id='home' className="section-description">
                    <h2>Join Our Community</h2>
                    <p>
                        Help save lives by donating blood. Register now as a donor or recipient and
                        connect with those in need. Your small contribution can make a big difference.
                    </p>
                    <Link to="/register" className="join-now-btn">
                        Join Now
                    </Link>
                    
                </div>
            </section>
            <hr></hr>
            <section className='section'>
            <div id="about" className="about-section">
                <h2>About Us</h2>
                <p>
                    Our blood donation app connects donors and recipients to ensure a reliable
                    supply of blood for medical emergencies. We aim to create a community that
                    supports each other in times of need.
                </p>
            </div>
        </section>
        <hr></hr>
        <section id="contact" className="section contact-section">
                {/* Left: Contact Image */}
                <div className="contact-image">
                    <img src="/Background.png" alt="Contact Us" />
                </div>

                {/* Right: Contact Details */}
                <div className="contact-page">
                    <h2>Contact Us</h2>
                    <p>Email: support@blooddonationapp.com</p>
                    <p>Phone: +123 456 7890</p>
                    <p>Address: 123 Donation Street, City, Country</p>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
