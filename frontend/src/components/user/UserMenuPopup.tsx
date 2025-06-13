import React, {useEffect, useRef, useState} from 'react';
import style from "./UserMenuPopup.module.css";
import {LoginResult, LoginResultID} from "@project-types/user/session/loginResultID.ts";
import {LoginErrorMessages} from "@project-types/user/session/loginErrorMessages.ts";
import {SessionState} from "@project-types/user/session/sessionState.ts";
import {validateAnyAccess} from "../../utilities/validate.ts";
import {AccessId} from "@project-types/role/accessId.ts";
import {Link} from "react-router-dom";
import adminIcon from "@assets/font-awesome/solid/wrench.svg";

interface LoginProps {
    onLogin: (username: string, password: string) => Promise<LoginResultID>;
    onClose: () => void;
}


interface UserOptionsProps {
    session: SessionState;
    onLogout: () => void;
    onClose: () => void;
}

export const UserOptionsPopup: React.FC<UserOptionsProps> = (props) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const {session, onLogout} = props;
    let managementNavButton;
    if (validateAnyAccess(session, [AccessId.EDIT_USER, AccessId.EDIT_UOM, AccessId.EDIT_CATEGORY, AccessId.ADMIN])) {
        managementNavButton = (
            <>
                <hr className={style.menuSeparator}/>
                <div className="linkButtonFrame">
                    <strong>Administration</strong>
                    <Link className="linkButtonLink" to={`/management`}>
                        <div className="linkButton">
                            <img src={adminIcon} alt="up-arrow"/> <span>Management</span>
                        </div>
                    </Link>
                </div>
            </>
        )
    } else {
        managementNavButton = (<></>)
    }
    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-popup-title"
            className={style.userMenuPopup}
            ref={popupRef}
        >
            <p>
                <span className={style.welcomeMessage}>Welcome, {session.user.login}</span><br/>
                <span className={style.emailId}>{session.user.email}</span><br/>
            </p>
            {managementNavButton}
            <hr className={style.menuSeparator}/>
            <div className={style.userMenuPopupButtons}>
                <button className="shadowButton" onClick={onLogout}>Logout</button>
            </div>
        </div>
    );
};


export const UserLoginPopup: React.FC<LoginProps> = ({onLogin, onClose}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginResult, setLoginResult] = useState<LoginResultID>(LoginResult.Undefined);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const loginResult = await onLogin(username, password);
        setLoginResult(loginResult);
    };


    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-popup-title"
            className={style.userMenuPopup}
            ref={popupRef}
        >
            <form onSubmit={handleSubmit}>
                <h2 id="login-popup-title" className={style.visuallyHidden}>Login</h2>
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
                {loginResult !== LoginResult.Undefined && loginResult !== LoginResult.Success && (
                    <div className={style.userMenuErrorMessageFrame} role="alert">
                        <p>{LoginErrorMessages[loginResult] ?? 'Unknown error'}</p>
                    </div>
                )}
                <div className={style.userMenuPopupButtons}>
                    <button className="shadowButton" type="submit">Login</button>
                </div>
            </form>
        </div>
    );
};
