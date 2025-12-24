import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiBox, FiList, FiImage, FiLogOut, FiMenu } from 'react-icons/fi';
import '../../styles/AdminLayout.css';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const menuItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <FiGrid /> },
        { label: 'Products', path: '/admin/products', icon: <FiBox /> },
        { label: 'Categories', path: '/admin/categories', icon: <FiList /> },
        { label: 'Hero Image', path: '/admin/hero', icon: <FiImage /> },
    ];

    return (
        <div className="admin-layout">
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="admin-logo">
                    <h2>SYLA ADMIN</h2>
                </div>
                <nav className="admin-nav">
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
                                <Link to={item.path}>
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
