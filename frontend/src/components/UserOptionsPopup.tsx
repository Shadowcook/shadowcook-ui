interface Props {
    onLogout: () => void;
}

export const UserOptionsPopup: React.FC<Props> = ({ onLogout }) => {
    return (
        <div className="user-options-popup" role="menu">
            <ul>
                <li><button onClick={onLogout}>Logout</button></li>
            </ul>
        </div>
    );
};
