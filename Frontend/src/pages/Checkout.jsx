import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import '../styles/AuthModal.css'; // Reuse form styles

const Checkout = () => {
    const { cart, clearCart } = useShop();
    const navigate = useNavigate();
    
    // Address Form State
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        pincode: '',
        phone: ''
    });

    useEffect(() => {
        // Redirect if cart is empty or user is not logged in
        const token = localStorage.getItem('customerToken');
        if (!token || cart.length === 0) {
            navigate('/');
        }
    }, [cart, navigate]);

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.cartPrice * item.quantity), 0);
    };

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        
        let message = `Hello Syla! I would like to place an order.\n\n*Order Details:*\n`;
        
        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.title} (Size: ${item.size})\n   Qty: ${item.quantity} x ₹${item.cartPrice} = ₹${item.quantity * item.cartPrice}\n   Link: ${window.location.origin}/product/${item._id}\n`;
        });
        
        message += `\n*Order Subtotal:* ₹${calculateTotal()}`;
        
        message += `\n\n*Shipping Address:*\n${address.street}, ${address.city}, ${address.state} - ${address.pincode}\nPhone: ${address.phone}`;
        
        // Open WhatsApp
        const url = `https://wa.me/919274720033?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        
        // Clear cart and redirect home
        clearCart();
        navigate('/');
    };

    return (
        <div className="container" style={{ padding: '120px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'var(--font-family-headings)', marginBottom: '30px', color: 'var(--primary)' }}>Checkout</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                {/* Left Side: Address Form */}
                <div className="checkout-form-container">
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Shipping Details</h2>
                    <form onSubmit={handlePlaceOrder} className="auth-form" style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                        <div className="input-group">
                            <label>Phone Number</label>
                            <input type="text" name="phone" required value={address.phone} onChange={handleAddressChange} placeholder="e.g. 9876543210" />
                        </div>
                        <div className="input-group">
                            <label>Street Address</label>
                            <input type="text" name="street" required value={address.street} onChange={handleAddressChange} placeholder="House No, Building, Street" />
                        </div>
                        <div className="input-group">
                            <label>City</label>
                            <input type="text" name="city" required value={address.city} onChange={handleAddressChange} placeholder="City District" />
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label>State</label>
                                <input type="text" name="state" required value={address.state} onChange={handleAddressChange} placeholder="State" />
                            </div>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label>Pincode</label>
                                <input type="text" name="pincode" required value={address.pincode} onChange={handleAddressChange} placeholder="Pincode" />
                            </div>
                        </div>

                        <button type="submit" className="auth-submit-btn" style={{ marginTop: '20px', width: '100%' }}>
                            Proceed to WhatsApp Order
                        </button>
                    </form>
                </div>

                {/* Right Side: Order Summary */}
                <div className="checkout-summary" style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Order Summary</h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', maxHeight: '400px', overflowY: 'auto' }}>
                        {cart.map((item, index) => (
                            <div key={index} style={{ display: 'flex', gap: '15px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                                <img src={item.images?.[0] || 'https://via.placeholder.com/60'} alt={item.title} style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                                <div>
                                    <h3 style={{ fontSize: '1rem', margin: '0 0 5px 0' }}>{item.title}</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#666', margin: '0 0 5px 0' }}>Size: {item.size} | Qty: {item.quantity}</p>
                                    <p style={{ fontWeight: 500, margin: 0 }}>₹{item.cartPrice * item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', paddingTop: '15px', borderTop: '2px solid #eee' }}>
                        <span>Total to Pay:</span>
                        <span>₹{calculateTotal()}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '10px' }}>
                        * Payment details and shipping methods will be confirmed via WhatsApp.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
