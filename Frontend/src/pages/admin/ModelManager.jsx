import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import API_HOST, { APP_URL } from '../../config';
import { useAdminUI } from '../../context/AdminUIContext';
import '../../styles/DiscountManager.css';

const MODEL_APPLY_URL = `${APP_URL}/model-apply`;

const ModelManager = () => {
    const { showToast, confirmAction } = useAdminUI();
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'approved'
    const [copied, setCopied] = useState(false);

    useEffect(() => { fetchModels(); }, []);

    const fetchModels = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_HOST}/api/models/all`, {
                headers: { Authorization: token }
            });
            const data = await res.json();
            if (res.ok) setModels(Array.isArray(data) ? data : []);
        } catch (e) {
            showToast('Failed to load models.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const approve = async (id) => {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${API_HOST}/api/models/approve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: token },
            body: JSON.stringify({ id })
        });
        if (res.ok) { showToast('Model approved!', 'success'); fetchModels(); }
        else showToast('Failed to approve.', 'error');
    };

    const reject = async (id) => {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${API_HOST}/api/models/reject`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: token },
            body: JSON.stringify({ id })
        });
        if (res.ok) { showToast('Model unapproved.', 'success'); fetchModels(); }
        else showToast('Failed.', 'error');
    };

    const remove = async (id) => {
        confirmAction('Delete this model submission?', async () => {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_HOST}/api/models/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: token },
                body: JSON.stringify({ id })
            });
            if (res.ok) { showToast('Deleted.', 'success'); fetchModels(); }
            else showToast('Failed.', 'error');
        });
    };

    const copyLink = () => {
        navigator.clipboard.writeText(MODEL_APPLY_URL).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    const filtered = models.filter(m => {
        if (filter === 'pending') return !m.isApproved;
        if (filter === 'approved') return m.isApproved;
        return true;
    });

    return (
        <AdminLayout>
            <div className="dm-container">
                {/* Header */}
                <div className="dm-header">
                    <div>
                        <h1 className="dm-title">Our Models</h1>
                        <p className="dm-subtitle">Manage model applications and control who appears on the homepage.</p>
                    </div>

                    {/* Share link */}
                    <div className="model-share-box">
                        <span className="model-share-label">Application Form Link</span>
                        <div className="model-share-row">
                            <input readOnly value={MODEL_APPLY_URL} className="model-share-input" />
                            <button className="model-share-copy-btn" onClick={copyLink}>
                                {copied ? '✓ Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filter tabs */}
                <div className="model-filter-tabs">
                    {['all', 'pending', 'approved'].map(f => (
                        <button
                            key={f}
                            className={`model-filter-tab ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                            {' '}({models.filter(m => f === 'all' ? true : f === 'approved' ? m.isApproved : !m.isApproved).length})
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="model-empty">
                        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</div>
                        <p>{filter === 'pending' ? 'No pending applications.' : filter === 'approved' ? 'No approved models yet.' : 'No submissions yet.'}</p>
                    </div>
                ) : (
                    <div className="model-cards-grid">
                        {filtered.map(model => (
                            <div key={model._id} className={`model-admin-card ${model.isApproved ? 'approved' : 'pending'}`}>
                                <div className="model-admin-avatar-wrap">
                                    <img
                                        src={model.profilePicUrl || `https://unavatar.io/instagram/${model.instagramUsername}`}
                                        alt={model.displayName}
                                        className="model-admin-avatar"
                                        onError={e => { e.target.src = `https://unavatar.io/instagram/${model.instagramUsername}`; e.target.onerror = null; }}
                                    />
                                </div>
                                <div className="model-admin-info">
                                    <h3 className="model-admin-name">{model.displayName}</h3>
                                    <a
                                        href={`https://www.instagram.com/${model.instagramUsername}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="model-admin-handle"
                                    >
                                        @{model.instagramUsername}
                                    </a>
                                    <span className={`model-admin-badge ${model.isApproved ? 'badge-approved' : 'badge-pending'}`}>
                                        {model.isApproved ? '✓ Featured' : '⏳ Pending'}
                                    </span>
                                </div>
                                <div className="model-admin-actions">
                                    {model.isApproved ? (
                                        <button className="btn-outline-red" onClick={() => reject(model._id)}>Unfeature</button>
                                    ) : (
                                        <button className="btn-green" onClick={() => approve(model._id)}>✓ Approve</button>
                                    )}
                                    <button className="btn-outline-red" onClick={() => remove(model._id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .model-share-box { background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; padding: 14px 18px; min-width: 340px; }
                .model-share-label { font-size: 0.8rem; font-weight: 600; color: #666; letter-spacing: 0.05em; display: block; margin-bottom: 8px; }
                .model-share-row { display: flex; gap: 8px; }
                .model-share-input { flex: 1; padding: 9px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 0.82rem; color: #555; outline: none; background: #fff; }
                .model-share-copy-btn { padding: 9px 18px; background: #1A4D33; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; white-space: nowrap; }
                .model-filter-tabs { display: flex; gap: 8px; margin: 24px 0 20px; }
                .model-filter-tab { padding: 8px 20px; border: 1.5px solid #ddd; border-radius: 50px; background: #fff; cursor: pointer; font-size: 0.9rem; color: #666; transition: all 0.2s; }
                .model-filter-tab.active { background: #1A4D33; color: #fff; border-color: #1A4D33; }
                .model-empty { text-align: center; padding: 60px 20px; color: #aaa; font-size: 1rem; }
                .model-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
                .model-admin-card { background: #fff; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border: 1.5px solid transparent; transition: border-color 0.2s; }
                .model-admin-card.approved { border-color: rgba(26,77,51,0.2); }
                .model-admin-card.pending { border-color: rgba(255,193,7,0.3); }
                .model-admin-avatar-wrap { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg,#c5a059,#1A4D33); padding: 2.5px; margin-bottom: 14px; }
                .model-admin-avatar { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 3px solid #fff; }
                .model-admin-name { font-size: 1rem; font-weight: 600; color: #222; margin: 0 0 4px; }
                .model-admin-handle { font-size: 0.82rem; color: #3897f0; text-decoration: none; display: block; margin-bottom: 10px; }
                .model-admin-badge { font-size: 0.75rem; font-weight: 600; padding: 3px 10px; border-radius: 50px; display: inline-block; }
                .badge-approved { background: #e8f5e9; color: #2e7d32; }
                .badge-pending { background: #fff8e1; color: #856a00; }
                .model-admin-actions { display: flex; gap: 8px; margin-top: 16px; width: 100%; }
                .btn-green { flex: 1; padding: 9px 12px; background: #1A4D33; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; }
                .btn-outline-red { flex: 1; padding: 9px 12px; background: #fff; color: #d32f2f; border: 1px solid #d32f2f; border-radius: 6px; cursor: pointer; font-size: 0.85rem; }
                @media (max-width: 600px) { .dm-header { flex-direction: column; gap: 16px; } .model-share-box { min-width: unset; width: 100%; } }
            `}</style>
        </AdminLayout>
    );
};

export default ModelManager;
