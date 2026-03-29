import React, { useState } from 'react';
import API_HOST from '../config';
import '../styles/AuthModal.css';

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
    const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot'
    const [formData, setFormData] = useState({ personName: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('auth-modal-overlay')) {
            onClose();
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            let endpoint = '';
            let payload = {};

            if (mode === 'login') {
                endpoint = '/api/login';
                payload = { email: formData.email, password: formData.password };
            } else if (mode === 'signup') {
                endpoint = '/api/signup';
                payload = { personName: formData.personName, email: formData.email, password: formData.password, user_type: 'customer' };
            } else if (mode === 'forgot') {
                endpoint = '/api/forgot-password';
                payload = { email: formData.email };
            }

            const response = await fetch(`${API_HOST}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Authentication failed');
            }

            if (mode === 'forgot') {
                setSuccessMsg('A password reset link has been sent to your email.');
                setFormData({ ...formData, email: '' });
            } else {
                // Successful Login or Signup
                localStorage.setItem('customerToken', data.token);
                localStorage.setItem('customerProfile', JSON.stringify(data.user));
                onSuccess(data.user);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`auth-modal-overlay ${isOpen ? 'active' : ''}`} onClick={handleOverlayClick}>
            <div className="auth-modal">
                <button className="auth-close-btn" onClick={onClose}>&times;</button>
                
                <div className="auth-modal-header">
                    <h2>{mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}</h2>
                    <p>
                        {mode === 'login' && 'Sign in to access your saved bags and faster checkout.'}
                        {mode === 'signup' && 'Join Syla today for an exclusive shopping experience.'}
                        {mode === 'forgot' && 'Enter your email to receive a password reset link.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error-msg">{error}</div>}
                    {successMsg && <div className="auth-success-msg">{successMsg}</div>}

                    {mode === 'signup' && (
                        <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" name="personName" required value={formData.personName} onChange={handleChange} placeholder="Enter your name" />
                        </div>
                    )}
                    
                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Enter your email" />
                    </div>

                    {mode !== 'forgot' && (
                        <div className="input-group">
                            <label>Password</label>
                            <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Enter your password" />
                        </div>
                    )}

                    {mode === 'login' && (
                        <div className="forgot-password-link" onClick={() => setMode('forgot')}>
                            Forgot Password?
                        </div>
                    )}

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Reset Link')}
                    </button>
                    
                    <div className="auth-switch">
                        {mode === 'login' && (
                            <p>Don't have an account? <span onClick={() => {setMode('signup'); setError(null); setSuccessMsg(null);}}>Sign Up here</span></p>
                        )}
                        {(mode === 'signup' || mode === 'forgot') && (
                            <p>Already have an account? <span onClick={() => {setMode('login'); setError(null); setSuccessMsg(null);}}>Log In here</span></p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthModal;
