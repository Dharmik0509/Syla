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

                <div className="story-content" style={{ flexDirection: 'row', gap: '4rem' }}>
                    <div className="story-image" style={{ flex: 1 }}>
                        <img src={imgStory} alt="Our Story" style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
                    </div>
                    <div className="story-text" style={{ flex: 1 }}>
                        <h2 style={{ marginBottom: '1.5rem', fontFamily: 'Cinzel, serif' }}>Weaving Heritage into Modernity</h2>
                        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                            Welcome to Syla, where tradition meets elegance. Born from a passion for India's rich textile heritage,
                            we strive to bring you the finest handwoven masterpieces from the looms of Banaras and beyond.
                        </p>
                        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                            Each piece in our collection is a labor of love, crafted by skilled artisans who have inherited
                            generations of knowledge. We believe in sustainable luxury—fashion that looks good, feels good,
                            and does good.
                        </p>
                        <p style={{ lineHeight: '1.6' }}>
                            Our mission is to revive dying arts and empower weaving communities while offering you
                            heirlooms that you will cherish forever.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
