import React from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/ProductGrid.css';

import imgProd1 from '../assets/images/IMG_6952.JPG';
import imgProd2 from '../assets/images/IMG_6956.JPG';
import imgProd3 from '../assets/images/IMG_6959.JPG';
import imgProd4 from '../assets/images/IMG_6961.JPG';

const products = [
    {
        id: 1,
        name: "Katan Silk Jangla Saree",
        price: "₹ 45,000",
        image: imgProd1
    },
    {
        id: 2,
        name: "Gold Zari Katan Silk",
        price: "₹ 52,000",
        image: imgProd2
    },
    {
        id: 3,
        name: "Handwoven Tissue Silk",
        price: "₹ 38,500",
        image: imgProd3
    },
    {
        id: 4,
        name: "Traditional Banarasi",
        price: "₹ 60,000",
        image: imgProd4
    }
];

const ProductGrid = () => {
    const [ref, isVisible] = useScrollReveal();

    return (
        <section ref={ref} className={`product-grid-section container ${isVisible ? 'fade-in' : ''}`} style={{ opacity: isVisible ? 1 : 0 }}>
            <div className="section-header">
                <h2>New Arrivals</h2>
            </div>
            <div className="product-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <div className="product-image">
                            <img src={product.image} alt={product.name} loading="lazy" />
                            <div className="quick-view">Quick View</div>
                        </div>
                        <div className="product-info">
                            <h4>{product.name}</h4>
                            <p>{product.price}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="view-all-container">
                <Link to="/collections/sarees" className="secondary-btn" style={{ color: '#000', borderColor: '#000' }}>View All</Link>
            </div>
        </section>
    );
};

export default ProductGrid;
