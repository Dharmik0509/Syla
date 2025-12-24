import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/FeaturedCollections.css';
import API_HOST from '../config';

import imgColl1 from '../assets/images/IMG_6943.JPG';
import imgColl2 from '../assets/images/IMG_6944.JPG';
import imgColl3 from '../assets/images/IMG_6948.JPG';

const FeaturedCollections = () => {
    const [ref, isVisible] = useScrollReveal();
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_HOST}/api/get-categories`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                // Filter top level categories or specific ones. For now, take first 3.
                // In real app, might want a "featured" flag on category.
                if (data.length > 0) {
                    setCollections(data.slice(0, 3));
                } else {
                    // Fallback
                    setCollections([
                        { _id: 1, name: "Banarasi Sarees", image: imgColl1, slug: "sarees" },
                        { _id: 2, name: "Bridal Lehengas", image: imgColl2, slug: "lehengas" },
                        { _id: 3, name: "Handwoven Dupattas", image: imgColl3, slug: "dupattas" }
                    ]);
                }
            } catch (error) {
                console.error("Error fetching collections:", error);
                setCollections([
                    { _id: 1, name: "Banarasi Sarees", image: imgColl1, slug: "sarees" },
                    { _id: 2, name: "Bridal Lehengas", image: imgColl2, slug: "lehengas" },
                    { _id: 3, name: "Handwoven Dupattas", image: imgColl3, slug: "dupattas" }
                ]);
            }
        };
        fetchCategories();
    }, []);

    return (
        <section ref={ref} className={`featured-collections container ${isVisible ? 'fade-in' : ''}`} style={{ opacity: isVisible ? 1 : 0 }}>
            <div className="section-header">
                <h3>Curated Collections</h3>
                <h2>Explore Our Heritage</h2>
            </div>
            <div className="collections-grid">
                {collections.map(item => (
                    <div key={item._id} className="collection-card">
                        <div className="card-image">
                            {/* Use item.image from DB or fallback to imported images based on index or placeholder */}
                            <img src={item.image || imgColl1} alt={item.name} loading="lazy" />
                            <Link to={`/collections/${item.slug}`} className="overlay-hover">
                                <span className="explore-text">Explore</span>
                            </Link>
                        </div>
                        <div className="card-info">
                            <h3>{item.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedCollections;
