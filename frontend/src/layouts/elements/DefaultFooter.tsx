export function DefaultFooter() {
    return (
        <>
            <div className="footerLeft">
                <span>&copy; 2019–{new Date().getFullYear()} by Shadowsoft</span>
            </div>
            <div className="footerRight">
                <a href="/" className="footerLink">HOME</a>&nbsp;|&nbsp;
                <a href="/legal/dataprotection" className="footerLink">Data protection</a>&nbsp;|&nbsp;
                UI Version 1.0

            </div>
        </>
    );
}