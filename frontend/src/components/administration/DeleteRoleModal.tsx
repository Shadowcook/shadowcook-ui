import {useState} from "react";
import styles from "./DeleteRoleModal.module.css";
import {Role} from "@project-types/role/role.ts";

interface DeleteRoleModalProps {
    role: Role;
    onCancel: () => void;
    onConfirm: () => void;
}

export function DeleteRoleModal({role, onCancel, onConfirm}: DeleteRoleModalProps) {
    const [confirmationText, setConfirmationText] = useState("");

    const isConfirmed = confirmationText === "DELETE";

    return (
        <div className={styles.deleteRoleModalOverlay}>
            <div className={styles.deleteRoleModalBox}>
                <h2>Deleting role</h2>
                <p>
                    Are you sure you want to delete <strong>{role.name}</strong>?<br/>
                    This can not be undone!
                </p>
                <p>Please type <strong>DELETE</strong> to proceed:</p>
                <input
                    className={styles.deleteRoleModalInput}
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="DELETE"
                />
                <div className={styles.deleteRoleModalButtons}>
                    <button
                        className={styles.deleteRoleModalButton}
                        onClick={onCancel}
                    >
                        Abort
                    </button>
                    <button
                        className={styles.deleteRoleModalButtonConfirm}
                        onClick={onConfirm}
                        disabled={!isConfirmed}
                    >
                        Yes, delete it!
                    </button>
                </div>
            </div>
        </div>
    );
}
