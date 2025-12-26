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
    const [activeDiscounts, setActiveDiscounts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Categories
                const catResponse = await fetch(`${API_HOST}/api/get-categories`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const catData = await catResponse.json();

                // Fetch Public Discounts
                const discountResponse = await fetch(`${API_HOST}/api/fetch-public-discounts`);
                const discountData = await discountResponse.json();

                if (Array.isArray(discountData)) {
                    setActiveDiscounts(discountData);
                }

                if (catData.length > 0) {
                    setCollections(catData.slice(0, 3));
                } else {
                    // Fallback
                    setCollections([
                        { _id: 1, name: "Banarasi Sarees", image: imgColl1, slug: "sarees" },
                        { _id: 2, name: "Bridal Lehengas", image: imgColl2, slug: "lehengas" },
                        { _id: 3, name: "Handwoven Dupattas", image: imgColl3, slug: "dupattas" }
                    ]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                // Fallback on error
                setCollections([
                    { _id: 1, name: "Banarasi Sarees", image: imgColl1, slug: "sarees" },
                    { _id: 2, name: "Bridal Lehengas", image: imgColl2, slug: "lehengas" },
                    { _id: 3, name: "Handwoven Dupattas", image: imgColl3, slug: "dupattas" }
                ]);
            }
        };
        fetchData();
    }, []);

    const getDiscountForCategory = (categoryId) => {
        const rule = activeDiscounts.find(d =>
            d.isActive &&
            d.appliesTo === 'CATEGORY' &&
            d.targetValues.includes(categoryId)
        );
        return rule ? rule.value : null;
    };

    return (
        <section ref={ref} className={`featured-collections container ${isVisible ? 'fade-in' : ''}`} style={{ opacity: isVisible ? 1 : 0 }}>
            <div className="section-header">
                <h3>Curated Collections</h3>
                <h2>Explore Our Heritage</h2>
            </div>
            <div className="collections-grid">
                {collections.map(item => {
                    const discountValue = getDiscountForCategory(item._id);
                    return (
                        <div key={item._id} className="collection-card" style={{ position: 'relative' }}>
                            <div className="card-image">
                                {/* Use item.image from DB or fallback to imported images based on index or placeholder */}
                                <img src={item.image || imgColl1} alt={item.name} loading="lazy" />
                                {discountValue && (
                                    <div className="category-discount-badge" style={{
                                        position: 'absolute',
                                        top: '10px',
                                        left: '10px',
                                        backgroundColor: '#d9534f',
                                        color: 'white',
                                        padding: '5px 10px',
                                        borderRadius: '4px',
                                        fontWeight: 'bold',
                                        zIndex: 5,
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                    }}>
                                        {discountValue}% OFF
                                    </div>
                                )}
                                <Link to={`/collections/${item.slug}`} className="overlay-hover">
                                    <span className="explore-text">Explore</span>
                                </Link>
                            </div>
                            <div className="card-info">
                                <h3>{item.name}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default FeaturedCollections;
