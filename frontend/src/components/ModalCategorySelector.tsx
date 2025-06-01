import React, {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {fetchCategories} from "../api/api.ts";
import style from "./ModalCategorySelector.module.css";

export interface Category {
    id: number;
    name: string;
    parent: number;
}

interface CategoryModalProps {
    recipeId: number;
    selectedCategories: number[];
    onClose: () => void;
    onSave: (selected: number[]) => void;
}

const ModalCategorySelector: React.FC<CategoryModalProps> = (props) => {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const {selectedCategories, onClose, onSave} = props;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [catRes] = await Promise.all([
                    fetchCategories(),
                ]);
                const cats: Category[] = catRes;
                setCategories(cats);
                setSelected(new Set(selectedCategories));
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

export default ModalCategorySelector;
