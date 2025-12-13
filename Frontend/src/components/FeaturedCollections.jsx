import React from 'react';
import '../styles/FeaturedCollections.css';

import imgColl1 from '../assets/images/IMG_6943.JPG';
import imgColl2 from '../assets/images/IMG_6944.JPG';
import imgColl3 from '../assets/images/IMG_6948.JPG';

const collections = [
    {
        id: 1,
        title: "Banarasi Sarees",
        image: imgColl1,
        link: "#sarees"
    },
    {
        id: 2,
        title: "Bridal Lehengas",
        image: imgColl2,
        link: "#lehengas"
    },
    {
        id: 3,
        title: "Handwoven Dupattas",
        image: imgColl3,
        link: "#dupattas"
    }
];

const FeaturedCollections = () => {
    return (
        <section className="featured-collections container">
            <div className="section-header">
                <h3>Curated Collections</h3>
                <h2>Explore Our Heritage</h2>
            </div>
            <div className="collections-grid">
                {collections.map(item => (
                    <div key={item.id} className="collection-card">
                        <div className="card-image">
                            <img src={item.image} alt={item.title} />
                            <div className="overlay-hover">
                                <span className="explore-text">Explore</span>
                            </div>
                        </div>
                        <div className="card-info">
                            <h3>{item.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedCollections;
