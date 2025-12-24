import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/ProductGrid.css';
import API_HOST from '../config';

import imgProd1 from '../assets/images/IMG_6952.JPG';
import imgProd2 from '../assets/images/IMG_6956.JPG';
import imgProd3 from '../assets/images/IMG_6959.JPG';
import imgProd4 from '../assets/images/IMG_6961.JPG';

const ProductGrid = () => {
    const [ref, isVisible] = useScrollReveal();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_HOST}/api/get-products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                // Take latest 4
                setProducts(data.slice(0, 4));
            } catch (error) {
                console.error("Error fetching new arrivals:", error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <section ref={ref} className={`product-grid-section container ${isVisible ? 'fade-in' : ''}`} style={{ opacity: isVisible ? 1 : 0 }}>
            <div className="section-header">
                <h2>New Arrivals</h2>
            </div>
            <div className="product-grid">
                {products.map(product => (
                    <Link to={`/product/${product._id}`} key={product._id} className="product-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="product-image">
                            <img src={product.images[0] || 'placeholder.jpg'} alt={product.title} loading="lazy" />
                            <div className="quick-view">View Details</div>
                        </div>
                        <div className="product-info">
                            <h4>{product.title}</h4>
                            <p>₹{product.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="view-all-container">
                <Link to="/collections/all" className="secondary-btn" style={{ color: '#000', borderColor: '#000' }}>View All</Link>
            </div>
        </section>
    );
};

export default ProductGrid;
