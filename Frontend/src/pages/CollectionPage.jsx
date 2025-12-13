import React from 'react';
import { useParams } from 'react-router-dom';
import { productsData } from '../data/products';
import '../styles/ProductGrid.css'; // Reusing existing grid styles

const CollectionPage = () => {
    const { categoryId } = useParams();
    const lowerId = categoryId ? categoryId.toLowerCase() : '';
    const collection = productsData[lowerId];

    if (!collection) {
        return (
            <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <h2>Collection Not Found</h2>
                <p>The collection you are looking for does not exist.</p>
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
                <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '2.5rem', marginBottom: '1rem' }}>
                    {collection.title}
                </h1>
                <p style={{ maxWidth: '600px', margin: '0 auto', color: '#666' }}>
                    {collection.description}
                </p>
            </div>

            {/* Product Grid */}
            <div className="container product-grid-section">
                <div className="product-grid">
                    {collection.items.map((product) => (
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
            </div>
        </div>
    );
};

export default CollectionPage;
