import React, {useEffect, useRef, useState} from 'react';
import {LoginPopup} from './LoginPopup';
import UserIcon from "../assets/user.svg";
import style from "./LoginMenu.module.css";

export const LoginMenu: React.FC = () => {
    const [showLogin, setShowLogin] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleLogin = () => setShowLogin((prev) => !prev);

    const handleClickOutside = (e: MouseEvent) => {
        const popup = document.querySelector('.login-popup');
        if (
            showLogin &&
            popup &&
            !popup.contains(e.target as Node) &&
            !buttonRef.current?.contains(e.target as Node)
        ) {
            setShowLogin(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showLogin]);

    const handleLogin = async (username: string, password: string) => {
        try {
            const response = await fetch(`/login/${username}/${password}`);
            if (!response.ok) throw new Error('Login failed');
            const result = await response.json();
            console.log('Logged in as:', result);
            setShowLogin(false);
        } catch (e) {
            alert('Login failed.');
        }
    };

    return (
        <div className="header-user">
            <button
                ref={buttonRef}
                onClick={toggleLogin}
                aria-haspopup="dialog"
                aria-expanded={showLogin}
                aria-controls="login-popup"
                title="open login"
                className={style.userButton}
            >
                <img src={UserIcon} alt="User login"/>
            </button>
            {showLogin && (
                <LoginPopup onLogin={handleLogin} onClose={() => setShowLogin(false)}/>
            )}
        </div>
    );
};
