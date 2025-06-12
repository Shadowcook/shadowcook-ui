import style from "./InvalidPage.module.css"

export function InvalidPage() {


    return (
        <div className={style.invalidPageFrame}>
            <p><span>Whoops! How did you end up here?</span></p>
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