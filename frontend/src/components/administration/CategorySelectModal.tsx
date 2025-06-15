import {useEffect, useState} from "react";
import style from "./CategorySelectModal.module.css";
import {Category} from "@project-types/category/category"
import {CategoryBrowser} from "../navigation/CategoryBrowser";

interface CategorySelectModalProps {
    categories: Category[];
    initialSelection?: Category;
    actionCategory: Category;
    headline: string;
    onConfirm: (category: Category) => void;
    onCancel: () => void;
}

export function CategorySelectModal({
                                        categories,
                                        initialSelection,
                                        headline,
                                        onConfirm,
                                        onCancel
                                    }: CategorySelectModalProps) {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialSelection ?? null);

    useEffect(() => {
        if (!selectedCategory && categories.length > 0) {
            const root = categories.find(cat => cat.id === 0);
            if (root) setSelectedCategory(root);
        }
    }, [categories, selectedCategory]);

    // return (
    //     <div className={style.backdrop}>
    //         <div className={style.modal}>
    //             <h2>Test Headline</h2>
    //             <div className={style.browserFrame}>
    //                 <div>FAKE CATEGORY BROWSER (Test)</div>
    //                 <div>FAKE CATEGORY BROWSER (Test)</div>
    //                 <div>FAKE CATEGORY BROWSER (Test)</div>
    //             </div>
    //             <div className={style.browserFrame}>
    //                 <div className={style.browserWrapper}>
    //                     <CategoryBrowser
    //                         categories={categories}
    //                         stateLess={false}
    //                         selectedCategory={selectedCategory ?? undefined}
    //                         onCategorySelect={(cat) => setSelectedCategory(cat)}
    //                     />
    //                 </div>
    //             </div>
    //             <div className={style.actions}>
    //                 <button>Cancel</button>
    //                 <button>Confirm</button>
    //             </div>
    //         </div>
    //     </div>
    // );

    return (
        <div className={style.backdrop}>
            <div className={style.modal}>
                <h2>{headline}: {selectedCategory?.name ?? "No category selected"}</h2>

                <div className={style.browserFrame}>
                    <CategoryBrowser
                        categories={categories}
                        stateLess={false}
                        selectedCategory={selectedCategory ?? undefined}
                        onCategorySelect={(cat) => setSelectedCategory(cat)}
                    />
                </div>

                <div className={style.actions}>
                    <button onClick={onCancel}>Cancel</button>
                    <button
                        onClick={() => selectedCategory ? onConfirm(selectedCategory) : undefined}
                        disabled={!selectedCategory}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
