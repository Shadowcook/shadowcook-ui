import {useSession} from "../../../contexts/SessionContext.tsx";
import {validateAccess} from "../../../utilities/validate.ts";
import {AccessId} from "@project-types/role/accessId.ts";
import style from "./UserManagement.module.css";
import {useEffect, useState} from "react";
import {User} from "@project-types/user/user.ts";
import {Role} from "@project-types/role/role.ts";
import {
    deleteUser,
    deleteUserRoles,
    fetchAllRoles,
    fetchUserRoles,
    pushPasswordReset,
    pushUser,
    pushUserRoles
} from "@api";
import {useMessage} from "@hooks/useMessage.ts";
import {fetchAllUsers} from "@api/endpoints/management/users.ts";
import {UserRole} from "@project-types/user/userRole.ts";
import {UserRoleRequest} from "@project-types/user/userRoleRequest.ts";
import activeUserIcon from "@assets/font-awesome/solid/user-check.svg"
import inactiveUserIcon from "@assets/font-awesome/solid/user-xmark.svg"
import roleActiveIcon from "@assets/font-awesome/solid/check.svg"
import roleInactiveIcon from "@assets/font-awesome/solid/xmark.svg"
import addUserIcon from "@assets/font-awesome/solid/user-plus.svg"
import deleteUserIcon from "@assets/font-awesome/solid/trash-can.svg"
import resetPasswordIcon from "@assets/font-awesome/solid/key.svg"
import TokenExpiryInfo from "../TokenExpiryInfo.tsx";
import {ConfirmDialog} from "../../tools/ConfirmDialog.tsx";
import {usePageTitle} from "../../../contexts/pageTitleContext.tsx";

export function UserManagement() {
    usePageTitle("User Management");
    const session = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editRoles, setEditRoles] = useState<UserRole[]>([]);
    const [selectedRoleIds, setSelectedRoleIds] = useState<Set<number>>(new Set<number>());
    const [allRoles, setAllRoles] = useState<Role[]>([]);
    const {showMessage} = useMessage();
    const [isSaving, setIsSaving] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [isDeletingUser, setIsDeletingUser] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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


    function handleNewUser() {
        const newUser: User = {
            active: false,
            email: "",
            id: -1,
            login: "",
            passwordResetExpiry: ""
        }
        setSelectedUser(newUser);
    }

    async function handleSave() {
        setIsSaving(true);
        // showMessage(`Save button pushed - ${selectedUser && selectedUser.id > -1 ? "updated" : "new"}`, "info")
        if (selectedUser) {
            console.log("Form data for selected user: ", selectedUser);
            const user = await pushUser(selectedUser)
            if (user && user.success && user.users[0].id > -1) {
                showMessage("User saved.")
                const userId = user.users[0].id;
                console.log(`User saved. Assigned user ID ${userId}. data received: `, user)
                const userRoleRequest: UserRoleRequest = {
                    userRoles: Array.from(selectedRoleIds).map((roleId) => ({
                        userId,
                        roleId
                    }))
                }
                await deleteUserRoles(userId);
                const updatedUser = await pushUserRoles(userRoleRequest)
                if (updatedUser) {
                    if (updatedUser.id > -1) {
                        fetchAllRoles().then(setAllRoles);
                        fetchAllUsers().then(setUsers);
                        setSelectedUser(user.users[0]);
                    }
                }
            } else {
                console.error("Request returned an invalid result: ", user);
            }
        }
        setIsSaving(false);
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

    let userDetailHead = (
        <h2>User details</h2>
    )

    if (users && users.length > 0) {
        userList = (
            <div className={style.userButtonList}>
                {users.map((user) => (
                    <label key={`user-id-${user.id}`}>
                        <button className="imageButton" onClick={() => {
                            setSelectedUser(user)
                            console.log("Selected user: ", user);
                        }}>
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


    async function handleResetUserPassword() {
        setIsResettingPassword(true);
        if (selectedUser) {
            const resetRes = await pushPasswordReset(selectedUser);
            if (resetRes && resetRes.success) {
                setSelectedUser({
                    ...selectedUser,
                    passwordResetExpiry: resetRes.users[0].passwordResetExpiry,
                });
                showMessage("User password reset initialized", "success");
            } else {
                console.error("Unable to create password reset: ", resetRes);
                showMessage("Resetting user failed! Please check logs", "error");
            }
        }
        setIsResettingPassword(false);
    }

    async function handleDeleteUser() {
        setIsDeletingUser(true);
        try {
            if (selectedUser) {
                const userRes = await deleteUser(selectedUser.id)
                if (userRes && userRes.success) {
                    setSelectedUser(null)
                    showMessage(`User "${userRes.users[0].login}" deleted`, "success");
                } else {
                    console.error("Unable to delete user: ", userRes);
                    showMessage(`Unable to delete user "${userRes.users[0].login}"`, "error");
                }
            }
        } catch (e) {
            console.error("Error while deleting user: ", e);
        }
        setIsDeletingUser(false);
    }

    if (selectedUser) {

        if (selectedUser.id > -1) {
            userDetailHead = (
                <>
                    <h2>User details</h2>
                    <button
                        className={isResettingPassword ? "imageButtonDisabled" : "imageButton"}
                        disabled={isResettingPassword}
                        onClick={() => handleResetUserPassword()}
                    >
                        {isResettingPassword && (
                            <span className="loader"/>
                        )}

                        {!isResettingPassword && (
                            <img src={resetPasswordIcon} alt="reset password"/>
                        )}

                    </button>
                    <button
                        className="imageButton"
                        onClick={() => {
                            setShowDeleteDialog(true)
                        }}
                    >
                        {isDeletingUser && (
                            <span className="loader"/>
                        )}

                        {!isDeletingUser && (
                            <img src={deleteUserIcon} alt="delete user"/>
                        )}
                    </button>
                    <ConfirmDialog
                        open={showDeleteDialog}
                        onClose={() => setShowDeleteDialog(false)}
                        onConfirm={() => handleDeleteUser()}
                        title={`Delete user ${selectedUser.login}`}
                        message="Are you sure you want to delete this user? This can not be undone!"
                        requireConfirmationInput={true}
                        confirmationText="DELETE"
                    />
                </>
            )
        } else {
            userDetailHead = (
                <h2>New user</h2>
            )
        }


        userDetails = (
            <>
                <div className={style.userDetailsInfoBlock}>
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
                                        if (!selectedUser) return;

                                        const updatedUser = {
                                            ...selectedUser,
                                            login: e.target.value
                                        };
                                        setSelectedUser(updatedUser);
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
                                        if (!selectedUser) return;

                                        const updatedUser = {
                                            ...selectedUser,
                                            email: e.target.value
                                        };
                                        setSelectedUser(updatedUser);
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
                        <tr>
                            <td>Reset token:</td>
                            <td><TokenExpiryInfo expiryTimestamp={selectedUser.passwordResetExpiry}/></td>
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
                <div className={style.userRightPane}>
                    <div className={style.userDetailsPane}>
                        <div className={style.headerWithButton}>
                            {userDetailHead}
                        </div>
                        {userDetails}
                    </div>
                    <div className={style.userRolesPane}>
                        <h2>Roles</h2>
                        {userRolesOutput}
                    </div>
                    <div className={style.saveBarSticky}>
                        <button
                            className={isSaving ? "shadowButtonDisabled" : "shadowButton"}
                            disabled={isSaving}
                            onClick={handleSave}
                        >
                            {isSaving ? (
                                <>
                                    <span className="loader"/>
                                    Saving...
                                </>
                            ) : (
                                'Save'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}