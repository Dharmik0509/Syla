import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for contacting us! We will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="contact-page" style={{ padding: 'calc(var(--header-height) + 4rem) 2rem 4rem', backgroundColor: '#fff' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>
                    Contact Us
                </h1>
                <p style={{ textAlign: 'center', marginBottom: '3rem', color: '#666' }}>
                    We'd love to hear from you. Whether you have a question about our products, production, or just want to say hello.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="5"
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="primary-btn"
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            alignSelf: 'flex-start'
                        }}
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
