import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedCollections from '../components/FeaturedCollections';
import ProductGrid from '../components/ProductGrid';

const Home = () => {


    return (
        <div className="home-page">
            <HeroSection />
            <ProductGrid />
            <FeaturedCollections />
        </div>
    );
};

export default Home;
