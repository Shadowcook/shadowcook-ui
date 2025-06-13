import React, {useState} from 'react';
import styles from './DeleteRecipeModal.module.css';
import {Recipe} from "@project-types/recipe/recipe.ts";

interface DeleteRecipeModalProps {
    isOpen: boolean;
    recipe: Recipe;
    onCancel: () => void;
    onConfirm: () => void;
}

const DeleteRecipeModal: React.FC<DeleteRecipeModalProps> = ({
                                                                 isOpen,
                                                                 recipe,
                                                                 onCancel,
                                                                 onConfirm,
                                                             }) => {
    const [confirmationText, setConfirmationText] = useState('');

    if (!isOpen) return null;

    const isConfirmed = confirmationText.trim().toUpperCase() === 'DELETE';

    return (
        <div className={styles.deleteRecipeModalOverlay}>
            <div className={styles.deleteRecipeModalBox}>
                <h2>Deleting recipe</h2>
                <p>
                    Are you sure you want to delete <strong>{recipe.recipe.name}</strong>?<br/>
                    This can not be undone!
                </p>
                <p>Please type <strong>DELETE</strong> to proceed:</p>
                <input
                    className={styles.deleteRecipeModalInput}
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="DELETE"
                />
                <div className={styles.deleteRecipeModalButtons}>
                    <button
                        className={styles.deleteRecipeModalButton}
                        onClick={onCancel}
                    >
                        Abort
                    </button>
                    <button
                        className={styles.deleteRecipeModalButtonConfirm}
                        onClick={onConfirm}
                        disabled={!isConfirmed}
                    >
                        Yes, delete it!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteRecipeModal;
