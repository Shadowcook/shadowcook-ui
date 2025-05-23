import React, {useEffect, useRef, useState} from 'react';
import {LoginPopup} from './LoginPopup';
import UserLoggedInIcon from "../assets/user-check.svg";
import UserNotLoggedInIcon from "../assets/user-xmark.svg";
import style from "./LoginMenu.module.css";
import {LoginResult, LoginResultID} from "../types/loginResultID.ts";
import {loginUser, logout} from "../api/api.ts";
import {useSession} from "../session/SessionContext.tsx";
import {UserOptionsPopup} from "./UserOptionsPopup.tsx";

export const LoginMenu: React.FC = () => {
    const [showLogin, setShowLogin] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const session = useSession();
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
    const {revalidate} = useSession();
    const handleLogin = async (
        username: string,
        password: string
    ): Promise<LoginResultID> => {
        try {
            const response = await loginUser(username, password);
            if (response) {
                console.log(response);
                if (response.success) {
                    await revalidate();
                    console.log('Logged in as:', username);
                    setShowLogin(false);
                    return LoginResult.Success;
                } else {
                    return LoginResult.InvalidCredentials
                }
            }
            return LoginResult.ServerError;
        } catch (e) {
            console.error(e);
            return LoginResult.NetworkError;
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            await revalidate();
        } catch (e) {
            console.error('Logout failed:', e);
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
                <img
                    src={session.valid ? UserLoggedInIcon : UserNotLoggedInIcon}
                    alt={session.valid ? "Logged in" : "Not logged in"}
                />

            </button>
            {showLogin && (
                session.valid ? (
                    <UserOptionsPopup onLogout={handleLogout}/>
                ) : (
                    <LoginPopup onLogin={handleLogin} onClose={() => setShowLogin(false)}/>
                )
            )}
        </div>
    );
};
