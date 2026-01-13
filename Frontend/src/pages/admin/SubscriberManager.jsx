import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminUI } from '../../context/AdminUIContext';
import API_HOST from '../../config';
import '../../styles/AdminLayout.css';
import '../../styles/AdminCommon.css';
import { FaTrash, FaDownload } from 'react-icons/fa';

const SubscriberManager = () => {
    const { showToast, confirmAction } = useAdminUI();
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_HOST}/api/get-subscribers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            const data = await res.json();
            if (res.ok) {
                setSubscribers(data);
            }
        } catch (error) {
            console.error("Error fetching subscribers:", error);
            showToast("Failed to load subscribers", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        confirmAction("Are you sure you want to remove this subscriber?", async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await fetch(`${API_HOST}/api/delete-subscriber`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify({ id })
                });
                if (res.ok) {
                    showToast("Subscriber removed", "success");
                    fetchSubscribers();
                } else {
                    showToast("Failed to delete", "error");
                }
            } catch (error) {
                console.error(error);
                showToast("Error deleting subscriber", "error");
            }
        });
    };

    const handleExportCSV = () => {
        if (subscribers.length === 0) return;

        const csvContent = "data:text/csv;charset=utf-8,"
            + "Email,Subscribed Date\n"
            + subscribers.map(sub => `${sub.email},${new Date(sub.subscribedAt).toLocaleDateString()}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "subscribers.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AdminLayout>
            <div className="admin-container">
                <div className="admin-page-header">
                    <div>
                        <h2 className="admin-title">Newsletter Subscribers</h2>
                        <p className="admin-subtitle">Manage your email list and export for marketing</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <button className="admin-btn admin-btn-primary" onClick={handleExportCSV}>
                            <FaDownload style={{ marginRight: '8px' }} /> Export CSV
                        </button>
                    </div>
                </div>

                <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="admin-table-container" style={{ border: 'none', borderRadius: 0 }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th style={{ paddingLeft: '20px' }}>Email</th>
                                    <th>Date Subscribed</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>
                                ) : subscribers.length === 0 ? (
                                    <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>No subscribers yet.</td></tr>
                                ) : (
                                    subscribers.map(sub => (
                                        <tr key={sub._id}>
                                            <td style={{ paddingLeft: '20px' }}>{sub.email}</td>
                                            <td>{new Date(sub.subscribedAt).toLocaleDateString()} {new Date(sub.subscribedAt).toLocaleTimeString()}</td>
                                            <td>
                                                <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(sub._id)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default SubscriberManager;

