import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/ProductGrid.css';
import API_HOST from '../config';
import ProductCardShimmer from './ProductCardShimmer';

import imgProd1 from '../assets/images/IMG_6952.JPG';
import imgProd2 from '../assets/images/IMG_6956.JPG';
import imgProd3 from '../assets/images/IMG_6959.JPG';
import imgProd4 from '../assets/images/IMG_6961.JPG';

const ProductGrid = () => {
    const [ref, isVisible] = useScrollReveal();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
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
                {loading ? (
                    // Show 4 Shimmer Cards loading
                    Array(4).fill(0).map((_, index) => (
                        <ProductCardShimmer key={index} />
                    ))
                ) : (
                    products.map(product => {
                        const hasDiscount = product.discountPercentage > 0;
                        const discountedPrice = hasDiscount
                            ? Math.round(product.price - (product.price * (product.discountPercentage / 100)))
                            : product.price;

                        return (
                            <Link to={`/product/${product._id}`} key={product._id} className="product-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="product-image">
                                    <img src={product.images[0] || 'placeholder.jpg'} alt={product.title} loading="lazy" />
                                    {hasDiscount && (
                                        <div className="discount-badge">
                                            {product.discountPercentage}% OFF
                                        </div>
                                    )}
                                    <div className="quick-view">View Details</div>
                                </div>
                                <div className="product-info">
                                    <h4>{product.title}</h4>
                                    <div className="price-container">
                                        {hasDiscount ? (
                                            <>
                                                <span className="original-price">₹{product.price}</span>
                                                <span className="discounted-price">₹{discountedPrice}</span>
                                            </>
                                        ) : (
                                            <p>₹{product.price}</p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                )}
            </div>
            <div className="view-all-container">
                <Link to="/collections/all" className="secondary-btn" style={{ color: '#000', borderColor: '#000' }}>View All</Link>
            </div>
        </section>
    );
};

export default ProductGrid;
