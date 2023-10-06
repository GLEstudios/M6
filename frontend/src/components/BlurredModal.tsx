import React from 'react';

function BlurredModal({ message, visible }) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-md">
                {message}
            </div>
        </div>
    );
}

export default BlurredModal;
