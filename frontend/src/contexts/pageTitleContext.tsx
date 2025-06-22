// context/PageTitleContext.tsx
import {createContext, useContext, useEffect, useRef, useState} from "react";

type Entry = { title: string; priority: number };
type PageTitleContextType = {
    register: (id: string, entry: Entry) => void;
    unregister: (id: string) => void;
};

const PageTitleContext = createContext<PageTitleContextType | null>(null);

export function PageTitleProvider({children}: { children: React.ReactNode }) {
    const entriesRef = useRef<Map<string, Entry>>(new Map());
    const [activeTitle, setActiveTitle] = useState("Shadowcook");

    function setTitleWithPrefix(title: string) {
        setActiveTitle("Shadowcook - " + title);
    }

    const updateTitle = () => {
        const values = Array.from(entriesRef.current.values());
        if (values.length === 0) {
            setTitleWithPrefix("Shadowcook");
            return;
        }
        const highest = values.reduce((a, b) => (a.priority >= b.priority ? a : b));
        setTitleWithPrefix(highest.title);
    };

    const register = (id: string, entry: Entry) => {
        entriesRef.current.set(id, entry);
        updateTitle();
    };

    const unregister = (id: string) => {
        entriesRef.current.delete(id);
        updateTitle();
    };

    useEffect(() => {
        document.title = activeTitle;
    }, [activeTitle]);

    return (
        <PageTitleContext.Provider value={{register, unregister}}>
            {children}
        </PageTitleContext.Provider>
    );
}

function generateId(): string {
    return Math.random().toString(36).substring(2, 10);
}

export function usePageTitle(title: string, priority = 0) {
    const ctx = useContext(PageTitleContext);
    const idRef = useRef<string>(generateId());


    useEffect(() => {
        ctx?.register(idRef.current, {title, priority});
        return () => ctx?.unregister(idRef.current);
    }, [title, priority]);
}
