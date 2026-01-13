
import React, { useEffect, useState } from 'react';
import API_HOST from '../config';
import { FiArrowRight } from 'react-icons/fi';
import '../styles/AnnouncementBar.css';

const AnnouncementBar = ({ onActive }) => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        fetchActiveAnnouncements();
    }, []);

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

    return (
        <div className="announcement-bar">
            <div className="marquee-container">
                {announcements.map((announcement, index) => (
                    <span key={index} className="announcement-item">
                        {announcement.text}
                        {announcement.link && (
                            <a href={announcement.link} className="announcement-link">
                                Shop Now <FiArrowRight />
                            </a>
                        )}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default AnnouncementBar;

