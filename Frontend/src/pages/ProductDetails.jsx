import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API_HOST from '../config';

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

    const handleWhatsAppOrder = () => {
        if (!product) return;
        const message = `Hi, I would like to order ${product.title} (SKU: ${product.sku}). Price: ₹${product.price}`;
        const url = `https://wa.me/919999999999?text=${encodeURIComponent(message)}`; // Replace with real number
        window.open(url, '_blank');
    };

    if (loading) return <div className="container" style={{ padding: '100px' }}>Loading...</div>;
    if (!product) return <div className="container" style={{ padding: '100px' }}>Product not found</div>;

    return (
        <div className="product-details-page" style={{ paddingTop: '100px', minHeight: '80vh' }}>
            <div className="container" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                {/* Images Section */}
                <div className="product-gallery" style={{ flex: '1 1 400px' }}>
                    <div className="main-image" style={{ marginBottom: '20px' }}>
                        <img
                            src={product.images[selectedImage] || 'placeholder.jpg'}
                            alt={product.title}
                            style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
                        />
                    </div>
                    <div className="thumbnail-list" style={{ display: 'flex', gap: '10px' }}>
                        {product.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`Thumbnail ${idx}`}
                                onClick={() => setSelectedImage(idx)}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    border: selectedImage === idx ? '2px solid #0F2B1D' : 'none'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Info Section */}
                <div className="product-info" style={{ flex: '1 1 400px' }}>
                    <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '2.5rem', marginBottom: '10px' }}>{product.title}</h1>
                    <p style={{ fontSize: '1.5rem', color: '#0F2B1D', fontWeight: 'bold', marginBottom: '20px' }}>₹{product.price}</p>

                    <div className="product-description" style={{ marginBottom: '30px', color: '#555', lineHeight: '1.6' }}>
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
                    <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#777' }}>
                        SKU: {product.sku}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
