import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_HOST from '../config';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_HOST}/api/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 3000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container" style={{ padding: '120px 20px', textAlign: 'center', minHeight: '60vh' }}>
                <h1 style={{ color: '#2e7d32', marginBottom: '20px' }}>Password Successfully Reset!</h1>
                <p>You can now log in with your new password. Returning to home...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '120px 20px', maxWidth: '500px', margin: '0 auto', minHeight: '60vh' }}>
            <h1 style={{ fontFamily: 'var(--font-family-headings)', marginBottom: '30px', textAlign: 'center' }}>Reset Your Password</h1>
            
            <form onSubmit={handleSubmit} className="auth-form" style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                {error && <div className="auth-error-msg" style={{ background: '#ffebee', color: '#d32f2f', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}
                
                <div className="input-group" style={{ marginBottom: '15px', textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>New Password</label>
                    <input 
                        type="password" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} 
                    />
                </div>
                
                <div className="input-group" style={{ marginBottom: '20px', textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Confirm New Password</label>
                    <input 
                        type="password" 
                        required 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }} 
                    />
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', background: 'var(--primary)', color: 'white', border: 'none', padding: '15px', fontSize: '1.1rem', borderRadius: '4px', cursor: 'pointer' }}>
                    {loading ? 'Resetting...' : 'Set New Password'}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
