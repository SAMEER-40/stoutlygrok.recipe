import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'error' ? '#ef4444' : type === 'info' ? '#3b82f6' : '#22c55e';

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: bgColor,
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: 1000,
            animation: 'slideIn 0.3s ease'
        }}>
            {message}
        </div>
    );
};

export default Toast;
