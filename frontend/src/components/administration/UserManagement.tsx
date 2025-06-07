import {useSession} from "../../session/SessionContext.tsx";
import {validateAccess} from "../../utilities/validate.ts";
import {AccessId} from "@project-types/role/accessId.ts";
import style from "./UserManagement.module.css";
import {useEffect, useState} from "react";
import {User} from "@project-types/user/user.ts";
import {Role} from "@project-types/role/role.ts";
import {fetchAllRoles, fetchUserRoles} from "@api";
import {useMessage} from "../../hooks/useMessage.ts";
import {fetchAllUsers} from "@api/endpoints/management/users.ts";
import {UserRole} from "@project-types/user/userRole.ts";
import activeUserIcon from "@assets/font-awesome/solid/user-check.svg"
import inactiveUserIcon from "@assets/font-awesome/solid/user-xmark.svg"
import roleActiveIcon from "@assets/font-awesome/solid/check.svg"
import roleInactiveIcon from "@assets/font-awesome/solid/xmark.svg"
import addUserIcon from "@assets/font-awesome/solid/user-plus.svg"

export function UserManagement() {
    const session = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editRoles, setEditRoles] = useState<UserRole[]>([]);
    const [selectedRoleIds, setSelectedRoleIds] = useState<Set<number>>(new Set<number>());
    const [allRoles, setAllRoles] = useState<Role[]>([]);
    const {showMessage} = useMessage();

    useEffect(() => {
        if (!validateAccess(session, AccessId.EDIT_USER)) return;
        if (selectedUser) {
            fetchUserRoles(selectedUser.id).then(setEditRoles);
        }
    }, [selectedUser, session]);

    useEffect(() => {
        if (editRoles) {
            const ids = new Set<number>(editRoles.map(r => r.roleId));
            setSelectedRoleIds(ids);
        }
    }, [editRoles]);

    useEffect(() => {
        if (!validateAccess(session, AccessId.EDIT_USER)) return;
        try {
            fetchAllRoles().then(setAllRoles);
            fetchAllUsers().then(setUsers);
        } catch (e) {
            console.error(e);
        }
    }, [session]);

    function toggleUserRole(roleId: number) {
        const newSet = new Set(selectedRoleIds);
        if (newSet.has(roleId)) {
            newSet.delete(roleId);
        } else {
            newSet.add(roleId);
        }
        setSelectedRoleIds(newSet);
    }


    if (!validateAccess(session, AccessId.EDIT_USER)) {
        return (<>ACCESS DENIED</>);
    }

    let userList = (
        <div className={style.placeholder}>
            No users have been added, yet.
        </div>
    )

    let userDetails = (
        <div className={style.placeholder}>
            Please select a user from the pane on the left.
        </div>
    )

    let userRolesOutput = (
        <div className={style.placeholder}>
            Please select a user from the pane on the left.
        </div>
    )

    if (users && users.length > 0) {
        userList = (
            <div className={style.userButtonList}>
                {users.map((user) => (
                    <label key={`user-id-${user.id}`}>
                        <button className="imageButton" onClick={() => setSelectedUser(user)}>
                            <img
                                src={user.active ? activeUserIcon : inactiveUserIcon}
                                alt={user.active ? "active user" : "inactive user"}
                            />
                            {user.login}
                        </button>
                    </label>
                ))}
            </div>
        )
    }


    if (selectedUser) {
        userDetails = (
            <>
                <div>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                User login:
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={selectedUser.login}
                                    onChange={(e) => {
                                        setSelectedUser({
                                            ...selectedUser,
                                            login: e.target.value
                                        });
                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                User email:
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={selectedUser.email}
                                    onChange={(e) => {
                                        setSelectedUser({
                                            ...selectedUser,
                                            email: e.target.value
                                        });
                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                User active:
                            </td>
                            <td>
                                <input type="checkbox"
                                       checked={selectedUser?.active ?? false}
                                       onChange={(e) => {
                                           if (!selectedUser) return;

                                           const updatedUser = {
                                               ...selectedUser,
                                               active: e.target.checked
                                           };
                                           setSelectedUser(updatedUser);
                                       }}
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </>
        )

        userRolesOutput = (
            <>
                <div className={style.roleList}>
                    {allRoles.map((role) => (
                        <button
                            key={role.id}
                            className={`${style.roleToggleButton} ${selectedRoleIds.has(role.id) ? style.active : ""}`}
                            onClick={() => toggleUserRole(role.id)}
                            type="button"
                        >
                            <img
                                src={selectedRoleIds.has(role.id) ? roleActiveIcon : roleInactiveIcon}
                                alt={selectedRoleIds.has(role.id) ? "active role" : "inactive role"}
                            />
                            {role.name}
                        </button>
                    ))}
                </div>
            </>
        )
    }


    function handleNewUser() {
        const newUser: User = {
            active: false,
            email: "",
            id: -1,
            login: ""
        }
        setSelectedUser(newUser);
    }

    function handleSave() {
        showMessage(`Save button pushed - ${selectedUser && selectedUser.id > -1 ? "updated" : "new"}`, "info")
    }

    return (
        <>
            <div className={style.userManagementFrame}>
                <div className={style.userListPane}>
                    <button className="imageButton"
                            onClick={() => handleNewUser()}>
                        <img src={addUserIcon} alt="add user"/> Add user
                    </button>
                    {userList}
                </div>
                <div className={style.userDetailsPane}>
                    <h2>{(selectedUser && selectedUser.id > -1) || selectedUser === null ? "User details" : "New user"}</h2>
                    {userDetails}
                </div>
                <div className={style.userRolesPane}>
                    <h2>Roles</h2>
                    {userRolesOutput}
                </div>
                <div className={style.saveBarSticky}>
                    <button className="shadowButton" onClick={handleSave}>Save Changes</button>
                </div>
            </div>
        </>
    );
}