import React from 'react';
import '../styles/StorySection.css'; // Reusing story styles
import imgStory from '../assets/images/IMG_6970.JPG'; // Using a nice image for About Us

const About = () => {
    return (
        <div className="about-page" style={{ paddingTop: 'var(--header-height)' }}>
            <div className="container" style={{ padding: '4rem 2rem' }}>
                <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '3rem', textAlign: 'center', marginBottom: '3rem' }}>
                    About Syla
                </h1>

                <div className="story-content">
                    <div className="story-image">
                        <img src={imgStory} alt="Our Story" loading="lazy" style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
                    </div>
                    <div className="story-text">
                        <h2 style={{ marginBottom: '1.5rem', fontFamily: 'Cinzel, serif' }}>What Syla Means to Us</h2>
                        <p style={{ marginBottom: '1rem', lineHeight: '1.6', textAlign: 'justify' }}>
                            Syla represents grace, softness, and quiet strength.
                        </p>
                        <p style={{ marginBottom: '1rem', lineHeight: '1.6', textAlign: 'justify' }}>
                            It reflects the gentle beauty of Indian tradition and the confidence of the modern
                            woman. The name carries a feeling of flow—effortless, timeless, and deeply connected
                            to emotion rather than excess.
                        </p>
                        <p style={{ marginBottom: '1rem', lineHeight: '1.6', textAlign: 'justify' }}>
                            Syla is about simplicity that feels special, elegance that feels natural, and tradition that
                            lives in everyday moments. It symbolizes a balance between roots and individuality,
                            where culture is expressed softly, not loudly.
                        </p>
                        <p style={{ lineHeight: '1.6', textAlign: 'justify' }}>
                            At its heart, Syla stands for comfort, authenticity, and self-expression. It is a name that
                            feels warm, feminine, and meaningful—just like the women who wear it.
                        </p>
                    </div>
                </div>

                {/* Our Values Section */}
                <div className="values-section">
                    <h2 className="section-title">Our Values</h2>
                    <div className="values-grid">
                        <div className="value-item">
                            <h3 className="value-title">Rooted in Tradition</h3>
                            <p className="value-desc">
                                Our designs are inspired by the richness of Indian culture, traditions, and timeless craftsmanship. Every Syla piece carries a sense of heritage, thoughtfully reimagined for the present day.
                            </p>
                        </div>
                        <div className="value-item">
                            <h3 className="value-title">Crafted with Care</h3>
                            <p className="value-desc">
                                From choosing the right fabrics to perfecting every detail, we believe true quality comes from patience and intention. Each outfit is created with care, respect, and attention to craftsmanship.
                            </p>
                        </div>
                        <div className="value-item">
                            <h3 className="value-title">Designed for Real Women</h3>
                            <p className="value-desc">
                                Comfort, ease, and wearability guide our designs. We create silhouettes that feel natural, graceful, and empowering—made to move with you through everyday moments and celebrations alike.
                            </p>
                        </div>
                        <div className="value-item">
                            <h3 className="value-title">Simplicity with Meaning</h3>
                            <p className="value-desc">
                                We value understated elegance. Our designs focus on clean lines and thoughtful details, allowing the beauty of ethnic wear to speak without excess.
                            </p>
                        </div>
                        <div className="value-item">
                            <h3 className="value-title">Built on Trust</h3>
                            <p className="value-desc">
                                Trust is at the heart of Syla. From honest communication to consistent quality, we are committed to building long-lasting relationships with our customers.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mission & Vision Section */}
                <div className="mission-vision-section">
                    <div className="mission-box">
                        <h2 className="section-title">Our Mission</h2>
                        <p className="mission-text">
                            At Syla, our mission is to design and deliver premium ethnic wear that blends Indian tradition with modern sensibility. We are committed to creating thoughtfully crafted outfits that focus on quality fabrics, comfortable fits, and refined detailing.
                        </p>
                        <p className="mission-text">
                            Our goal is to make ethnic wear accessible, wearable, and meaningful for everyday moments as well as special occasions. Each Syla piece is designed with care, ensuring authenticity, consistency, and attention to detail in every collection.
                        </p>
                        <p className="mission-text">
                            We strive to build a brand that values craftsmanship, cultural relevance, and customer trust. Through responsible design and timeless aesthetics, Syla aims to offer ethnic wear that feels graceful, versatile, and enduring—empowering women to express their individuality while staying connected to their roots.
                        </p>
                    </div>
                    <div className="vision-box">
                        <h2 className="section-title">Our Vision</h2>
                        <p className="mission-text">
                            At Syla, our vision is to create premium ethnic wear that reflects the beauty of Indian tradition with a modern, thoughtful approach. We believe ethnic fashion should feel refined yet wearable, rooted in culture yet suited for today’s lifestyle. Every Syla design is inspired by India’s rich heritage and crafted with attention to quality, comfort, and detail.
                        </p>
                        <p className="mission-text">
                            Our aim is to offer ethnic wear that stands out for its fabric, fit, and finish—pieces that feel special without being overwhelming. Each outfit is designed to balance elegance and ease, allowing women to express their individuality with confidence.
                        </p>
                        <p className="mission-text">
                            Syla envisions becoming a trusted name in premium ethnic fashion, where craftsmanship, authenticity, and contemporary design come together. Through our collections, we strive to make ethnic wear graceful, versatile, and meaningful for the modern woman.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
