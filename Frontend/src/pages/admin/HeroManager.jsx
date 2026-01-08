import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/HeroManager.css'; // New dedicated styles
import API_HOST from '../../config';
import { useAdminUI } from '../../context/AdminUIContext';

const HeroManager = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { showToast, confirmAction } = useAdminUI();

    // Slot Management
    const [selectedSlot, setSelectedSlot] = useState(1);
    const [currentSlideId, setCurrentSlideId] = useState(null); // ID if slot is occupied

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        link: '',
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // For showing current image

    useEffect(() => {
        fetchSlides();
    }, []);

    // When slot or slides change, update form
    useEffect(() => {
        const slideInSlot = slides.find(s => s.order === Number(selectedSlot));
        if (slideInSlot) {
            setFormData({
                title: slideInSlot.title || '',
                subtitle: slideInSlot.subtitle || '',
                link: slideInSlot.link || '',
            });
            setCurrentSlideId(slideInSlot._id);
            setPreviewImage(slideInSlot.image);
        } else {
            // Reset for new slide
            setFormData({
                title: '',
                subtitle: '',
                link: '',
            });
            setCurrentSlideId(null);
            setPreviewImage(null);
        }
    }, [selectedSlot, slides]);

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

        if (!selectedImage && !currentSlideId) {
            showToast("Please select an image for the new slide!", "error");
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('adminToken');
            const data = new FormData();

            data.append('title', formData.title);
            data.append('subtitle', formData.subtitle);
            data.append('link', formData.link);
            data.append('order', selectedSlot); // Always use selected slot

            if (selectedImage) {
                data.append('image', selectedImage);
            }

            let url = `${API_HOST}/api/create-hero-slide`;

            // If updating existing slide
            if (currentSlideId) {
                url = `${API_HOST}/api/update-hero-slide`;
                data.append('id', currentSlideId);
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': token
                },
                body: data
            });

            if (response.ok) {
                showToast(currentSlideId ? 'Slide updated successfully!' : 'Slide added successfully!', 'success');
                fetchSlides();
                setSelectedImage(null);
            } else {
                showToast('Failed to save slide', 'error');
            }
        } catch (error) {
            console.error("Error saving slide:", error);
            showToast('Error saving slide', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = () => {
        if (!currentSlideId) return;

        confirmAction(`Delete slide in Slot ${selectedSlot}?`, async () => {
            setSubmitting(true);
            try {
                const token = localStorage.getItem('adminToken');
                await fetch(`${API_HOST}/api/delete-hero-slide`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify({ id: currentSlideId })
                });
                showToast('Slide deleted successfully', 'success');
                fetchSlides();
                setSelectedImage(null);
            } catch (error) {
                console.error("Error deleting slide:", error);
                showToast('Error deleting slide', 'error');
            } finally {
                setSubmitting(false);
            }
        });
    };

    // Helper to handle file selection preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            // Create local preview URL
            const objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);
        }
    };

    return (
        <AdminLayout>
            <div className="hero-manager">
                <div className="hm-header">
                    <h2>Hero Slider Manager</h2>
                    <p>Manage the 5 main slides on your homepage. Select a slot to edit.</p>
                </div>

                {/* Slot Selector Grid */}
                <div className="slots-grid">
                    {[1, 2, 3, 4, 5].map(num => {
                        const slide = slides.find(s => s.order === num);
                        return (
                            <div
                                key={num}
                                className={`slot-card ${selectedSlot === num ? 'active' : ''} ${slide ? 'occupied' : 'empty'}`}
                                onClick={() => setSelectedSlot(num)}
                            >
                                <span className="slot-number">Slot {num}</span>
                                <div className="slot-preview">
                                    {slide ? (
                                        <img src={slide.image} alt={`Slot ${num}`} />
                                    ) : (
                                        <span>Empty</span>
                                    )}
                                </div>
                                <span className="slot-status">{slide ? 'Active' : 'Available'}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Main Editor Area */}
                <div className="hero-editor">
                    <div className="editor-header">
                        <h3>{currentSlideId ? `Editing Slot ${selectedSlot}` : `Adding to Slot ${selectedSlot}`}</h3>
                        {currentSlideId && <span style={{ fontSize: '0.9rem', color: 'green' }}>• Currently Live</span>}
                    </div>

                    <div className="editor-content">
                        {/* Left: Form */}
                        <form onSubmit={handleSubmit} className="editor-form">
                            <div className="form-group">
                                <label>Slide Image (Required)</label>
                                <div className="file-upload-wrapper">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required={!currentSlideId}
                                    />
                                    <p>
                                        {selectedImage ? `Selected: ${selectedImage.name}` : "Click to upload image"}
                                    </p>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    className="form-input"
                                    placeholder="e.g. New Collection"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Subtitle</label>
                                <input
                                    className="form-input"
                                    placeholder="e.g. Discover the beauty needed"
                                    value={formData.subtitle}
                                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                                />
                            </div>


                            <div className="form-actions">
                                <button type="submit" className="btn-save" disabled={submitting}>
                                    {submitting ? 'Saving...' : (currentSlideId ? 'Update Slide' : 'Publish Slide')}
                                </button>

                                {currentSlideId && (
                                    <button
                                        type="button"
                                        className="btn-delete"
                                        onClick={handleDelete}
                                        disabled={submitting}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Right: Live Preview */}
                        <div className="live-preview">
                            <label style={{ marginBottom: '10px', color: '#666' }}>Preview</label>
                            {previewImage ? (
                                <div className="preview-box">
                                    <img src={previewImage} alt="Preview" />
                                    <div className="preview-overlay">
                                        <div className="preview-title">{formData.title || "Your Title Here"}</div>
                                        <div className="preview-subtitle">{formData.subtitle || "Subtitle goes here"}</div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ color: '#ccc' }}>No image selected</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};
export default HeroManager;
