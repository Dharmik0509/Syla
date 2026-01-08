import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/AdminCommon.css'; // Updated to shared styles
import API_HOST from '../../config';
import { useAdminUI } from '../../context/AdminUIContext';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const { showToast, confirmAction } = useAdminUI();

    const [currentId, setCurrentId] = useState(null);
    const [filterCategory, setFilterCategory] = useState('');
    const [viewingImage, setViewingImage] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        stockQuantity: '',
        discountPercentage: '0',
        category: '',
        description: '',
        isNewArrival: false
    });
    const [selectedImages, setSelectedImages] = useState([]); // Stores Array of Files

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        // Append new files to existing ones
        setSelectedImages(prev => [...prev, ...files]);
    };

    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_HOST}/api/get-products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_HOST}/api/get-categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }); // Public read
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            title: product.title,
            price: product.price,
            stockQuantity: product.stockQuantity,
            discountPercentage: product.discountPercentage,
            category: product.category?._id || '',
            description: product.description,
            isNewArrival: product.isNewArrival || false
        });
        setCurrentId(product._id);
        setEditMode(true);
        setShowForm(true);
        setSelectedImages([]); // Reset new files
        window.scrollTo(0, 0);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditMode(false);
        setCurrentId(null);
        setFormData({
            title: '', price: '', stockQuantity: '', discountPercentage: '0',
            category: '', description: '', isNewArrival: false
        });
        setSelectedImages([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Validation for negative values
        if (Number(formData.price) < 0 || Number(formData.stockQuantity) < 0) {
            showToast("Price and Stock cannot be negative!", "error");
            setSubmitting(false);
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');

            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            // Append multiple images
            selectedImages.forEach(file => {
                data.append('images', file);
            });

            if (editMode && currentId) {
                data.append('id', currentId);
            }

            const url = editMode ? `${API_HOST}/api/update-product` : `${API_HOST}/api/create-product`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': token
                },
                body: data
            });

            if (response.ok) {
                showToast(editMode ? 'Product updated successfully!' : 'Product created successfully!', 'success');
                handleCancel();
                fetchProducts();
            } else {
                const errorData = await response.json();
                showToast(`Failed: ${errorData.message}`, 'error');
                console.error("Server error:", errorData);
            }
        } catch (error) {
            console.error("Error creating product:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (id) => {
        confirmAction("Are you sure you want to delete this product?", async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${API_HOST}/api/delete-product`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify({ id })
                });

                if (response.ok) {
                    showToast('Product deleted successfully', 'success');
                    fetchProducts();
                } else {
                    showToast('Failed to delete product', 'error');
                }
            } catch (error) {
                console.error("Error deleting product:", error);
                showToast('Error deleting product', 'error');
            }
        });
    };

    return (
        <AdminLayout>
            <div className="admin-container">
                <div className="admin-page-header">
                    <div>
                        <h2 className="admin-title">Product Manager</h2>
                        <p className="admin-subtitle">Manage your inventory and store listings</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="admin-select"
                            style={{ width: '200px' }}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                        <button
                            className={`admin-btn ${showForm ? 'admin-btn-secondary' : 'admin-btn-primary'}`}
                            onClick={() => showForm ? handleCancel() : setShowForm(true)}
                        >
                            {showForm ? 'Cancel' : '+ Add Product'}
                        </button>
                    </div>
                </div>


                {showForm && (
                    <div className="admin-card">
                        <h3 style={{ marginBottom: '20px', color: '#1A4D33' }}>
                            {editMode ? 'Edit Product' : 'Add New Product'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-row">
                                <div className="admin-col">
                                    <label className="admin-label">Product Title</label>
                                    <input
                                        className="admin-input"
                                        placeholder="e.g. Silk Scarf"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="admin-col">
                                    <label className="admin-label">Price (₹)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="admin-input"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="admin-row">
                                <div className="admin-col">
                                    <label className="admin-label">Stock Quantity</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="admin-input"
                                        value={formData.stockQuantity}
                                        onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="admin-col">
                                    <label className="admin-label">Category</label>
                                    <select
                                        className="admin-select"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-label">Description</label>
                                <textarea
                                    className="admin-textarea"
                                    rows="4"
                                    placeholder="Enter product description..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            {/* File Input for Images */}
                            <div className="admin-form-group">
                                <label className="admin-label">Product Images ({selectedImages.length} selected)</label>
                                <div style={{ border: '2px dashed #eaeaea', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,video/*"
                                        onChange={handleFileChange}
                                        style={{ marginBottom: '10px' }}
                                    />

                                    {/* Selected Images Preview List */}
                                    {selectedImages.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px', justifyContent: 'center' }}>
                                            {selectedImages.map((file, index) => (
                                                <div key={index} style={{ position: 'relative', width: '80px', height: '80px' }}>
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt="preview"
                                                        onClick={() => setViewingImage(file)}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', cursor: 'zoom-in', border: '1px solid #ddd' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        style={{
                                                            position: 'absolute', top: '-8px', right: '-8px',
                                                            background: '#ef4444', color: 'white', border: 'none',
                                                            borderRadius: '50%', width: '22px', height: '22px',
                                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    id="isNewArrival"
                                    checked={formData.isNewArrival}
                                    onChange={e => setFormData({ ...formData, isNewArrival: e.target.checked })}
                                    style={{ width: '20px', height: '20px', accentColor: '#1A4D33' }}
                                />
                                <label htmlFor="isNewArrival" style={{ margin: 0, fontWeight: '500', cursor: 'pointer' }}>Mark as New Arrival</label>
                            </div>

                            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                                <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : (editMode ? 'Update Product' : 'Save Product')}
                                </button>
                                {editMode && (
                                    <button type="button" onClick={handleCancel} className="admin-btn admin-btn-secondary">
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="admin-table-container" style={{ border: 'none', borderRadius: 0 }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                                            {loading ? 'Loading products...' : 'No products found. Add one above!'}
                                        </td>
                                    </tr>
                                ) : (
                                    products.filter(p => !filterCategory || p.category?._id === filterCategory).map(product => (
                                        <tr key={product._id}>
                                            <td><img src={product.images?.[0] || 'placeholder.jpg'} alt="" className="table-img" /></td>
                                            <td style={{ fontWeight: '500' }}>{product.title}</td>
                                            <td>₹{product.price}</td>
                                            <td>
                                                <span className={`status-badge ${product.stockQuantity < 5 ? 'status-danger' : 'status-success'}`}>
                                                    {product.stockQuantity} {product.stockQuantity < 5 ? 'Low' : 'In Stock'}
                                                </span>
                                            </td>
                                            <td>{product.category?.name || 'Uncategorized'}</td>
                                            <td>
                                                <button className="admin-btn admin-btn-secondary" onClick={() => handleEdit(product)} style={{ marginRight: '5px', padding: '6px 12px', fontSize: '0.8rem' }}>Edit</button>
                                                <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(product._id)} disabled={submitting} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
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

                {/* Image Preview Modal */}
                {viewingImage && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000, backdropFilter: 'blur(5px)'
                    }} onClick={() => setViewingImage(null)}>
                        <div style={{
                            position: 'relative',
                            maxWidth: '90%',
                            maxHeight: '90%'
                        }} onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setViewingImage(null)}
                                style={{
                                    position: 'absolute', top: '-40px', right: 0,
                                    background: 'transparent', border: 'none', color: 'white',
                                    fontSize: '2rem', cursor: 'pointer'
                                }}
                            >
                                &times;
                            </button>

                            {viewingImage.type.startsWith('video/') ? (
                                <video
                                    src={URL.createObjectURL(viewingImage)}
                                    controls
                                    autoPlay
                                    style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '8px' }}
                                />
                            ) : (
                                <img
                                    src={URL.createObjectURL(viewingImage)}
                                    alt="Full Preview"
                                    style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout >
    );
};
export default ProductManager;
