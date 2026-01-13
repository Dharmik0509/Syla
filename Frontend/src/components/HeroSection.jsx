import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HeroSection.css';
import '../styles/Shimmer.css';
import API_HOST from '../config';

import heroImg1 from '../assets/images/IMG_6940.JPG';
import heroImg2 from '../assets/images/IMG_6941.JPG';
import heroImg3 from '../assets/images/IMG_6942.JPG';

const heroImages = [heroImg1, heroImg2, heroImg3];

// Helper to optimize Cloudinary URLs for speed and quality
const getOptimizedUrl = (url) => {
    if (!url) return url;
    // Check if it's a Cloudinary URL (and not already optimized/transformed in a way we might break)
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
        // q_auto:best ensures practically lossless quality but optimized size
        // f_auto selects WebP or AVIF automatically
        return url.replace('/upload/', '/upload/q_auto:best,f_auto/');
    }
    return url;
};

const HeroSection = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [heroSlides, setHeroSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState({});

    const handleImageLoad = (index) => {
        setImagesLoaded(prev => ({ ...prev, [index]: true }));
    };

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

    if (loading) {
        return (
            <section className="hero-section" style={{ height: '90vh', position: 'relative' }}>
                <div className="shimmer-wrapper" style={{ width: '100%', height: '100%' }}></div>
            </section>
        );
    }

    const currentSlide = heroSlides[currentImageIndex] || {};

    return (
        <section className="hero-section">
            <div className="hero-background">
                {heroSlides.map((slide, index) => (
                    <React.Fragment key={slide._id || index}>
                        {!imagesLoaded[index] && (
                            <div
                                className={`hero-slide shimmer-wrapper ${index === currentImageIndex ? 'active' : ''}`}
                                style={{ zIndex: 0 }}
                            ></div>
                        )}
                        <img
                            src={getOptimizedUrl(slide.image)}
                            alt={slide.title}
                            className={`hero-slide ${index === currentImageIndex ? 'active' : ''} ${slide.enableZoom !== false ? 'zoom-active' : ''}`}
                            loading={index === 0 ? "eager" : "lazy"}
                            fetchPriority={index === 0 ? "high" : "auto"}
                            onLoad={() => handleImageLoad(index)}
                            style={{ opacity: imagesLoaded[index] ? undefined : 0, transition: 'opacity 0.5s ease' }}
                        />
                    </React.Fragment>
                ))}
                <div className="overlay"></div>
            </div>
            <div className="hero-content container">
                {currentSlide.subtitle && <h2 className="fade-in">{currentSlide.subtitle}</h2>}
                {currentSlide.title && <h1 className="fade-in">{currentSlide.title}</h1>}
                {currentSlide.showButton !== false && (
                    <div className="button-group fade-in">
                        <Link to={currentSlide.link || "/collections/all"} className="primary-btn">Shop Now</Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default HeroSection;
