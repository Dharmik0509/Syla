import React, { createContext, useContext, useState, useEffect } from 'react';
import API_HOST from '../config';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cart State
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('syla_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('syla_cart', JSON.stringify(cart));
    }, [cart]);

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

    // --- Cart Functions ---
    const addToCart = (product, quantity = 1, size = 'Free Size', customizedPrice = null) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(item => item._id === product._id && item.size === size);
            
            const itemPrice = customizedPrice !== null ? customizedPrice : product.price;

            if (existingItemIndex >= 0) {
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            } else {
                return [...prevCart, { ...product, quantity, size, cartPrice: itemPrice }];
            }
        });
    };

    const removeFromCart = (productId, size = 'Free Size') => {
        setCart(prevCart => prevCart.filter(item => !(item._id === productId && item.size === size)));
    };

    const updateQuantity = (productId, size, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId, size);
            return;
        }
        setCart(prevCart => prevCart.map(item => 
            (item._id === productId && item.size === size) 
                ? { ...item, quantity: newQuantity } 
                : item
        ));
    };

    const clearCart = () => {
        setCart([]);
    };

    // Memoize value to prevent unnecessary re-renders
    const value = {
        categories,
        announcements,
        discounts,
        loading,
        refreshGlobalData: fetchGlobalData,
        // Cart exports
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};
