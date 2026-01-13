import React, { createContext, useContext, useState, useEffect } from 'react';
import API_HOST from '../config';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGlobalData = async () => {
        try {
            // Parallel Fetch for efficiency
            const [catRes, annRes, discRes] = await Promise.all([
                fetch(`${API_HOST}/api/get-categories`, { method: 'POST' }),
                fetch(`${API_HOST}/api/fetch-active-announcements`),
                fetch(`${API_HOST}/api/fetch-public-discounts`)
            ]);

            const [catData, annData, discData] = await Promise.all([
                catRes.json(),
                annRes.json(),
                discRes.json()
            ]);

            setCategories(catData || []);
            setAnnouncements(annData || []);
            setDiscounts(discData || []);
        } catch (error) {
            console.error("Error fetching global shop data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGlobalData();
    }, []);

    // Memoize value to prevent unnecessary re-renders
    const value = {
        categories,
        announcements,
        discounts,
        loading,
        refreshGlobalData: fetchGlobalData
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};
