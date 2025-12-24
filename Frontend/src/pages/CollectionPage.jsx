import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/ProductGrid.css';
import API_HOST from '../config';

const CollectionPage = () => {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Categories to resolve slug
                const catResponse = await fetch(`${API_HOST}/api/get-categories`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const categories = await catResponse.json();

                let filter = {};
                let currentCategory = null;

                if (categoryId && categoryId.toLowerCase() !== 'all') {
                    currentCategory = categories.find(c => c.slug === categoryId || c.name.toLowerCase() === categoryId.toLowerCase());
                    if (currentCategory) {
                        filter = { category: currentCategory._id };
                        setCategoryInfo(currentCategory);
                    }
                } else {
                    setCategoryInfo({ name: 'All Collections', description: 'Explore our complete range of handwoven masterpieces.' });
                }

                // 2. Fetch Products
                const prodResponse = await fetch(`${API_HOST}/api/get-products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(filter)
                });
                const productsData = await prodResponse.json();
                setProducts(productsData);

            } catch (error) {
                console.error("Error fetching collection:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        window.scrollTo(0, 0);
    }, [categoryId]);

    if (loading) {
        return (
            <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center', paddingTop: '100px' }}>
                <p>Loading collection...</p>
            </div>
        );
    }

    return (
        <div className="collection-page" style={{ paddingTop: 'var(--header-height)' }}>
            {/* Hero / Header for Collection */}
            <div
                className="collection-hero"
                style={{
                    backgroundColor: '#f8f5f2',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    marginBottom: '2rem'
                }}
            >
                <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '2.5rem', marginBottom: '1rem', textTransform: 'capitalize' }}>
                    {categoryInfo?.name || categoryId}
                </h1>
                <p style={{ maxWidth: '600px', margin: '0 auto', color: '#666' }}>
                    {categoryInfo?.description || `Browse our exclusive collection of ${categoryInfo?.name || categoryId}.`}
                </p>
            </div>

            {/* Product Grid */}
            <div className="container product-grid-section">
                {products.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>No products found in this collection.</p>
                ) : (
                    <div className="product-grid">
                        {products.map((product) => (
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
                )}
            </div>
        </div>
    );
};

export default CollectionPage;
