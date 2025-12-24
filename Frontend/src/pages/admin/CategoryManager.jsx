import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/ProductManager.css'; // Reusing styles
import API_HOST from '../../config';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            // Public read, but using POST as requested
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

    const handleEdit = (category) => {
        setNewCategory(category.name);
        setParentCategory(category.parentCategory?._id || '');
        setEditMode(true);
        setCurrentId(category._id);
        setSelectedImage(null); // Reset file input
        // Optionally scroll to top
        window.scrollTo(0, 0);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setNewCategory('');
        setParentCategory('');
        setSelectedImage(null);
        setCurrentId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');

            const formData = new FormData();
            formData.append('name', newCategory);
            if (parentCategory) formData.append('parentCategory', parentCategory);
            if (selectedImage) formData.append('image', selectedImage);
            if (editMode && currentId) formData.append('id', currentId);

            const url = editMode ? `${API_HOST}/api/update-category` : `${API_HOST}/api/create-category`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': token
                },
                body: formData
            });

            if (response.ok) {
                setNewCategory('');
                setParentCategory('');
                setSelectedImage(null);
                setEditMode(false);
                setCurrentId(null);
                fetchCategories();
                alert(editMode ? 'Category updated' : 'Category added');
            } else {
                alert('Failed to save category');
            }
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${API_HOST}/api/delete-category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ id })
            });
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    return (
        <AdminLayout>
            <div className="product-manager">
                <h2>Category Manager</h2>
                <div className="product-form-container">
                    <form onSubmit={handleSubmit} className="product-form" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Category Name"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                required
                                style={{ flex: 1 }}
                            />
                            <select
                                value={parentCategory}
                                onChange={(e) => setParentCategory(e.target.value)}
                                style={{ flex: 1 }}
                            >
                                <option value="">No Parent (Top Level)</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => setSelectedImage(e.target.files[0])}
                            style={{ padding: '5px' }}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className="save-btn" style={{ width: 'auto' }}>
                                {editMode ? 'Update Category' : 'Add Category'}
                            </button>
                            {editMode && (
                                <button type="button" onClick={handleCancelEdit} style={{ padding: '10px', background: '#555', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="products-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Parent</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(cat => (
                                <tr key={cat._id}>
                                    <td>
                                        {cat.image ? (
                                            cat.image.match(/\.(mp4|mov|avi|mkv)$/i) ? (
                                                <video src={cat.image} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                            ) : (
                                                <img src={cat.image} alt={cat.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                            )
                                        ) : (
                                            <span style={{ color: '#ccc' }}>No Img</span>
                                        )}
                                    </td>
                                    <td>{cat.name}</td>
                                    <td>{cat.parentCategory?.name || '-'}</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => handleEdit(cat)} style={{ marginRight: '5px', padding: '5px 10px', cursor: 'pointer' }}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDelete(cat._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CategoryManager;
