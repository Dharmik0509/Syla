
import React from 'react';
import '../../styles/ConfirmModal.css';
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmModal = ({ isOpen, message, title = "Confirm Action", onConfirm, onCancel, type = "danger" }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="confirm-modal">
                <span className="modal-icon"><FiAlertTriangle /></span>
                <h3 className="modal-title">{title}</h3>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onCancel}>Cancel</button>
                    <button className={`btn-confirm ${type === 'primary' ? 'primary' : ''}`} onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
