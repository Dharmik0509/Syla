import React, { useState } from 'react';
import '../styles/Shimmer.css';

// Helper to optimize Cloudinary URLs automatically
const getOptimizedUrl = (url) => {
    if (!url) return url;
    // Check if it's a Cloudinary URL and not already optimized
    if (typeof url === 'string' && url.includes('cloudinary.com') && url.includes('/upload/') && !url.includes('q_auto')) {
        return url.replace('/upload/', '/upload/q_auto:best,f_auto/');
    }
    return url;
};

const ShimmerImage = ({ src, alt, className, style, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const optimizedSrc = getOptimizedUrl(src);

    return (
        <div
            className={`shimmer-image-container ${className || ''}`}
            style={{ position: 'relative', overflow: 'hidden', ...style }}
        >
            {!isLoaded && (
                <div
                    className="shimmer-wrapper"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
                />
            )}
            <img
                src={optimizedSrc}
                alt={alt}
                className={className}
                style={{
                    ...style,
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out'
                }}
                onLoad={() => setIsLoaded(true)}
                {...props}
            />
        </div>
    );
};

export default ShimmerImage;
