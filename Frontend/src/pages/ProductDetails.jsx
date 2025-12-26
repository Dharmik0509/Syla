import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_HOST from '../config';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        fetchProduct();
        window.scrollTo(0, 0);
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
        const priceText = hasDiscount ? `Original: ₹${product.price}, Deal Price: ₹${discountedPrice}` : `Price: ₹${product.price}`;
        const message = `Hi, I would like to order ${product.title} (SKU: ${product.sku}). ${priceText}`;
        const url = `https://wa.me/919999999999?text=${encodeURIComponent(message)}`;
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
        <div className="product-details-page" style={{ paddingTop: '100px', minHeight: '80vh' }}>
            <div className="container" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                {/* Images Section */}
                <div className="product-gallery" style={{ flex: '1 1 400px' }}>
                    <div className="main-image-container" style={{ position: 'relative' }}>
                        {hasDiscount && (
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: '#d9534f',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                zIndex: 10
                            }}>
                                {product.discountPercentage}% OFF
                            </div>
                        )}

                        {/* Left Arrow */}
                        {product.images.length > 1 && (
                            <button className="slider-arrow arrow-left" onClick={prevImage}>
                                &#10094;
                            </button>
                        )}

                        {/* Main Image with Animation Key */}
                        {product.images[selectedImage].match(/\.(mp4|mov|avi|mkv)$/i) ? (
                            <video
                                key={selectedImage}
                                src={product.images[selectedImage]}
                                className="product-detail-image"
                                controls
                                autoPlay
                                loop
                                muted
                            />
                        ) : (
                            <img
                                key={selectedImage}
                                src={product.images[selectedImage] || 'placeholder.jpg'}
                                alt={product.title}
                                className="product-detail-image"
                            />
                        )}

                        {/* Right Arrow */}
                        {product.images.length > 1 && (
                            <button className="slider-arrow arrow-right" onClick={nextImage}>
                                &#10095;
                            </button>
                        )}
                    </div>
                    <div className="thumbnail-list" style={{ display: 'flex', gap: '10px' }}>
                        {product.images.map((img, idx) => (

                            <img
                                key={idx}
                                src={img}
                                alt={`Thumbnail ${idx}`}
                                onClick={() => setSelectedImage(idx)}
                                className="thumbnail-img"
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    border: selectedImage === idx ? '2px solid #0F2B1D' : '2px solid transparent',
                                    opacity: selectedImage === idx ? 1 : 0.6
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Info Section */}
                <div className="product-info" style={{ flex: '1 1 400px' }}>
                    <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '2.5rem', marginBottom: '10px' }}>{product.title}</h1>

                    <div style={{ marginBottom: '20px' }}>
                        {hasDiscount ? (
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
                                <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '1.2rem' }}>₹{product.price}</span>
                                <span style={{ fontSize: '2rem', color: '#d9534f', fontWeight: 'bold' }}>₹{discountedPrice}</span>
                            </div>
                        ) : (
                            <p style={{ fontSize: '1.5rem', color: '#0F2B1D', fontWeight: 'bold' }}>₹{product.price}</p>
                        )}
                    </div>

                    <div className="product-description" style={{ marginBottom: '30px', color: '#555', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                        <p>{product.description}</p>
                    </div>

                    <div className="stock-status" style={{ marginBottom: '20px' }}>
                        {product.stockQuantity > 0 ? (
                            <span style={{ color: 'green' }}>In Stock</span>
                        ) : (
                            <span style={{ color: 'red' }}>Out of Stock</span>
                        )}
                    </div>

                    <button
                        onClick={handleWhatsAppOrder}
                        className="primary-btn"
                        style={{
                            width: '100%',
                            backgroundColor: '#25D366',
                            borderColor: '#25D366',
                            fontSize: '1.1rem'
                        }}
                    >
                        Order via WhatsApp
                    </button>
                    <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#777', display: 'none' }}>
                        SKU: {product.sku}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
