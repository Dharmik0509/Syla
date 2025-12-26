import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/ProductManager.css';
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
            <div className="product-manager">
                <div className="pm-header">
                    <h2>Product Manager</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            style={{
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                        <button className="add-btn" onClick={() => showForm ? handleCancel() : setShowForm(true)}>
                            {showForm ? 'Cancel' : '+ Add Product'}
                        </button>
                    </div>
                </div>


                {showForm && (
                    <div className="product-form-container">
                        <form onSubmit={handleSubmit} className="product-form">
                            <div className="form-row">
                                <input placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                <input type="number" min="0" placeholder="Price" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                            </div>
                            <div className="form-row">
                                <input type="number" min="0" placeholder="Stock" value={formData.stockQuantity} onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })} required />
                                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>

                            {/* File Input for Images */}
                            <div className="form-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                <label style={{ color: '#fff', marginBottom: '5px' }}>Images ({selectedImages.length} selected):</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,video/*"
                                    onChange={handleFileChange}
                                    style={{ marginBottom: '10px' }}
                                />

                                {/* Selected Images Preview List */}
                                {selectedImages.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {selectedImages.map((file, index) => (
                                            <div key={index} style={{ position: 'relative', width: '80px', height: '80px' }}>
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt="preview"
                                                    onClick={() => setViewingImage(file)}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', cursor: 'zoom-in' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    style={{
                                                        position: 'absolute', top: '-5px', right: '-5px',
                                                        background: 'red', color: 'white', border: 'none',
                                                        borderRadius: '50%', width: '20px', height: '20px',
                                                        cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-row" style={{ alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    id="isNewArrival"
                                    checked={formData.isNewArrival}
                                    onChange={e => setFormData({ ...formData, isNewArrival: e.target.checked })}
                                    style={{ width: '20px', height: '20px', margin: 0 }}
                                />
                                <label htmlFor="isNewArrival" style={{ margin: 0, fontWeight: 'bold' }}>Mark as New Arrival</label>
                            </div>

                            <button type="submit" className="save-btn" disabled={submitting}>
                                {submitting ? 'Saving...' : (editMode ? 'Update Product' : 'Save Product')}
                            </button>
                        </form>
                    </div>
                )}

                <div className="products-table">
                    <table>
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
                            {products.filter(p => !filterCategory || p.category?._id === filterCategory).map(product => (
                                <tr key={product._id}>
                                    <td><img src={product.images?.[0] || 'placeholder.jpg'} alt="" className="table-img" /></td>
                                    <td>{product.title}</td>
                                    <td>₹{product.price}</td>
                                    <td style={{ color: product.stockQuantity < 5 ? 'red' : 'inherit' }}>{product.stockQuantity}</td>
                                    <td>{product.category?.name || 'Uncategorized'}</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => handleEdit(product)} style={{ marginRight: '5px' }}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDelete(product._id)} disabled={submitting}>
                                            {submitting ? '...' : 'Delete'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && <p>Loading products...</p>}
                </div>

                {/* Image Preview Modal */}
                {viewingImage && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000
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
                                    style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '8px', boxShadow: '0 5px 30px rgba(0,0,0,0.5)' }}
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
