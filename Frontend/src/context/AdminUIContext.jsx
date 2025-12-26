
import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/admin/Toast';
import ConfirmModal from '../components/admin/ConfirmModal';

const AdminUIContext = createContext();

export const useAdminUI = () => useContext(AdminUIContext);

export const AdminUIProvider = ({ children }) => {
    // Toast State
    const [toasts, setToasts] = useState([]);

    // Modal State
    const [modal, setModal] = useState({
        isOpen: false,
        message: '',
        title: '',
        onConfirm: () => { },
        type: 'danger'
    });

    // Toast Actions
    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // Modal Actions
    const confirmAction = useCallback((message, onConfirm, title = "Are you sure?", type = 'danger') => {
        setModal({
            isOpen: true,
            message,
            title,
            onConfirm: () => {
                onConfirm();
                closeModal();
            },
            type
        });
    }, []);

    const closeModal = useCallback(() => {
        setModal(prev => ({ ...prev, isOpen: false }));
    }, []);

    return (
        <AdminUIContext.Provider value={{ showToast, confirmAction }}>
            {children}

            {/* Render Toasts */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>

            {/* Render Modal */}
            <ConfirmModal
                isOpen={modal.isOpen}
                message={modal.message}
                title={modal.title}
                onConfirm={modal.onConfirm}
                onCancel={closeModal}
                type={modal.type}
            />
        </AdminUIContext.Provider>
    );
};
