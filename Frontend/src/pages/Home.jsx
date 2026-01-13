import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedCollections from '../components/FeaturedCollections';
import StorySection from '../components/StorySection';
import ProductGrid from '../components/ProductGrid';

const Home = () => {


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
