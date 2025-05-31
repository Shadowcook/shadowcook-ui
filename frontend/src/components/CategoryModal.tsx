import React, {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {fetchCategories} from "../api/api.ts";
import style from "./CategoryModal.module.css";

export interface Category {
    id: number;
    name: string;
    parent: number;
}

interface CategoryModalProps {
    onClose: () => void;
    onSave: (selected: number[]) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({onClose, onSave}) => {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [catRes, selRes] = await Promise.all([
                    fetchCategories(),
                    // TODO: replace this API call with the actual call to get category IDs
                    // fetch("/api/recipe/selected-categories")adasd
                    []
                ]);
                const cats: Category[] = catRes;
                const selectedIds: number[] = selRes;
                setCategories(cats);
                setSelected(new Set(selectedIds));
            } catch (error) {
                console.error("Error while loading categories: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggle = (id: number) => {
        const updated = new Set(selected);
        if (updated.has(id)) {
            updated.delete(id);
        } else {
            updated.add(id);
        }
        setSelected(updated);
    };

    const buildTree = (parentId: number, level: number = 0): React.ReactNode => {
        if (!categories) return null;

        return categories
            .filter(cat => cat.parent === parentId)
            .map(cat => (
                <div key={cat.id} style={{paddingLeft: `${level * 20}px`}}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selected.has(cat.id)}
                            onChange={() => toggle(cat.id)}
                        />
                        {cat.name}
                    </label>
                    {buildTree(cat.id, level + 1)}
                </div>
            ));
    };

    return createPortal(
        <div className={style.modalOverlay}>
            <div className={style.modalContent}>
                <h2>Edit categories</h2>
                {loading ? (
                    <p>Loading categories...</p>
                ) : (
                    <>
                        <div className={style.categoryTree}>{buildTree(0)}</div>
                        <div className={style.modalActions}>
                            <button onClick={onClose}>Cancel</button>
                            <button onClick={() => onSave(Array.from(selected))}>Save</button>
                        </div>
                    </>
                )}
            </div>
        </div>,
        document.body
    );
};

export default CategoryModal;
