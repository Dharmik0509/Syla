
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/AdminCommon.css'; // Shared styles
import API_HOST from '../../config';
import { useAdminUI } from '../../context/AdminUIContext';

const DiscountManager = () => {
    const [discounts, setDiscounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const { showToast, confirmAction } = useAdminUI();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: 'PERCENTAGE',
        value: '',
        appliesTo: 'CATEGORY', // CATEGORY, PRODUCT, ALL
        targetValues: [], // Array of IDs
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchDiscounts();
        fetchCategories();
        fetchProducts();
    }, []);

    const fetchDiscounts = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_HOST}/api/fetch-all-discounts`, {
                method: 'POST',
                headers: { 'Authorization': token }
            });
            const data = await response.json();
            setDiscounts(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching discounts:", error);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_HOST}/api/get-categories`, { method: 'POST' });
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_HOST}/api/get-products`, { method: 'POST' });
            const data = await response.json();
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                setProducts([]);
                console.error("Products API returned non-array:", data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Number(formData.value) < 0) {
            showToast("Discount value cannot be negative!", "error");
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('adminToken');

            // Format payload
            const payload = {
                ...formData,
                targetValues: Array.isArray(formData.targetValues) ? formData.targetValues : [formData.targetValues]
            };
            // If appliesTo is ALL, targetValues is irrelevant but keep logic clean

            const response = await fetch(`${API_HOST}/api/add-new-discount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                showToast('Discount rule created successfully!', 'success');
                setShowForm(false);
                setFormData({
                    name: '', type: 'PERCENTAGE', value: '', appliesTo: 'CATEGORY', targetValues: [], startDate: '', endDate: ''
                });
                fetchDiscounts();
            } else {
                const errorData = await response.json();
                showToast(`Failed: ${errorData.message}`, 'error');
            }
        } catch (error) {
            console.error("Error creating discount:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${API_HOST}/api/toggle-discount-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ id, isActive: !currentStatus })
            });
            fetchDiscounts();
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    const handleDelete = (id) => {
        confirmAction("Are you sure you want to delete this discount?", async () => {
            try {
                const token = localStorage.getItem('adminToken');
                await fetch(`${API_HOST}/api/remove-discount`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify({ id })
                });
                fetchDiscounts();
                showToast('Discount deleted', 'success');
            } catch (error) {
                console.error("Error deleting discount:", error);
                showToast('Error deleting discount', 'error');
            }
        });
    };

    const applyDiscount = (id) => {
        confirmAction(
            "Apply this discount logic to matching products?",
            async () => {
                try {
                    const token = localStorage.getItem('adminToken');
                    const response = await fetch(`${API_HOST}/api/execute-discount-rule`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        },
                        body: JSON.stringify({ id: id })
                    });

                    const data = await response.json();
                    if (response.ok) {
                        showToast(`Success: ${data.message}`, 'success');
                    } else {
                        showToast(`Failed: ${data.message}`, 'error');
                    }
                } catch (error) {
                    console.error("Error applying discount:", error);
                    showToast('Error applying discount', 'error');
                }
            },
            "Confirm Application",
            "primary"
        );
    };

    const handleTargetSelection = (id) => {
        setFormData(prev => {
            const currentTargets = prev.targetValues || [];
            if (currentTargets.includes(id)) {
                return { ...prev, targetValues: currentTargets.filter(t => t !== id) };
            } else {
                return { ...prev, targetValues: [...currentTargets, id] };
            }
        });
    };

    return (
        <AdminLayout>
            <div className="admin-container">
                <div className="admin-page-header">
                    <div>
                        <h2 className="admin-title">Discount Manager</h2>
                        <p className="admin-subtitle">Create sales and promotional offers.</p>
                    </div>
                    <button className={`admin-btn ${showForm ? 'admin-btn-secondary' : 'admin-btn-primary'}`} onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : '+ Create Discount'}
                    </button>
                </div>

                {showForm && (
                    <div className="admin-card">
                        <h3 style={{ marginBottom: '20px', color: '#1A4D33' }}>Create New Discount</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-form-group">
                                <label className="admin-label">Discount Name</label>
                                <input
                                    className="admin-input"
                                    placeholder="e.g. Diwali Sale"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="admin-row">
                                <div className="admin-col">
                                    <label className="admin-label">Discount Type</label>
                                    <select className="admin-select" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                        <option value="FIXED">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div className="admin-col">
                                    <label className="admin-label">Value</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="admin-input"
                                        placeholder="Value"
                                        value={formData.value}
                                        onChange={e => setFormData({ ...formData, value: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Applies To</label>
                                <select className="admin-select" value={formData.appliesTo} onChange={e => setFormData({ ...formData, appliesTo: e.target.value, targetValues: [] })}>
                                    <option value="CATEGORY">Specific Categories</option>
                                    <option value="PRODUCT">Specific Products</option>
                                    <option value="ALL">All Products (Global)</option>
                                </select>
                            </div>

                            {/* Target Selector */}
                            {formData.appliesTo === 'CATEGORY' && (
                                <div className="admin-form-group">
                                    <label className="admin-label">Select Categories</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', maxHeight: '200px', overflowY: 'auto', padding: '10px', border: '1px solid #eaeaea', borderRadius: '8px' }}>
                                        {categories.map(cat => (
                                            <div key={cat._id} onClick={() => handleTargetSelection(cat._id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: formData.targetValues.includes(cat._id) ? '#f0fdf4' : 'transparent', borderRadius: '6px', cursor: 'pointer', border: formData.targetValues.includes(cat._id) ? '1px solid #22c55e' : '1px solid transparent' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.targetValues.includes(cat._id)}
                                                    onChange={() => { }} // Handled by div click
                                                    style={{ accentColor: '#1A4D33' }}
                                                />
                                                <label style={{ cursor: 'pointer' }}>{cat.name}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                            {formData.appliesTo === 'PRODUCT' && (
                                <div className="admin-form-group">
                                    <label className="admin-label">Select Products</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', maxHeight: '300px', overflowY: 'auto', padding: '10px', border: '1px solid #eaeaea', borderRadius: '8px' }}>
                                        {products.map(prod => (
                                            <div key={prod._id} onClick={() => handleTargetSelection(prod._id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: formData.targetValues.includes(prod._id) ? '#f0fdf4' : 'transparent', borderRadius: '6px', cursor: 'pointer', border: formData.targetValues.includes(prod._id) ? '1px solid #22c55e' : '1px solid transparent' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.targetValues.includes(prod._id)}
                                                    onChange={() => { }} // Handled by div click
                                                    style={{ accentColor: '#1A4D33' }}
                                                />
                                                <label style={{ cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{prod.title}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="admin-row">
                                <div className="admin-col">
                                    <label className="admin-label">Start Date</label>
                                    <input type="date" className="admin-input" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                                </div>
                                <div className="admin-col">
                                    <label className="admin-label">End Date</label>
                                    <input type="date" className="admin-input" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                                </div>
                            </div>

                            <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                                {submitting ? 'Creating...' : 'Create Rule'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="admin-table-container" style={{ border: 'none', borderRadius: 0 }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Value</th>
                                    <th>Target</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {discounts.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                                            No discount rules found.
                                        </td>
                                    </tr>
                                ) : (
                                    discounts.map(discount => (
                                        <tr key={discount._id}>
                                            <td style={{ fontWeight: '500' }}>{discount.name}</td>
                                            <td><span className="status-badge" style={{ background: '#f3f4f6', color: '#374151' }}>{discount.type}</span></td>
                                            <td style={{ fontWeight: 'bold', color: '#1A4D33' }}>{discount.type === 'PERCENTAGE' ? `${discount.value}%` : `₹${discount.value}`}</td>
                                            <td>{discount.appliesTo}</td>
                                            <td>
                                                <button className="admin-btn admin-btn-secondary" onClick={() => applyDiscount(discount._id)} style={{ marginRight: '10px', fontSize: '0.8rem', padding: '6px 12px' }}>
                                                    Apply to Products
                                                </button>
                                                <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(discount._id)} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Delete</button>
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
export default DiscountManager;
