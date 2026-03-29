import React from 'react';
import { useShop } from '../context/ShopContext';
import '../styles/CartDrawer.css';

const CartDrawer = ({ isOpen, onClose, onCheckout, onAuthRequired, user }) => {
    const { cart, removeFromCart, updateQuantity, clearCart } = useShop();

    const calculateTotal = () =>
        cart.reduce((total, item) => total + (item.cartPrice * item.quantity), 0);

    const handleOrderWhatsApp = () => {
        if (!user) {
            // Not logged in — trigger auth modal
            onClose();
            onAuthRequired();
            return;
        }

        // Compile all cart items into one WhatsApp message
        let message = `Hello Syla! I would like to place an order. 🛍️\n\n*Order Details:*\n`;

        cart.forEach((item, index) => {
            message += `\n${index + 1}. *${item.title}*\n   Size: ${item.size} | Qty: ${item.quantity} x ₹${item.cartPrice} = ₹${item.quantity * item.cartPrice}\n`;
        });

        message += `\n*Total: ₹${calculateTotal()}*\n\nPlease let me know my shipping cost and payment details.`;

        const url = `https://wa.me/919274720033?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');

        // Clear cart after ordering
        clearCart();
        onClose();
    };

    return (
        <>
            <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>Your Bag ({cart.length})</h2>
                    <button className="cart-close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="cart-content">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <div className="empty-cart-icon">🛍️</div>
                            <p>Your bag is currently empty.</p>
                            <button className="continue-shopping-btn" onClick={onClose}>
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cart.map((item, index) => (
                            <div key={`${item._id}-${item.size}-${index}`} className="cart-item">
                                <img
                                    src={item.images?.[0] || 'https://via.placeholder.com/80'}
                                    alt={item.title}
                                    className="cart-item-img"
                                />
                                <div className="cart-item-info">
                                    <h3 className="cart-item-title">{item.title}</h3>
                                    <p className="cart-item-size">Size: {item.size}</p>
                                    <div className="cart-item-price">₹{item.cartPrice}</div>
                                    <div className="cart-item-controls">
                                        <div className="quantity-controls">
                                            <button onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}>+</button>
                                        </div>
                                        <button className="remove-item-btn" onClick={() => removeFromCart(item._id, item.size)}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                            <span>₹{calculateTotal()}</span>
                        </div>

                        {!user && (
                            <div className="cart-login-notice">
                                🔒 You need to <span onClick={() => { onClose(); onAuthRequired(); }}>login</span> to place an order.
                            </div>
                        )}

                        <button className="order-whatsapp-btn" onClick={handleOrderWhatsApp}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Order on WhatsApp
                        </button>

                        <button className="continue-shopping-link" onClick={onClose}>
                            ← Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
