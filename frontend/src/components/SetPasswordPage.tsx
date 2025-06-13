import style from "./SetPasswordPage.module.css"
import {useEffect, useState} from "react";
import {calculatePasswordEntropy, encodeBase64} from "../utilities/tools.ts";
import {PasswordStrengthBar} from "./PasswordStrengthBar.tsx";
import CheckMarkIcon from '@assets/font-awesome/solid/check.svg?react';
import XMarkIcon from '@assets/font-awesome/solid/xmark.svg?react';
import {useParams} from "react-router-dom";
import {pushUserPassword, validateUserToken} from "@api";
import {User} from "@project-types/user/user.ts";

export function SetPasswordPage() {
    const {username, token} = useParams<{ username: string; token: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [password, setPassword] = useState("")
    const [passwordRepeat, setPasswordRepeat] = useState("")
    const [isEntropyOk, setIsEntropyOk] = useState<boolean>(false)
    const [isPasswordRepeatOk, setIsPasswordRepeatOk] = useState<boolean>(false)
    const [resetSuccess, setResetSuccess] = useState<boolean>(false);
    const minEntropyValue: number = 90;
    const [isValidPassword, setIsValidPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordEntropy, setPasswordEntropy] = useState<{ entropy: number; bitsPerChar: number }>({
        entropy: 0,
        bitsPerChar: 0
    });

    useEffect(() => {
        setErrorMessage("");
        if (username && token && username.length > 0 && token.length > 0) {
            validateUserToken(username, token).then(setUser)
        }
    }, [token, username]);


    useEffect(() => {
        const newEntropy = calculatePasswordEntropy(password);
        setPasswordEntropy(newEntropy);
        const passRepeatOk = password === passwordRepeat && password.length > 0;
        const entropyOk = newEntropy.entropy > minEntropyValue;
        setIsPasswordRepeatOk(passRepeatOk)
        setIsEntropyOk(entropyOk)
        setIsValidPassword(entropyOk && passRepeatOk);

    }, [password, passwordRepeat]);


    async function handlePasswordReset() {
        if (username && token && username.length > 0 && token.length > 0) {
            const base64Password = encodeBase64(password);
            const apiResult = await pushUserPassword(username, token, base64Password);
            if (apiResult) {
                setResetSuccess(true);
            } else {

                console.error("Unable to reset password", apiResult)
            }
        }
    }

    if (resetSuccess) {
        return (
            <div className={style.setPasswordFrame}>
                <div className={style.innerBox}>
                    <h1>Congratulations {user?.login},<br/> your new password has been set.</h1>
                    <h2>You may return to the home page now and login</h2>
                    <div>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="shadowButton"
                        >
                            Return to home page
                        </button>
                    </div>
                </div>
            </div>
        );
    } else if (user) {
        return (
            <div className={style.setPasswordFrame}>
                <div className={style.innerBox}>
                    <div className={style.headerFrame}>
                        <h1>Welcome, {user.login}</h1>
                        <h2>Please set your password</h2>
                    </div>
                    <div>
                        <div className={style.passwordInputFrame}>
                            <span>Password</span><br/>
                            <div className={style.inputWithIcon}>
                                <input type="password"
                                       onChange={e => setPassword(e.target.value)}
                                       value={password}
                                />
                                {isEntropyOk && (
                                    <>
                                        <CheckMarkIcon className={style.goodPassword}/>
                                    </>
                                )}

                                {!isEntropyOk && (
                                    <>
                                        <XMarkIcon className={style.badPassword}/>
                                    </>
                                )}
                            </div>

                            <br/>
                            <span>Repeat password:</span><br/>

                            <div className={style.inputWithIcon}>
                                <input type="password"
                                       onChange={e => setPasswordRepeat(e.target.value)}
                                       value={passwordRepeat}/>
                                {isPasswordRepeatOk && (
                                    <>
                                        <CheckMarkIcon className={style.goodPassword}/>
                                    </>
                                )}

                                {!isPasswordRepeatOk && (
                                    <>
                                        <XMarkIcon className={style.badPassword}/>
                                    </>
                                )}
                            </div>

                        </div>
                        <div className={style.passwordEntropyCheckFrame}>
                            <span>Password strength (you have to hit the marker):</span>
                            <PasswordStrengthBar entropy={passwordEntropy} threshold={minEntropyValue}
                                                 maxEntropy={200}/>
                        </div>
                        <div className={style.setPasswordButtonFrame}>
                            <button
                                className={isValidPassword ? "shadowButton" : "shadowButtonDisabled"}
                                disabled={!isValidPassword}
                                onClick={() => handlePasswordReset()}
                            >
                                Set Password
                            </button>
                            <span className={style.errorMessage}>{errorMessage}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={style.setPasswordFrame}>
                <div className={style.innerBox}>
                    <h2>Sorry, your token seems to be expired</h2>
                    <div>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="shadowButton"
                        >
                            Return to home page
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}