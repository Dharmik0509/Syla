import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiBox, FiList, FiImage, FiLogOut, FiMenu, FiTag, FiBell, FiGift, FiUsers } from 'react-icons/fi';
import '../../styles/AdminLayout.css';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth > 768);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const menuItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <FiGrid /> },
        { label: 'Categories', path: '/admin/categories', icon: <FiList /> },
        { label: 'Products', path: '/admin/products', icon: <FiBox /> },
        { label: 'Discounts', path: '/admin/discounts', icon: <FiTag /> },
        { label: 'Announcements', path: '/admin/announcements', icon: <FiBell /> },
        { label: 'Hero Image', path: '/admin/hero', icon: <FiImage /> },
        { label: 'Unlock Giveaway', path: '/admin/giveaway', icon: <FiGift /> },
        { label: 'Subscribers', path: '/admin/subscribers', icon: <FiUsers /> },
    ];

    return (
        <div className="admin-layout">
            <div
                className={`admin-sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="admin-logo">
                    <h2>SYLA ADMIN</h2>
                </div>
                <nav className="admin-nav">
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
                                <Link
                                    to={item.path}
                                    onClick={() => {
                                        if (window.innerWidth <= 768) setIsSidebarOpen(false);
                                    }}
                                >
                                    <span className="icon">{item.icon}</span>
                                    {isSidebarOpen && <span className="label">{item.label}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="admin-logout">
                    <button onClick={handleLogout}>
                        <span className="icon"><FiLogOut /></span>
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>
            <main className="admin-main">
                <header className="admin-header">
                    <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <FiMenu />
                    </button>
                    <div className="admin-user">
                        <span>Admin</span>
                    </div>
                </header>
                <div className="admin-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
