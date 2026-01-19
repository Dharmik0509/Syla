import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';
import API_HOST from '../config';

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_HOST}/api/add-subscriber`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                setEmail('');
            } else {
                alert(data.message || 'Subscription failed');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong');
        }
    };
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-section">
                    <h4>VISIT US</h4>
                    <a
                        href="https://www.google.com/maps/dir/?api=1&destination=Trivedi+House,+Chandralok+Society,+Opp+Mahendra+Shah+Hospital,+Bhalej+Road,+Anand+-+388001"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                        <p>Trivedi House, Chandralok Society</p>
                        <p>Opp Mahendra Shah Hospital,</p>
                        <p>Bhalej Road, Anand - 388001, (Guj)</p>
                    </a>
                    <br />
                    <p><a href="tel:+919274720033">+91 92747 20033</a></p>
                    <p><a href="mailto:sylalife@gmail.com">sylalife@gmail.com</a></p>
                </div>

                <div className="footer-section">
                    <h4>INFORMATION</h4>
                    <ul>
                        <li><Link to="/about">Our Story</Link></li>


                        <li><Link to="/contact">Contact Us</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>CUSTOMER SERVICE</h4>
                    <ul>
                        <li><Link to="/pages/shipping-delivery">Shipping & Delivery</Link></li>
                        <li><Link to="/pages/returns-exchanges">Returns & Exchanges</Link></li>
                        <li><Link to="/pages/terms-conditions">Terms & Conditions</Link></li>
                        <li><Link to="/pages/privacy-policy">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div className="footer-section newsletter">
                    <h4>SUBSCRIBE</h4>
                    <p>Join our family to receive updates on new launches and events.</p>
                    <form className="newsletter-form" onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            maxLength={50}
                        />
                        <button type="submit">→</button>
                    </form>
                    <div className="social-links">
                        <a href="https://www.facebook.com/share/1CRrJ9W1MT/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
                        <a href="https://www.instagram.com/syla.india?igsh=aWYwOGlwbW85MGRv" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
                        <a href="https://t.me/sylaindia" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><FaTelegramPlane /></a>
                        <a href="https://wa.me/919274720033" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom container">
                <p>© 2026 Syla Banaras. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
