import React, {useEffect, useRef, useState} from 'react';
import {UserLoginPopup, UserOptionsPopup} from './UserMenuPopup.tsx';
import UserLoggedInIcon from "../assets/font-awesome/solid/user-check.svg";
import UserNotLoggedInIcon from "../assets/font-awesome/solid/user-xmark.svg";
import AddRecipeIcon from "../assets/font-awesome/solid/plus.svg"
import style from "./UserMenu.module.css";
import {LoginResult, LoginResultID} from "../types/loginResultID.ts";
import {loginUser, logout} from "../api/api.ts";
import {useSession} from "../session/SessionContext.tsx";
import {useMessage} from "../hooks/useMessage.ts";
import {createEmptyRecipe} from "../types/createEmptyRecipe.ts";
import {useNavigate} from 'react-router-dom';
import {validateAccess} from "../utilities/validate.ts";
import {AccessId} from "../types/accessId.ts";

export const UserMenu: React.FC = () => {
    const [showUserOptions, setShowUserOptions] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const session = useSession();
    const toggleUserOptions = () => setShowUserOptions((prev) => !prev);
    const {showMessage} = useMessage();
    const handleClickOutside = (e: MouseEvent) => {
        const popup = document.querySelector('.login-popup');
        if (
            showUserOptions &&
            popup &&
            !popup.contains(e.target as Node) &&
            !buttonRef.current?.contains(e.target as Node)
        ) {
            setShowUserOptions(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showUserOptions]);
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
                    console.log('Logged in as: ', username);
                    setShowUserOptions(false);
                    showMessage("Login successful", "success")
                    return LoginResult.Success;
                } else {
                    showMessage("Login failed. Check log for details.", "error")
                    return LoginResult.InvalidCredentials
                }
            }
            showMessage("Login failed. Check log for details.", "error")
            return LoginResult.ServerError;
        } catch (e) {
            console.error(e);
            showMessage("Login failed. Check log for details.", "error")
            return LoginResult.NetworkError;
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setShowUserOptions(false);
            await revalidate();
            window.location.href = '/logout-success';
        } catch (e) {
            console.error('Logout failed: ', e);
        }
    };

    let createRecipeButton;
    const navigate = useNavigate();
    if (session.valid && validateAccess(session, AccessId.EDIT_RECIPE)) {

        createRecipeButton = (
            <button
                className="addRecipeButton"
                onClick={() => {
                    const newRecipe = createEmptyRecipe();
                    navigate('/recipe/new', {state: {newRecipe}});
                }}
                title="create new recipe"
            >
                <img
                    src={AddRecipeIcon}
                    alt="add recipe"
                />
                &nbsp;&nbsp;Add recipe
            </button>
        )
    } else {
        createRecipeButton = (<div></div>)
    }

    return (
        <div className="header-user">
            <table>
                <tbody>
                <tr>
                    <td>
                        {createRecipeButton}
                    </td>
                    <td>
                        <button
                            ref={buttonRef}
                            onClick={toggleUserOptions}
                            aria-haspopup="dialog"
                            aria-expanded={showUserOptions}
                            aria-controls="user-options-popup"
                            title="open user options"
                            className={style.userButton}
                        >
                            <img
                                src={session.valid ? UserLoggedInIcon : UserNotLoggedInIcon}
                                alt={session.valid ? "Logged in" : "Not logged in"}
                            />
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
            {showUserOptions && (
                session.valid ? (
                    <UserOptionsPopup
                        session={session}
                        onLogout={handleLogout}
                        onClose={() => setShowUserOptions(false)}
                    />
                ) : (
                    <UserLoginPopup
                        onLogin={handleLogin}
                        onClose={() => setShowUserOptions(false)}
                    />
                )
            )}
        </div>
    );
};
