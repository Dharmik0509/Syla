import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/AdminCommon.css';

const Dashboard = () => {
    return (
        <AdminLayout>
            <div className="admin-container">
                <div className="admin-page-header">
                    <div>
                        <h2 className="admin-title">Dashboard</h2>
                        <p className="admin-subtitle">Overview of your store's performance.</p>
                    </div>
                    <button className="admin-btn admin-btn-primary">
                        Download Report
                    </button>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    <div className="admin-card" style={{ marginBottom: 0 }}>
                        <h4 style={{ color: '#666', marginBottom: '10px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Revenue</h4>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1A4D33' }}>₹0.00</div>
                        <span className="status-badge status-success" style={{ marginTop: '10px', display: 'inline-block' }}>+0% this month</span>
                    </div>

                    <div className="admin-card" style={{ marginBottom: 0 }}>
                        <h4 style={{ color: '#666', marginBottom: '10px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Active Orders</h4>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>0</div>
                        <span className="status-badge status-warning" style={{ marginTop: '10px', display: 'inline-block' }}>Pending</span>
                    </div>

                    <div className="admin-card" style={{ marginBottom: 0 }}>
                        <h4 style={{ color: '#666', marginBottom: '10px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Products</h4>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>--</div>
                    </div>

                    <div className="admin-card" style={{ marginBottom: 0 }}>
                        <h4 style={{ color: '#666', marginBottom: '10px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Customers</h4>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>0</div>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="admin-card">
                    <h3 style={{ borderBottom: '1px solid #eaeaea', paddingBottom: '15px', marginBottom: '15px' }}>Recent Activity</h3>
                    <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                        No new activity to show.
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};
export default Dashboard;
