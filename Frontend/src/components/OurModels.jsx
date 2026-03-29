import React, { useEffect, useState } from 'react';
import API_HOST from '../config';
import '../styles/OurModels.css';

const OurModels = () => {
    const [models, setModels] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        fetch(`${API_HOST}/api/models/approved`)
            .then(r => r.json())
            .then(data => {
                setModels(Array.isArray(data) ? data : []);
                setLoaded(true);
            })
            .catch(() => setLoaded(true));
    }, []);

    // Hide entirely if no models
    if (!loaded || models.length === 0) return null;

    return (
        <section className="our-models-section">
            <div className="our-models-header">
                <p className="our-models-eyebrow">Real People, Real Fashion</p>
                <h2 className="our-models-title">Our Models</h2>
                <p className="our-models-subtitle">
                    Meet the beautiful souls who wear Syla with pride.
                </p>
            </div>

            <div className="our-models-grid">
                {models.map(model => (
                    <a
                        key={model._id}
                        href={`https://www.instagram.com/${model.instagramUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="model-card"
                        title={`@${model.instagramUsername}`}
                    >
                        <div className="model-avatar-wrap">
                            <img
                                src={model.profilePicUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(model.displayName)}&background=1A4D33&color=fff&size=200`}
                                alt={model.displayName}
                                className="model-avatar"
                                onError={e => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(model.displayName)}&background=1A4D33&color=fff&size=200`;
                                    e.target.onerror = null;
                                }}
                            />
                            <div className="model-ig-badge">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </div>
                        </div>
                        <p className="model-name">{model.displayName}</p>
                        <p className="model-handle">@{model.instagramUsername}</p>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default OurModels;
