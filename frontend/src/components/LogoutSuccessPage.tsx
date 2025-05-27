import style from "./LogoutSuccessPage.module.css";

export function LogoutSuccessPage() {


    return (
        <div className={style.logoutFrame}>
            <p><span>You have been logged out!</span></p>
            <div>
                <button
                    onClick={() => window.location.href = '/'}
                    className="shadowButton"
                >
                    Return to home page
                </button>
            </div>
        </div>
    );
}