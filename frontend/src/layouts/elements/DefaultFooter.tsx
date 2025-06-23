export function DefaultFooter() {
    const version = import.meta.env.VITE_BUILD_TAG;
    return (
        <>
            <div className="footerLeft">
                <span>&copy; 2019–{new Date().getFullYear()} by Shadowsoft</span>
            </div>
            <div className="footerRight">
                <a href="/" className="footerLink">HOME</a>&nbsp;|&nbsp;
                <a href="/legal/dataprotection" className="footerLink">Data protection</a>&nbsp;|&nbsp;
                UI Version {version}

            </div>
        </>
    );
}