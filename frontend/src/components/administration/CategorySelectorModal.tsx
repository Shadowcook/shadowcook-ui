import React, { useState } from "react";
import style from "./CategorySelectorModal.module.css";

export type Category = {
    id: number;
    name: string;
    parent: number;
};

type Props = {
    allCategories: Category[];
    initialParentId?: number;
    onConfirm: (categoryId: number) => void;
    onCancel: () => void;
};

export default function CategorySelectorModal({
                                                  allCategories,
                                                  initialParentId = 0,
                                                  onConfirm,
                                                  onCancel,
                                              }: Props) {
    const [currentParentId, setCurrentParentId] = useState(initialParentId);

    const getPath = (categoryId: number): Category[] => {
        const path: Category[] = [];
        let current = allCategories.find((c) => c.id === categoryId);
        while (current) {
            path.unshift(current);
            current = allCategories.find((c) => c.id === current?.parent);
        }
        return path;
    };

    const children = allCategories.filter((c) => c.parent === currentParentId);
    const breadcrumbs = getPath(currentParentId);

    return (
        <div className={style.modalBackdrop}>
            <div className={style.modalContent}>
                <h2>Kategorie auswählen</h2>

                <div className={style.breadcrumbs}>
                    <span className={style.breadcrumbItem} onClick={() => setCurrentParentId(0)}>ROOT</span>
                    {breadcrumbs.map((cat) => (
                        <React.Fragment key={cat.id}>
                            <span className={style.breadcrumbSeparator}>/</span>
                            <span
                                className={style.breadcrumbItem}
                                onClick={() => setCurrentParentId(cat.id)}
                            >
                {cat.name}
              </span>
                        </React.Fragment>
                    ))}
                </div>

                <ul className={style.categoryList}>
                    {children.map((cat) => (
                        <li
                            key={cat.id}
                            className={style.categoryItem}
                            onClick={() => setCurrentParentId(cat.id)}
                        >
                            {cat.name}
                        </li>
                    ))}
                </ul>

                <div className={style.actions}>
                    <button onClick={() => onConfirm(currentParentId)}>In diese Kategorie verschieben</button>
                    <button onClick={onCancel}>Abbrechen</button>
                </div>
            </div>
        </div>
    );
}
