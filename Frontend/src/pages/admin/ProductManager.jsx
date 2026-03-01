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
        title: '', price: '', stockQuantity: '', discountPercentage: '0',
        category: '', description: '', isNewArrival: false
    });
    const [selectedImages, setSelectedImages] = useState([]);

    // Local Storage Effect for single product addition
    useEffect(() => {
        if (showForm && !editMode) {
            const savedDraft = localStorage.getItem('productFormDraft');
            if (savedDraft) {
                try {
                    setFormData(JSON.parse(savedDraft));
                } catch (e) {
                    console.error('Failed to parse saved product draft:', e);
                }
            }
        }
    }, [showForm, editMode]);

    useEffect(() => {
        if (showForm && !editMode) {
            localStorage.setItem('productFormDraft', JSON.stringify(formData));
        }
    }, [formData, showForm, editMode]);

    // --- BULK OPERATIONS STATE ---
    const [selectedIds, setSelectedIds] = useState([]);
    const [showBulkAdd, setShowBulkAdd] = useState(false);

    // Batch Mode State (List of 10 slots)
    const [batchItems, setBatchItems] = useState([]);
    const [bulkFormData, setBulkFormData] = useState({
        category: '', price: '', stockQuantity: '',
        description: '', isNewArrival: false, titlePrefix: ''
    });

    // Initialize Batch Items when Bulk Mode opens
    useEffect(() => {
        if (showBulkAdd) {
            const savedBulk = localStorage.getItem('productBulkDraft');
            const savedBatch = localStorage.getItem('productBatchDraft');

            if (savedBulk) {
                try {
                    setBulkFormData(JSON.parse(savedBulk));
                } catch (e) {
                    console.error('Failed to parse saved bulk draft:', e);
                }
            }

            if (savedBatch) {
                try {
                    const parsedBatchItems = JSON.parse(savedBatch);
                    // Ensure the images array is reset to empty because File objects cannot be persisted
                    const restoredBatch = parsedBatchItems.map(item => ({ ...item, images: [] }));
                    setBatchItems(restoredBatch);
                } catch (e) {
                    console.error('Failed to parse saved batch draft:', e);
                    setBatchItems(Array(10).fill(null).map(() => ({
                        title: '', price: '', stockQuantity: '1', category: '', description: '', images: [], isNewArrival: false
                    })));
                }
            } else {
                setBatchItems(Array(10).fill(null).map(() => ({
                    title: '', price: '', stockQuantity: '1', category: '', description: '', images: [], isNewArrival: false
                })));
            }
        }
    }, [showBulkAdd]);

    // Save Bulk state to local storage
    useEffect(() => {
        if (showBulkAdd) {
            // Strip out File objects (images) from batchItems before saving to prevent stringify errors
            const batchItemsToSave = batchItems.map(item => {
                const { images, ...itemWithoutImages } = item;
                return itemWithoutImages;
            });
            localStorage.setItem('productBulkDraft', JSON.stringify(bulkFormData));
            localStorage.setItem('productBatchDraft', JSON.stringify(batchItemsToSave));
        }
    }, [bulkFormData, batchItems, showBulkAdd]);

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
            });
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // --- BULK HANDLERS ---
    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            const visibleProducts = products.filter(p => !filterCategory || p.category?._id === filterCategory);
            setSelectedIds(visibleProducts.map(p => p._id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelectOne = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        confirmAction(`Are you sure you want to delete ${selectedIds.length} products?`, async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${API_HOST}/api/bulk-delete-products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': token },
                    body: JSON.stringify({ ids: selectedIds })
                });

                if (response.ok) {
                    showToast(`Successfully deleted ${selectedIds.length} products`, 'success');
                    setSelectedIds([]);
                    fetchProducts();
                } else {
                    showToast('Bulk delete failed', 'error');
                }
            } catch (error) {
                console.error(error);
                showToast('Error performing bulk delete', 'error');
            }
        });
    };

    const handleBatchChange = (index, field, value) => {
        const newItems = [...batchItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setBatchItems(newItems);
    };

    const handleBatchImageChange = (index, e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            showToast("Maximum 5 images allowed per product", "error");
            handleBatchChange(index, 'images', files.slice(0, 5));
        } else {
            handleBatchChange(index, 'images', files);
        }
    };

    const handleBatchSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        if (!bulkFormData.category) {
            showToast("Please select a Category for the batch", "error");
            setSubmitting(false);
            return;
        }

        const validItems = batchItems.filter(item => item.title && item.price);

        if (validItems.length === 0) {
            showToast("Please fill in at least one product row (Title & Price)", "error");
            setSubmitting(false);
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const data = new FormData();

            // Cloudinary Organization Logic
            const selectedCat = categories.find(c => c._id === bulkFormData.category);
            const catName = selectedCat ? selectedCat.name.replace(/\s+/g, '_') : 'General';
            data.append('uploadFolder', `products/${catName}`);

            let fileCounter = 0;
            const finalProducts = validItems.map(item => {
                let itemIndices = [];
                if (item.images && item.images.length > 0) {
                    item.images.forEach((file, imgIdx) => {
                        // Rename File: Category_ProductTitle_Idx
                        const cleanTitle = item.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                        const extension = file.name.split('.').pop();
                        const newName = `${catName}_${cleanTitle}_${imgIdx}.${extension}`;
                        const renamedFile = new File([file], newName, { type: file.type });

                        data.append('images', renamedFile);
                        itemIndices.push(fileCounter);
                        fileCounter++;
                    });
                }
                return {
                    title: item.title,
                    price: item.price,
                    stockQuantity: item.stockQuantity,
                    category: bulkFormData.category,
                    description: item.description,
                    isNewArrival: item.isNewArrival,
                    imageIndices: itemIndices
                };
            });

            data.append('products', JSON.stringify(finalProducts));

            const response = await fetch(`${API_HOST}/api/bulk-create-products`, {
                method: 'POST',
                headers: { 'Authorization': token },
                body: data
            });

            if (response.ok) {
                const resData = await response.json();
                if (resData.warning) {
                    showToast(resData.warning, 'error'); // Show as error for visibility
                } else {
                    showToast(resData.message, 'success');
                }
                setShowBulkAdd(false);
                // Clear local storage after successful submission
                localStorage.removeItem('productBulkDraft');
                localStorage.removeItem('productBatchDraft');
                setBulkFormData({
                    category: '', price: '', stockQuantity: '',
                    description: '', isNewArrival: false, titlePrefix: ''
                });

                fetchProducts();
            } else {
                const err = await response.json();
                showToast(err.message || 'Batch create failed', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Error creating products', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // --- STANDARD HANDLERS ---
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(prev => [...prev, ...files]);
    };

    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
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
        setShowBulkAdd(false);
        setSelectedImages([]);
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
        localStorage.removeItem('productFormDraft');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        if (Number(formData.price) < 0 || Number(formData.stockQuantity) < 0) {
            showToast("Price and Stock cannot be negative!", "error");
            setSubmitting(false);
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));

            // Cloudinary Organization Logic (Single)
            const selectedCat = categories.find(c => c._id === formData.category);
            const catName = selectedCat ? selectedCat.name.replace(/\s+/g, '_') : 'General';
            data.append('uploadFolder', `products/${catName}`);

            selectedImages.forEach((file, index) => {
                const cleanTitle = formData.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                const extension = file.name.split('.').pop();
                const newName = `${catName}_${cleanTitle}_${index}.${extension}`;
                const renamedFile = new File([file], newName, { type: file.type });
                data.append('images', renamedFile);
            });

            if (editMode && currentId) data.append('id', currentId);

            const url = editMode ? `${API_HOST}/api/update-product` : `${API_HOST}/api/create-product`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Authorization': token },
                body: data
            });

            if (response.ok) {
                showToast(editMode ? 'Product updated successfully!' : 'Product created successfully!', 'success');
                handleCancel(); // this already clears localStorage
                fetchProducts();
            } else {
                const errorData = await response.json();
                showToast(`Failed: ${errorData.message}`, 'error');
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
                    headers: { 'Content-Type': 'application/json', 'Authorization': token },
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

    const visibleProducts = products.filter(p => !filterCategory || p.category?._id === filterCategory);
    const allSelected = visibleProducts.length > 0 && selectedIds.length === visibleProducts.length;

    return (
        <AdminLayout>
            <div className="admin-container">
                <div className="admin-page-header">
                    <div>
                        <h2 className="admin-title">Product Manager</h2>
                        <p className="admin-subtitle">Manage your inventory and store listings</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        {selectedIds.length > 0 && (
                            <button className="admin-btn admin-btn-danger" onClick={handleBulkDelete}>
                                Delete ({selectedIds.length})
                            </button>
                        )}
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
                            className={`admin-btn ${showBulkAdd ? 'admin-btn-secondary' : 'admin-btn-primary'}`}
                            onClick={() => {
                                setShowBulkAdd(!showBulkAdd);
                                setShowForm(false);
                            }}
                        >
                            {showBulkAdd ? 'Cancel Bulk' : '+ Bulk Add'}
                        </button>
                        <button
                            className={`admin-btn ${showForm ? 'admin-btn-secondary' : 'admin-btn-primary'}`}
                            onClick={() => {
                                setShowForm(!showForm);
                                setShowBulkAdd(false); // Close bulk if open
                                if (showForm) handleCancel();
                            }}
                        >
                            {showForm ? 'Cancel' : '+ Add Single'}
                        </button>
                    </div>
                </div>

                {/* BATCH ADD GRID */}
                {showBulkAdd && (
                    <div className="admin-card" style={{ border: '1px solid #c5a059', maxWidth: '100%', overflowX: 'auto' }}>
                        <h3 style={{ marginBottom: '15px', color: '#c5a059' }}>Batch Add Products (10 Slots)</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                            Fill in the details for up to 10 products at once. Empty rows will be ignored.
                        </p>

                        <form onSubmit={handleBatchSubmit}>
                            <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px', border: '1px solid #ddd' }}>
                                <label className="admin-label" style={{ marginBottom: '8px', display: 'block' }}>Select Category for this Batch</label>
                                <select
                                    className="admin-select"
                                    value={bulkFormData.category}
                                    onChange={e => setBulkFormData(prev => ({ ...prev, category: e.target.value }))}
                                    required
                                    style={{ maxWidth: '300px' }}
                                >
                                    <option value="">-- Select Category --</option>
                                    {categories.map(cat => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                                </select>
                            </div>

                            <table className="admin-table" style={{ minWidth: '900px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '60px' }}>#</th>
                                        <th style={{ width: '100px' }}>Image</th>
                                        <th>Title *</th>
                                        <th style={{ width: '120px' }}>Price *</th>
                                        <th style={{ width: '100px' }}>Stock</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {batchItems.map((item, index) => (
                                        <tr key={index}>
                                            <td style={{ fontWeight: 'bold', color: '#ccc' }}>{index + 1}</td>
                                            <td>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={e => handleBatchImageChange(index, e)}
                                                    style={{ maxWidth: '180px' }}
                                                />
                                                {item.images && item.images.length > 0 && (
                                                    <div style={{ marginTop: '5px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                        {item.images.map((file, i) => (
                                                            <img
                                                                key={i}
                                                                src={URL.createObjectURL(file)}
                                                                alt="preview"
                                                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <input
                                                    className="admin-input"
                                                    placeholder="Product Title"
                                                    value={item.title}
                                                    onChange={e => handleBatchChange(index, 'title', e.target.value)}
                                                    style={{ padding: '8px' }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number" className="admin-input"
                                                    placeholder="0"
                                                    value={item.price}
                                                    onChange={e => handleBatchChange(index, 'price', e.target.value)}
                                                    style={{ padding: '8px' }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number" className="admin-input"
                                                    value={item.stockQuantity}
                                                    onChange={e => handleBatchChange(index, 'stockQuantity', e.target.value)}
                                                    style={{ padding: '8px' }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    className="admin-input"
                                                    placeholder="Desc..."
                                                    value={item.description}
                                                    onChange={e => handleBatchChange(index, 'description', e.target.value)}
                                                    style={{ padding: '8px' }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                                    {submitting ? 'Creating Products...' : 'Save All Valid Products'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}


                {showForm && (
                    <div className="admin-card">
                        <h3 style={{ marginBottom: '20px', color: '#1A4D33' }}>
                            {editMode ? 'Edit Product' : 'Add Single Product'}
                        </h3>
                        {/* Standard Form (Reused Logic) */}
                        <form onSubmit={handleSubmit}>
                            {/* ... Standard Form Fields same as before ... */}
                            <div className="admin-row">
                                <div className="admin-col">
                                    <label className="admin-label">Product Title</label>
                                    <input className="admin-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                </div>
                                <div className="admin-col">
                                    <label className="admin-label">Price</label>
                                    <input type="number" className="admin-input" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                </div>
                            </div>
                            <div className="admin-row">
                                <div className="admin-col">
                                    <label className="admin-label">Stock</label>
                                    <input type="number" className="admin-input" value={formData.stockQuantity} onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })} required />
                                </div>
                                <div className="admin-col">
                                    <label className="admin-label">Category</label>
                                    <select className="admin-select" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                                    </select>
                                </div>
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-label">Description</label>
                                <textarea className="admin-textarea" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-label">Images</label>
                                <input type="file" multiple accept="image/*" onChange={handleFileChange} />
                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '5px' }}>
                                    {selectedImages.map((f, i) => <div key={i}><img src={URL.createObjectURL(f)} style={{ width: 50, height: 50, objectFit: 'cover' }} alt="" /><span onClick={() => removeImage(i)} style={{ cursor: 'pointer', color: 'red' }}>x</span></div>)}
                                </div>
                            </div>
                            <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>{submitting ? 'Saving' : 'Save Product'}</button>
                        </form>
                    </div>
                )}

                <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="admin-table-container" style={{ border: 'none', borderRadius: 0 }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '40px', paddingLeft: '15px' }}>
                                        <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                                    </th>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleProducts.length === 0 ? (
                                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>No products found.</td></tr>
                                ) : (
                                    visibleProducts.map(product => (
                                        <tr key={product._id} style={{ backgroundColor: selectedIds.includes(product._id) ? '#f9f9f9' : 'transparent' }}>
                                            <td style={{ paddingLeft: '15px' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(product._id)}
                                                    onChange={() => toggleSelectOne(product._id)}
                                                />
                                            </td>
                                            <td><img src={product.images?.[0] || 'placeholder.jpg'} alt="" className="table-img" /></td>
                                            <td style={{ fontWeight: '500' }}>{product.title}</td>
                                            <td>₹{product.price}</td>
                                            <td>{product.stockQuantity}</td>
                                            <td>{product.category?.name || 'Uncategorized'}</td>
                                            <td>
                                                <button className="admin-btn admin-btn-secondary" onClick={() => handleEdit(product)} style={{ marginRight: '5px', padding: '6px 12px', fontSize: '0.8rem' }}>Edit</button>
                                                <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(product._id)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {viewingImage && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setViewingImage(null)}>
                        <img src={URL.createObjectURL(viewingImage)} alt="" style={{ maxWidth: '90%', maxHeight: '90%' }} />
                    </div>
                )}
            </div>
        </AdminLayout >
    );
};
export default ProductManager;
