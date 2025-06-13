import React, {useEffect} from "react";
import style from "./MessageOverlay.module.css";

interface MessageOverlayProps {
    message: string;
    type?: 'info' | 'success' | 'error';
    onClose: () => void;
    duration?: number; // in ms
}

export const MessageOverlay: React.FC<MessageOverlayProps> = ({
                                                                  message,
                                                                  type = 'info',
                                                                  onClose,
                                                                  duration = 3000,
                                                              }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div className={`${style.overlay} ${style[type]}`}>
            <span>{message}</span>
            <button className={style.closeButton} onClick={onClose}>×</button>
        </div>
    );
};
