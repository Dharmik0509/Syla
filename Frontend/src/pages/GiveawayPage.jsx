import React, { useState } from 'react';
import API_HOST from '../config';

const GiveawayPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNo: '',
        instagramId: ''
    });
    const [status, setStatus] = useState({ loading: false, type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, type: '', message: '' });

        try {
            const response = await fetch(`${API_HOST}/api/giveaway/enter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (response.ok) {
                setStatus({ loading: false, type: 'success', message: data.message || "Entry submitted successfully!" });
                setFormData({ firstName: '', lastName: '', email: '', contactNo: '', instagramId: '' });
            } else {
                setStatus({ loading: false, type: 'error', message: data.message || "Failed to submit entry." });
            }
        } catch (error) {
            setStatus({ loading: false, type: 'error', message: "Something went wrong. Please try again." });
        }
    };

    return (
        <div className="container" style={{ paddingTop: 'calc(var(--header-height) + 40px)', paddingBottom: '60px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontFamily: 'Cinzel, serif', marginBottom: '10px' }}>Join the Giveaway</h1>
                <p style={{ color: '#666', marginBottom: '30px' }}>Fill in your details for a chance to win exclusive rewards!</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contact Number</label>
                        <input
                            type="tel"
                            name="contactNo"
                            value={formData.contactNo}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Instagram ID</label>
                        <input
                            type="text"
                            name="instagramId"
                            value={formData.instagramId}
                            onChange={handleChange}
                            placeholder="@yourusername"
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status.loading}
                        style={{
                            marginTop: '10px',
                            padding: '12px',
                            backgroundColor: '#1a1a1a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            opacity: status.loading ? 0.7 : 1
                        }}
                    >
                        {status.loading ? 'Submitting...' : 'Enter Giveaway'}
                    </button>

                    {status.message && (
                        <div style={{
                            marginTop: '15px',
                            padding: '10px',
                            borderRadius: '4px',
                            textAlign: 'center',
                            backgroundColor: status.type === 'success' ? '#d4edda' : '#f8d7da',
                            color: status.type === 'success' ? '#155724' : '#721c24'
                        }}>
                            {status.message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default GiveawayPage;
