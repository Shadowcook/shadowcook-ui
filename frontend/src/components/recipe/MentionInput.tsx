import React, {useEffect, useRef, useState} from 'react';
import styles from './MentionInput.module.css';
import {RecipeHeader} from '@project-types/recipe/recipeHeader';
import {fetchRecipeHeads} from '@api';
import useDebounce from "@project-types/utilities/useDebounce.ts";


interface MentionInputProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function MentionInput({value, onChange}: MentionInputProps) {
    const [showPopup, setShowPopup] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const [results, setResults] = useState<RecipeHeader[]>([]);
    const [caretPosition, setCaretPosition] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const debouncedQuery = useDebounce(mentionQuery, 300);

    useEffect(() => {
        if (debouncedQuery.length >= 3) {
            console.log("debounce fetching for:", debouncedQuery);
            fetchRecipeHeads(debouncedQuery).then(setResults);
        } else {
            setResults([]);
        }
    }, [debouncedQuery]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const cursor = e.target.selectionStart;
        const text = e.target.value;
        onChange(text);
        setCaretPosition(cursor);

        const match = /@(\w*)$/.exec(text.slice(0, cursor));
        console.log("RawQuery:", text.slice(0, cursor), "→ MentionQuery:", match?.[1]);

        if (match) {
            setMentionQuery(match[1]);
            setShowPopup(true);
        } else {
            setMentionQuery('');
            setShowPopup(false);
        }
    };

    const insertMention = (recipe: RecipeHeader) => {
        const before = value.slice(0, caretPosition);
        const after = value.slice(caretPosition);
        const replaced = before.replace(/@(\w*)$/, `{recipeId:${recipe.id}}`);
        onChange(replaced + after);
        setShowPopup(false);
        setMentionQuery('');
    };

    return (
        <div className={styles.wrapper}>
      <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          className={styles.textarea}
          rows={6}
      />
            {showPopup && results.length > 0 && (
                <div className={styles.popup}>
                    {results.map(recipe => (
                        <div
                            key={recipe.id}
                            className={styles.result}
                            onClick={() => insertMention(recipe)}
                        >
                            {recipe.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
