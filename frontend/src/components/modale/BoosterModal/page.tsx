import React, { useEffect, useState } from "react";
import "./styles.css"

type PopupProps = {
    title: string;
    isOpen: boolean;
    onClose: () => void;
};

const Popup: React.FC<PopupProps> = ({ title, isOpen, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
        } else {
            setTimeout(() => setVisible(false), 300); // animation duration
        }
    }, [isOpen]);


    if (!visible) return null;

    return (
        <div className={`popup-overlay ${isOpen ? "fade-in" : "fade-out"}`}>
            <div className={`popup-content ${isOpen ? "zoom-in" : "zoom-out"}`}>
                 <div>{title}</div>
                
            </div>
        </div>
    );
};

export default Popup;
