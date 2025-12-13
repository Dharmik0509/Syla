import React from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/StorySection.css';
import storyImg from '../assets/images/IMG_6951.JPG';

const StorySection = () => {
    const [ref, isVisible] = useScrollReveal();

    return (
        <section ref={ref} className={`story-section container ${isVisible ? 'fade-in' : ''}`} style={{ opacity: isVisible ? 1 : 0 }}>
            <div className="story-content">
                <div className="story-image">
                    <img src={storyImg} alt="Weaving loom" />
                </div>
                <div className="story-text">
                    <h3>HANDWOVEN STORIES</h3>
                    <h2>The Art of Banaras</h2>
                    <p>
                        Born in Banaras, Syla brings to you the rich heritage of one of the oldest living cities of the world.
                        Each garment is a testament to the skill of our master craftsmen, weaving stories of tradition and modernity.
                    </p>
                    <Link to="/about" className="text-btn">Read Our Story</Link>
                </div>
            </div>
        </section>
    );
};

export default StorySection;
