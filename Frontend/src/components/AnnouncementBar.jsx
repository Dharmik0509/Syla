
import React, { useEffect, useState } from 'react';
import API_HOST from '../config';
import { FiArrowRight } from 'react-icons/fi';

const AnnouncementBar = ({ onActive }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetchActiveAnnouncements();
    }, []);

    useEffect(() => {
        if (announcements.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
            }, 5000); // Change every 5 seconds
            return () => clearInterval(interval);
        }
    }, [announcements]);

    const fetchActiveAnnouncements = async () => {
        try {
            const response = await fetch(`${API_HOST}/api/fetch-active-announcements`, { method: 'GET' });
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    setAnnouncements(data);
                    if (onActive) onActive(true);
                } else {
                    if (onActive) onActive(false);
                }
            } else {
                if (onActive) onActive(false);
            }
        } catch (error) {
            console.error("Failed to load announcements", error);
            if (onActive) onActive(false);
        }
    };

    if (announcements.length === 0) return null;

    const currentAnnouncement = announcements[currentIndex];

    return (
        <div style={{
            backgroundColor: '#ffffff',
            color: '#136207',
            textAlign: 'center',
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 1100,
            height: '40px', // Fixed height for calculation
            boxSizing: 'border-box',
            transition: 'opacity 0.5s ease-in-out'
        }}>
            <span>{currentAnnouncement.text}</span>
            {currentAnnouncement.link && (
                <a href={currentAnnouncement.link} style={{
                    color: '#136207',
                    textDecoration: 'underline',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    Shop Now <FiArrowRight />
                </a>
            )}
        </div>
    );
};

export default AnnouncementBar;
