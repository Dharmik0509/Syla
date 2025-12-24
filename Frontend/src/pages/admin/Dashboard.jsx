import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const Dashboard = () => {
    return (
        <AdminLayout>
            <div className="dashboard-content">
                <h1>Dashboard</h1>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Products</h3>
                        <p className="stat-number">Loading...</p>
                    </div>
                    <div className="stat-card">
                        <h3>Active Sales</h3>
                        <p className="stat-number">--</p>
                    </div>
                </div>
                <div className="welcome-message">
                    <h3>Welcome to Syla Admin</h3>
                    <p>Select a module from the sidebar to start managing your store.</p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
