import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HeroSection.css';

import heroImg1 from '../assets/images/IMG_6940.JPG';
import heroImg2 from '../assets/images/IMG_6941.JPG';
import heroImg3 from '../assets/images/IMG_6942.JPG';

const heroImages = [heroImg1, heroImg2, heroImg3];

const HeroSection = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="hero-section">
            <div className="hero-background">
                {heroImages.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`Hero Slide ${index + 1}`}
                        className={`hero-slide ${index === currentImageIndex ? 'active' : ''}`}
                    />
                ))}
                <div className="overlay"></div>
            </div>
            <div className="hero-content container">
                <h2 className="fade-in">The Wedding Edit</h2>
                <h1 className="fade-in">TIMELESS BANARAS</h1>
                <p className="fade-in">Handwoven masterpieces for your special day</p>
                <div className="button-group fade-in">
                    <Link to="/collections/sarees" className="primary-btn">Shop Sarees</Link>
                    <Link to="/collections/sarees" className="secondary-btn">View Collection</Link>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
