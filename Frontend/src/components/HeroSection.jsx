import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HeroSection.css';
import API_HOST from '../config';

import heroImg1 from '../assets/images/IMG_6940.JPG';
import heroImg2 from '../assets/images/IMG_6941.JPG';
import heroImg3 from '../assets/images/IMG_6942.JPG';

const heroImages = [heroImg1, heroImg2, heroImg3];

const HeroSection = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [heroSlides, setHeroSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const response = await fetch(`${API_HOST}/api/get-hero-slides`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (response.ok && data.length > 0) {
                setHeroSlides(data);
            } else {
                // Fallback if no slides or API fails
                setHeroSlides([
                    { image: heroImg1, title: 'The Wedding Edit', subtitle: 'TIMELESS BANARAS', link: '/collections/sarees' },
                    { image: heroImg2, title: 'Royal Heritage', subtitle: 'Handwoven Luxury', link: '/collections/lehengas' },
                    { image: heroImg3, title: 'Modern Muse', subtitle: 'Contemporary Classics', link: '/collections/suits' }
                ]);
            }
        } catch (error) {
            console.error("Error fetching hero slides:", error);
            setHeroSlides([
                { image: heroImg1, title: 'The Wedding Edit', subtitle: 'TIMELESS BANARAS', link: '/collections/sarees' },
                { image: heroImg2, title: 'Royal Heritage', subtitle: 'Handwoven Luxury', link: '/collections/lehengas' },
                { image: heroImg3, title: 'Modern Muse', subtitle: 'Contemporary Classics', link: '/collections/suits' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (heroSlides.length === 0) return;
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [heroSlides]);

    if (loading) return null; // Or a skeleton

    const currentSlide = heroSlides[currentImageIndex] || {};

    return (
        <section className="hero-section">
            <div className="hero-background">
                {heroSlides.map((slide, index) => (
                    <img
                        key={slide._id || index}
                        src={slide.image}
                        alt={slide.title}
                        className={`hero-slide ${index === currentImageIndex ? 'active' : ''}`}
                    />
                ))}
                <div className="overlay"></div>
            </div>
            <div className="hero-content container">
                <h2 className="fade-in">{currentSlide.subtitle}</h2>
                <h1 className="fade-in">{currentSlide.title}</h1>
                <p className="fade-in">Handwoven masterpieces for your special day</p>
                <div className="button-group fade-in">
                    <Link to={currentSlide.link || "/collections/all"} className="primary-btn">Shop Now</Link>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
