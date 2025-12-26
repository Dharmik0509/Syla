
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/DiscountManager.css';
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
            <div className="discount-manager">
                <div className="dm-header">
                    <h2>Discount Manager</h2>
                    <button className="add-btn" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : '+ Create Discount'}
                    </button>
                </div>

                {showForm && (
                    <div className="discount-form-container">
                        <form onSubmit={handleSubmit} className="discount-form">
                            <input
                                placeholder="Discount Name (e.g. Diwali Sale)"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />

                            <div className="form-row">
                                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                    <option value="PERCENTAGE">Percentage (%)</option>
                                    <option value="FIXED">Fixed Amount (₹)</option>
                                </select>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Value"
                                    value={formData.value}
                                    onChange={e => setFormData({ ...formData, value: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <select value={formData.appliesTo} onChange={e => setFormData({ ...formData, appliesTo: e.target.value, targetValues: [] })}>
                                    <option value="CATEGORY">Specific Categories</option>
                                    <option value="PRODUCT">Specific Products</option>
                                    <option value="ALL">All Products (Global)</option>
                                </select>
                            </div>

                            {/* Target Selector */}
                            {formData.appliesTo === 'CATEGORY' && (
                                <div className="form-row" style={{ flexDirection: 'column' }}>
                                    <label>Select Categories:</label>
                                    <div className="checkbox-group">
                                        {categories.map(cat => (
                                            <div key={cat._id} className="checkbox-item" onClick={() => handleTargetSelection(cat._id)}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.targetValues.includes(cat._id)}
                                                    onChange={() => { }} // Handled by div click
                                                />
                                                <label>{cat.name}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                            {formData.appliesTo === 'PRODUCT' && (
                                <div className="form-row" style={{ flexDirection: 'column' }}>
                                    <label>Select Products:</label>
                                    <div className="checkbox-group">
                                        {products.map(prod => (
                                            <div key={prod._id} className="checkbox-item" onClick={() => handleTargetSelection(prod._id)}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.targetValues.includes(prod._id)}
                                                    onChange={() => { }} // Handled by div click
                                                />
                                                <label>{prod.title}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="form-row">
                                <label>Start Date:</label>
                                <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <label>End Date:</label>
                                <input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                            </div>

                            <button type="submit" className="save-btn" disabled={submitting}>
                                {submitting ? 'Creating...' : 'Create Rule'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="discounts-table">
                    <table>
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
                            {discounts.map(discount => (
                                <tr key={discount._id}>
                                    <td>{discount.name}</td>
                                    <td>{discount.type}</td>
                                    <td>{discount.type === 'PERCENTAGE' ? `${discount.value}%` : `₹${discount.value}`}</td>
                                    <td>{discount.appliesTo}</td>
                                    <td>
                                        <button className="apply-btn" onClick={() => applyDiscount(discount._id)} style={{ marginRight: '10px' }}>
                                            Apply to Products
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(discount._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && <p>Loading discounts...</p>}
                </div>
            </div>
        </AdminLayout>
    );
};

export default DiscountManager;
