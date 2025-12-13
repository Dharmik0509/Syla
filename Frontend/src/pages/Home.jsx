import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedCollections from '../components/FeaturedCollections';
import StorySection from '../components/StorySection';
import ProductGrid from '../components/ProductGrid';

const Home = () => {
    // Simple scroll-to-top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="home-page">
            <HeroSection />
            <FeaturedCollections />
            <StorySection />
            <ProductGrid />
        </div>
    );
};

export default Home;
