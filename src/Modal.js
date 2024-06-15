import React from 'react';

const Modal = ({ title, children, isOpen, onClose }) => {
    if (!isOpen) return null;
    console.log("Modal opened");

    return (
        <div id="locationModal" className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>{title}</h2>
                <p>{children}</p>
            </div>
        </div>
    );
};

export default Modal;