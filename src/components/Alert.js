// components/Alert.js
import React from 'react';

const Alert = ({ message, type }) => {
    const alertStyles = {
        padding: '10px 20px',
        margin: '10px 0',
        borderRadius: '5px',
        color: '#fff',
        display: message ? 'block' : 'none',
    };

    const typeStyles = {
        success: { backgroundColor: '#28a745' },
        error: { backgroundColor: '#dc3545' },
    };

    return (
        <div style={{ ...alertStyles, ...typeStyles[type] }}>
            {message}
        </div>
    );
};

export default Alert;
