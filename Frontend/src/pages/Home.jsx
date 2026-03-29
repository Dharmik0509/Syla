import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedCollections from '../components/FeaturedCollections';
import ProductGrid from '../components/ProductGrid';
import OurModels from '../components/OurModels';

const Home = () => {
    return (
        <div className="home-page">
            <HeroSection />
            <ProductGrid />
            <FeaturedCollections />
            <OurModels />
        </div>
    );
};

export default Home;
