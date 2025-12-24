import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/ProductManager.css';
import API_HOST from '../../config';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        stockQuantity: '',
        discountPercentage: '0',
        category: '',
        description: '',
        sku: ''
    });
    const [selectedImages, setSelectedImages] = useState([]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');

            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            // Append multiple images
            Array.from(selectedImages).forEach(file => {
                data.append('images', file);
            });

            const response = await fetch(`${API_HOST}/api/create-product`, {
                method: 'POST',
                headers: {
                    'Authorization': token
                },
                body: data
            });

            if (response.ok) {
                alert('Product created successfully!');
                setShowForm(false);
                fetchProducts();
                setFormData({
                    title: '', price: '', stockQuantity: '', discountPercentage: '0',
                    category: '', description: '', sku: ''
                });
                setSelectedImages([]);
            } else {
                const errorData = await response.json();
                alert(`Failed: ${errorData.message}\nDetails: ${errorData.error || 'Check console'}`);
                console.error("Server error:", errorData);
            }
        } catch (error) {
            console.error("Error creating product:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${API_HOST}/api/delete-product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ id })
            });
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <AdminLayout>
            <div className="product-manager">
                <div className="pm-header">
                    <h2>Product Manager</h2>
                    <button className="add-btn" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : '+ Add Product'}
                    </button>
                </div>

                {showForm && (
                    <div className="product-form-container">
                        <form onSubmit={handleSubmit} className="product-form">
                            <div className="form-row">
                                <input placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                <input placeholder="SKU" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                <input type="number" placeholder="Stock" value={formData.stockQuantity} onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })} required />
                            </div>
                            <div className="form-row">
                                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                                <input type="number" placeholder="Discount %" value={formData.discountPercentage} onChange={e => setFormData({ ...formData, discountPercentage: e.target.value })} />
                            </div>
                            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>

                            {/* File Input for Images */}
                            <div className="form-row">
                                <label style={{ color: '#fff' }}>Images:</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,video/*"
                                    onChange={e => setSelectedImages(e.target.files)}
                                />
                            </div>

                            <button type="submit" className="save-btn">Save Product</button>
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
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td><img src={product.images?.[0] || 'placeholder.jpg'} alt="" className="table-img" /></td>
                                    <td>{product.title}</td>
                                    <td>₹{product.price}</td>
                                    <td style={{ color: product.stockQuantity < 5 ? 'red' : 'inherit' }}>{product.stockQuantity}</td>
                                    <td>{product.category?.name || 'Uncategorized'}</td>
                                    <td>
                                        <button className="delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && <p>Loading products...</p>}
                </div>
            </div>
        </AdminLayout>
    );
};

export default ProductManager;
