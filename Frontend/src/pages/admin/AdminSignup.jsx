import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/AdminLogin.css'; // Reusing existing login styles
import API_HOST from '../../config';

const AdminSignup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${API_HOST}/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ personName: name, email, password, user_type: 'admin' }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Account created! Please login.');
                navigate('/admin/login');
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError('Server connection failed');
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <h2>Admin Signup</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">Create Account</button>
                    <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                        Already have an account? <Link to="/admin/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AdminSignup;
