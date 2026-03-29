import React, { useState, useRef, useEffect, useCallback } from 'react';
import API_HOST from '../config';
import '../styles/ModelApply.css';

const ModelApply = () => {
    const [form, setForm] = useState({ displayName: '', instagramUsername: '' });
    const [photo, setPhoto] = useState(null);         // manual upload File
    const [preview, setPreview] = useState(null);     // shown in the circle
    const [fetchedIgUrl, setFetchedIgUrl] = useState(null); // auto-fetched from IG
    const [igStatus, setIgStatus] = useState('idle'); // 'idle'|'loading'|'found'|'not_found'
    const [status, setStatus] = useState({ loading: false, type: '', message: '' });
    const fileRef = useRef();
    const debounceRef = useRef();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

        // Trigger DP fetch when Instagram username changes
        if (e.target.name === 'instagramUsername') {
            const raw = e.target.value.replace(/^@/, '').trim();
            clearTimeout(debounceRef.current);
            if (raw.length < 2) {
                setIgStatus('idle');
                setFetchedIgUrl(null);
                if (!photo) setPreview(null);
                return;
            }
            setIgStatus('loading');
            debounceRef.current = setTimeout(() => fetchDP(raw), 800);
        }
    };

    const fetchDP = useCallback(async (username) => {
        try {
            const res = await fetch(`${API_HOST}/api/models/fetch-dp?username=${encodeURIComponent(username)}`);
            const data = await res.json();
            if (data?.url) {
                setFetchedIgUrl(data.url);
                if (!photo) setPreview(data.url); // only auto-set if user hasn't manually uploaded
                setIgStatus('found');
            } else {
                setFetchedIgUrl(null);
                setIgStatus('not_found');
                if (!photo) setPreview(null);
            }
        } catch {
            setFetchedIgUrl(null);
            setIgStatus('not_found');
        }
    }, [photo]);

    // Clean up debounce on unmount
    useEffect(() => () => clearTimeout(debounceRef.current), []);

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPhoto(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!preview && !fetchedIgUrl && !photo) {
            return setStatus({ loading: false, type: 'error', message: 'Please enter your Instagram username or upload a photo.' });
        }

        setStatus({ loading: true, type: '', message: '' });
        const username = form.instagramUsername.replace(/^@/, '').trim().toLowerCase();

        const body = new FormData();
        body.append('displayName', form.displayName);
        body.append('instagramUsername', username);
        body.append('uploadFolder', 'syla_models');
        // If user uploaded a file, send it. Otherwise pass the fetched Instagram URL.
        if (photo) {
            body.append('photo', photo);
        } else if (fetchedIgUrl) {
            body.append('profilePicUrl', fetchedIgUrl);
        }

        try {
            const res = await fetch(`${API_HOST}/api/models/apply`, {
                method: 'POST',
                body
            });
            const data = await res.json();

            if (res.ok) {
                setStatus({ loading: false, type: 'success', message: data.message });
                setForm({ displayName: '', instagramUsername: '' });
                setPhoto(null);
                setPreview(null);
                setFetchedIgUrl(null);
                setIgStatus('idle');
            } else {
                setStatus({ loading: false, type: 'error', message: data.message || 'Something went wrong.' });
            }
        } catch {
            setStatus({ loading: false, type: 'error', message: 'Network error. Please try again.' });
        }
    };

    const avatarSrc = preview || null;
    const initials = form.displayName ? form.displayName.trim()[0].toUpperCase() : '?';

    return (
        <div className="model-apply-page">
            <div className="model-apply-card">
                <div className="model-apply-brand">
                    <img src="/Syla3d_logo.png" alt="Syla" className="model-apply-logo" />
                </div>

                <h1 className="model-apply-title">Be a Syla Model</h1>
                <p className="model-apply-sub">
                    We celebrate real people in real fashion. Enter your Instagram handle and we'll automatically fetch your profile picture.
                </p>

                {status.message && (
                    <div className={`model-apply-alert ${status.type}`}>
                        {status.type === 'success' ? '🎉' : '⚠️'} {status.message}
                    </div>
                )}

                {status.type !== 'success' && (
                    <form onSubmit={handleSubmit} className="model-apply-form">

                        {/* Live Avatar Preview */}
                        <div className="model-apply-avatar-section">
                            <div
                                className="model-apply-avatar-circle"
                                onClick={() => fileRef.current.click()}
                                title="Click to upload your own photo"
                            >
                                {avatarSrc ? (
                                    <img src={avatarSrc} alt="Preview" className="model-apply-avatar-img" />
                                ) : (
                                    <div className="model-apply-avatar-initials">
                                        {igStatus === 'loading'
                                            ? <span className="model-apply-spinner" />
                                            : <span>{initials}</span>
                                        }
                                    </div>
                                )}
                                <div className="model-apply-avatar-overlay">
                                    <span>📷 Upload Photo</span>
                                </div>
                            </div>

                            {/* Status badge */}
                            {igStatus === 'loading' && (
                                <p className="ig-status-text loading">⏳ Fetching Instagram DP...</p>
                            )}
                            {igStatus === 'found' && !photo && (
                                <p className="ig-status-text success">✅ Instagram DP loaded automatically!</p>
                            )}
                            {igStatus === 'not_found' && (
                                <p className="ig-status-text warning">⚠️ Couldn't auto-fetch. Please upload your photo below.</p>
                            )}
                            {photo && (
                                <p className="ig-status-text success">✅ Custom photo selected.</p>
                            )}
                        </div>

                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhoto}
                            style={{ display: 'none' }}
                        />

                        <div className="model-apply-field">
                            <label>Your Name</label>
                            <input
                                type="text"
                                name="displayName"
                                placeholder="e.g. Priya Sharma"
                                value={form.displayName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="model-apply-field">
                            <label>Instagram Username</label>
                            <div className="instagram-input-wrapper">
                                <span className="at-sign">@</span>
                                <input
                                    type="text"
                                    name="instagramUsername"
                                    placeholder="your_handle"
                                    value={form.instagramUsername}
                                    onChange={handleChange}
                                    required
                                />
                                {igStatus === 'loading' && <span className="ig-input-spinner" />}
                                {igStatus === 'found' && !photo && <span className="ig-input-tick">✓</span>}
                            </div>
                            <p className="model-apply-hint">
                                We'll auto-fetch your DP. If it doesn't work, click the circle above to upload manually.
                            </p>
                        </div>

                        <button type="submit" className="model-apply-btn" disabled={status.loading}>
                            {status.loading ? 'Submitting...' : '✨ Submit Application'}
                        </button>
                    </form>
                )}

                <p className="model-apply-footer">
                    By submitting you agree to let Syla feature your photo on our website.
                </p>
            </div>
        </div>
    );
};

export default ModelApply;
