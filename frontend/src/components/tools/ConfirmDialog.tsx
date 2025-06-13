import React, {useEffect, useState} from 'react';
import styles from './ConfirmDialog.module.css';

type ConfirmDialogProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    requireConfirmationInput?: boolean;
    confirmationText?: string;
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
                                                                open,
                                                                onClose,
                                                                onConfirm,
                                                                title,
                                                                message,
                                                                requireConfirmationInput = false,
                                                                confirmationText = 'DELETE',
                                                            }) => {
    const [input, setInput] = useState('');

    useEffect(() => {
        if (!open) setInput('');
    }, [open]);

    if (!open) return null;

    const isConfirmed = !requireConfirmationInput || input.trim() === confirmationText;

    return (
        <div className={styles.backdrop}>
            <div className={styles.dialog}>
                <div className={styles.header}>
                    <h2>{title}</h2>
                </div>
                <div className={styles.body}>
                    <p>{message}</p>
                    {requireConfirmationInput && (
                        <div className={styles.confirmBlock}>
                            <p>
                                Enter <strong>{confirmationText}</strong> to proceede:
                            </p>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                    )}
                </div>
                <div className={styles.footer}>
                    <button onClick={onClose}>Cancel</button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        disabled={!isConfirmed}
                    >
                        Yes, Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};
