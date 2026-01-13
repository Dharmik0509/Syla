import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/FeaturedCollections.css';
import API_HOST from '../config';

import imgColl1 from '../assets/images/IMG_6943.JPG';
import imgColl2 from '../assets/images/IMG_6944.JPG';
import imgColl3 from '../assets/images/IMG_6948.JPG';

import { useShop } from '../context/ShopContext';

const FeaturedCollections = () => {
    const [ref, isVisible] = useScrollReveal();
    const { categories, discounts, loading } = useShop();
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        if (categories && categories.length > 0) {
            setCollections(categories.slice(0, 3));
        } else if (!loading) {
            // Fallback if loaded but empty (or error)
            setCollections([
                { _id: 1, name: "Banarasi Sarees", image: imgColl1, slug: "sarees" },
                { _id: 2, name: "Bridal Lehengas", image: imgColl2, slug: "lehengas" },
                { _id: 3, name: "Handwoven Dupattas", image: imgColl3, slug: "dupattas" }
            ]);
        }
    }, [categories, loading]);

    const getDiscountForCategory = (categoryId) => {
        const rule = discounts.find(d =>
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
