import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-section">
                    <h4>VISIT US</h4>
                    <p>Ground Floor, Nishat Bagh,</p>
                    <p>Rathyatra, Varanasi 221010</p>
                    <p>India</p>
                    <br />
                    <p><a href="tel:+919876543210">+91 98765 43210</a></p>
                    <p><a href="mailto:customercare@Syla.com">customercare@Syla.com</a></p>
                </div>

                <div className="footer-section">
                    <h4>INFORMATION</h4>
                    <ul>
                        <li><Link to="/about">Our Story</Link></li>
                        <li><Link to="/pages/craft-heritage">Craft & Heritage</Link></li>
                        <li><Link to="/pages/careers">Careers</Link></li>
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
                    <form className="newsletter-form">
                        <input type="email" placeholder="Email Address" required />
                        <button type="submit">→</button>
                    </form>
                    <div className="social-links">
                        <Link to="#">FB</Link>
                        <Link to="#">IG</Link>
                        <Link to="#">YT</Link>
                    </div>
                </div>
            </div>

            <div className="footer-bottom container">
                <p>© 2024 Syla Banaras. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
