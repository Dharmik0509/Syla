
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/ProductManager.css'; // Reuse generic styles
import API_HOST from '../../config';
import { useAdminUI } from '../../context/AdminUIContext';

const AnnouncementManager = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [text, setText] = useState('');
    const [link, setLink] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { showToast } = useAdminUI();

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_HOST}/api/fetch-all-announcements`, {
                method: 'POST',
                headers: {
                    'Authorization': token
                }
            });
            const data = await response.json();
            if (response.ok) {
                setAnnouncements(data);
            }
        } catch (error) {
            console.error("Error fetching announcements:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_HOST}/api/create-announcement`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ text, link, isActive })
            });

            if (response.ok) {
                showToast('Announcement created successfully!', 'success');
                setText('');
                setLink('');
                setIsActive(true);
                fetchAnnouncements();
            } else {
                showToast('Failed to create announcement', 'error');
            }
        } catch (error) {
            console.error("Error creating announcement:", error);
            showToast('Error creating announcement', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggle = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_HOST}/api/update-announcement`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ id, isActive: !currentStatus })
            });

            if (response.ok) {
                showToast('Status updated!', 'success');
                fetchAnnouncements();
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this announcement?")) return;
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_HOST}/api/delete-announcement`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ id })
            });

            if (response.ok) {
                showToast('Announcement deleted!', 'success');
                fetchAnnouncements();
            }
        } catch (error) {
            console.error("Error deleting announcement:", error);
        }
    };

    return (
        <AdminLayout>
            <div className="product-manager">
                <h2>Announcement Bar Manager</h2>
                <div className="product-form-container">
                    <h3>Add New Announcement</h3>
                    <form onSubmit={handleCreate} className="product-form">
                        <div className="form-row">
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#555' }}>Announcement Text</label>
                                <input
                                    placeholder="e.g. New Arrivals are here! Flat 20% Off."
                                    value={text}
                                    onChange={e => setText(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#555' }}>Link URL (Optional)</label>
                                <input
                                    placeholder="e.g. /collections/new-arrivals"
                                    value={link}
                                    onChange={e => setLink(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-row" style={{ alignItems: 'center', marginTop: '10px' }}>
                            <input
                                type="checkbox"
                                id="createIsActive"
                                checked={isActive}
                                onChange={e => setIsActive(e.target.checked)}
                                style={{ width: '20px', height: '20px', margin: 0 }}
                            />
                            <label htmlFor="createIsActive" style={{ margin: '0 0 0 10px', fontWeight: 'bold', color: '#333' }}>
                                Enable Immediately
                            </label>
                        </div>

                        <button type="submit" className="save-btn" disabled={submitting}>
                            {submitting ? 'Adding...' : 'Add Announcement'}
                        </button>
                    </form>
                </div>

                <div className="products-table">
                    <h3>All Announcements</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Active</th>
                                <th>Text</th>
                                <th>Link</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {announcements.map((ann) => (
                                <tr key={ann._id}>
                                    <td>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={ann.isActive}
                                                onChange={() => handleToggle(ann._id, ann.isActive)}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </td>
                                    <td>{ann.text}</td>
                                    <td>{ann.link || '-'}</td>
                                    <td>
                                        <button className="delete-btn" onClick={() => handleDelete(ann._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {announcements.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center' }}>No announcements found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AnnouncementManager;
