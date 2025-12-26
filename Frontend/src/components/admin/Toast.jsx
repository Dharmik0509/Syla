
import React, { useEffect, useState } from 'react';
import '../../styles/Toast.css';
import { FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    useEffect(() => {
        if (isExiting) {
            const timer = setTimeout(() => {
                onClose();
            }, 300); // Match CSS animation duration
            return () => clearTimeout(timer);
        }
    }, [isExiting, onClose]);

    const getIcon = () => {
        if (type === 'success') return <FiCheckCircle />;
        if (type === 'error') return <FiAlertCircle />;
        return <FiInfo />;
    };

    return (
        <div className={`toast ${type} ${isExiting ? 'exiting' : ''}`}>
            <span className="toast-icon">{getIcon()}</span>
            <span className="toast-message">{message}</span>
        </div>
    );
};

export default Toast;
