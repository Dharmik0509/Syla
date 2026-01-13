import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_HOST from '../config';
import '../styles/ProductDetails.css';
import ShimmerImage from '../components/ShimmerImage';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`${API_HOST}/api/get-product-by-id`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await response.json();
            if (response.ok) {
                setProduct(data);
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        } finally {
            setLoading(false);
        }
    };

    const hasDiscount = product?.discountPercentage > 0;
    const discountedPrice = (product && hasDiscount)
        ? Math.round(product.price - (product.price * (product.discountPercentage / 100)))
        : product?.price;

    const handleWhatsAppOrder = () => {
        if (!product) return;
        const currentSrc = product.images?.[selectedImage] || product.images?.[0] || '';
        const price = hasDiscount ? discountedPrice : product.price;

        const message = `Hello , I want to order this piece 
Product name : ${product.title}
Product size : Free Size
Product price : ₹${price}
Product img : ${currentSrc}`;

        const url = `https://wa.me/919274720033?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const nextImage = () => {
        if (!product || !product.images) return;
        setSelectedImage((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        if (!product || !product.images) return;
        setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    if (loading) return <div className="container" style={{ padding: '100px' }}>Loading...</div>;
    if (!product) return <div className="container" style={{ padding: '100px' }}>Product not found</div>;

    return (
        <div className="product-details-page">
            <div className="product-details-container">
                {/* Images Section */}
                <div className="product-gallery">
                    <div className="main-image-container">
                        {/* Discount Badge */}
                        {hasDiscount && (
                            <div className="discount-badge" style={{ position: 'absolute', top: 10, right: 10, background: '#d9534f', color: 'white', padding: '5px 10px', borderRadius: 4, zIndex: 10, fontWeight: 'bold' }}>
                                {product.discountPercentage}% OFF
                            </div>
                        )}

                        {/* Navigation Arrows */}
                        {product.images && product.images.length > 1 && (
                            <>
                                <button className="slider-arrow arrow-left" onClick={prevImage}>&#10094;</button>
                                <button className="slider-arrow arrow-right" onClick={nextImage}>&#10095;</button>
                            </>
                        )}

                        {/* Main Image Logic */}
                        {(() => {
                            const currentSrc = product.images && product.images[selectedImage] ? product.images[selectedImage] : null;
                            const isVideo = typeof currentSrc === 'string' && currentSrc.match(/\.(mp4|mov|avi|mkv)$/i);

                            if (!currentSrc) {
                                return <img src="https://via.placeholder.com/600x800?text=No+Image" alt="No image" className="product-detail-image" />;
                            }

                            if (isVideo) {
                                return <video key={selectedImage} src={currentSrc} className="product-detail-image" controls autoPlay loop muted />;
                            }

                            return (
                                <ShimmerImage
                                    key={selectedImage}
                                    src={currentSrc}
                                    alt={product.title}
                                    className="product-detail-image"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x800?text=Image+Error'; }}
                                />
                            );
                        })()}
                    </div>

                    {/* Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div className="thumbnail-list">
                            {product.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Thumb ${idx}`}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`thumbnail-img ${selectedImage === idx ? 'active' : ''}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="product-info-section">
                    <h1 className="product-title">{product.title}</h1>

                    {product.sku && <div className="product-sku">SKU: {product.sku}</div>}

                    <div className="product-price-container">
                        {hasDiscount ? (
                            <div>
                                <span className="original-price">₹{product.price}</span>
                                <span className="product-price discounted-price">₹{discountedPrice}</span>
                            </div>
                        ) : (
                            <span className="product-price">₹{product.price}</span>
                        )}
                    </div>

                    <div className="product-description">
                        <p>{product.description}</p>
                    </div>

                    <div className="stock-status">
                        Status: {product.stockQuantity > 0 ? <span className="in-stock">In Stock</span> : <span className="out-of-stock">Out of Stock</span>}
                    </div>

                    <button onClick={handleWhatsAppOrder} className="whatsapp-btn">
                        <span>Order via WhatsApp</span>
                    </button>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '20px', fontSize: '0.9rem', color: '#666' }}>
                        <div>✓ Authentic Quality</div>
                        <div>✓ Fast Shipping</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
