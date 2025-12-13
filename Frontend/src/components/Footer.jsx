import React from 'react';
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
                        <li><a href="#">Our Story</a></li>
                        <li><a href="#">Craft & Heritage</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>CUSTOMER SERVICE</h4>
                    <ul>
                        <li><a href="#">Shipping & Delivery</a></li>
                        <li><a href="#">Returns & Exchanges</a></li>
                        <li><a href="#">Terms & Conditions</a></li>
                        <li><a href="#">Privacy Policy</a></li>
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
                        <a href="#">FB</a>
                        <a href="#">IG</a>
                        <a href="#">YT</a>
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
