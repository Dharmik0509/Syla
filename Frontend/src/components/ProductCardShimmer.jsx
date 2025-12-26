import React from 'react';
import '../styles/Shimmer.css';
import '../styles/ProductGrid.css'; // Inherit layout if needed

const ProductCardShimmer = () => {
    return (
        <div className="product-card shimmer-container">
            {/* Image Placeholder */}
            <div className="shimmer-wrapper shimmer-image"></div>

            {/* Info Placeholder */}
            <div className="product-info">
                <div className="shimmer-wrapper shimmer-title"></div>
                <div className="shimmer-wrapper shimmer-price"></div>
            </div>
        </div>
    );
};

export default ProductCardShimmer;
