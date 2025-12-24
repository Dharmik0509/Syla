import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/ProductManager.css'; // Reuse styles for now
import API_HOST from '../../config';

const HeroManager = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        link: '',
        order: 0
    });
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const response = await fetch(`${API_HOST}/api/get-hero-slides`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            setSlides(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching slides:", error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');

            const data = new FormData();
            data.append('title', formData.title);
            data.append('subtitle', formData.subtitle);
            data.append('link', formData.link);
            data.append('order', formData.order);
            if (selectedImage) {
                data.append('image', selectedImage);
            }

            const response = await fetch(`${API_HOST}/api/create-hero-slide`, {
                method: 'POST',
                headers: {
                    'Authorization': token
                },
                body: data
            });

            if (response.ok) {
                alert('Slide added successfully!');
                fetchSlides();
                setFormData({ title: '', subtitle: '', link: '', order: 0 });
                setSelectedImage(null);
            } else {
                alert('Failed to add slide');
            }
        } catch (error) {
            console.error("Error adding slide:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this slide?")) return;
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${API_HOST}/api/delete-hero-slide`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ id })
            });
            fetchSlides();
        } catch (error) {
            console.error("Error deleting slide:", error);
        }
    };

    return (
        <AdminLayout>
            <div className="product-manager">
                <div className="pm-header">
                    <h2>Hero Slider Manager</h2>
                </div>

                <div className="product-form-container">
                    <h3>Add New Slide</h3>
                    <form onSubmit={handleSubmit} className="product-form">
                        <div className="form-row">
                            {/* File Input for Hero Image */}
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={e => setSelectedImage(e.target.files[0])}
                                required
                            />
                            <input type="number" placeholder="Order" value={formData.order} onChange={e => setFormData({ ...formData, order: e.target.value })} />
                        </div>
                        <div className="form-row">
                            <input placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            <input placeholder="Subtitle" value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} />
                        </div>
                        <input placeholder="Link (Optional)" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} />
                        <button type="submit" className="save-btn">Add Slide</button>
                    </form>
                </div>

                <div className="products-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Order</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {slides.map(slide => (
                                <tr key={slide._id}>
                                    <td><img src={slide.image} alt="" className="table-img" style={{ width: '100px', height: 'auto' }} /></td>
                                    <td>
                                        <strong>{slide.title}</strong><br />
                                        <small>{slide.subtitle}</small>
                                    </td>
                                    <td>{slide.order}</td>
                                    <td>
                                        <button className="delete-btn" onClick={() => handleDelete(slide._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && <p>Loading slides...</p>}
                </div>
            </div>
        </AdminLayout>
    );
};

export default HeroManager;
