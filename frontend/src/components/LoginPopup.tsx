import React, {useEffect, useRef, useState} from 'react';
import style from "./LoginPopup.module.css";

interface Props {
    onLogin: (username: string, password: string) => void;
    onClose: () => void;
}

export const LoginPopup: React.FC<Props> = ({onLogin, onClose}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const firstInputRef = useRef<HTMLInputElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        firstInputRef.current?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-popup-title"
            className={style.loginPopup}
            ref={popupRef}
        >
            <form onSubmit={handleSubmit}>
                {/*<h2 id="login-popup-title" className={style.visuallyHidden}>Login</h2>*/}
                <div>
                    <p><label htmlFor="username">Username:</label><br/>
                        <input
                            id="username"
                            type="text"
                            ref={firstInputRef}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </p>
                </div>
                <div>
                    <p>
                        <label htmlFor="password">Password:</label><br/>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </p>
                </div>
                <div className={style.loginPopupButtons}>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );
};
