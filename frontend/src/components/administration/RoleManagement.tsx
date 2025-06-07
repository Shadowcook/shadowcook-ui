import {useSession} from "../../session/SessionContext.tsx";
import {validateAccess} from "../../utilities/validate.ts";
import {AccessId} from "@project-types/role/accessId.ts";
import React, {useEffect, useState} from "react";
import {deleteRole, deleteRoleAccess, fetchAllAccessIDs, fetchFullRoleAccess, saveAccess, saveRoles} from "@api";
import style from "./RoleManagement.module.css"
import {Access} from "@project-types/role/access.ts";
import {Role} from "@project-types/role/role.ts";
import {RoleAccessFull} from "@project-types/role/roleAccessFull.ts";
import saveIcon from "@assets/font-awesome/solid/floppy-disk.svg"
import deleteIcon from "@assets/font-awesome/solid/trash-can.svg"
import {useMessage} from "../../hooks/useMessage.ts";
import {RoleAccess} from "@project-types/role/roleAccess.ts";
import {DeleteRoleModal} from "./DeleteRoleModal.tsx";
import addRoleIcon from "@assets/font-awesome/solid/plus.svg";

function groupByRole(entries: RoleAccessFull[]): { role: Role; accessIds: number[] }[] {
    const map = new Map<number, { role: Role; accessIds: number[] }>();

    for (const entry of entries) {
        const roleId = entry.role.id;
        if (!map.has(roleId)) {
            map.set(roleId, {
                role: entry.role,
                accessIds: [entry.access.id]
            });
        } else {
            map.get(roleId)!.accessIds.push(entry.access.id);
        }
    }

    return Array.from(map.values());
}

export function RoleManagement() {
    const session = useSession();
    const [roles, setRoles] = useState<{ role: Role; accessIds: number[] }[]>([]);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [editAccessIds, setEditAccessIds] = useState<Set<number>>(new Set<number>());
    const [allAccessIds, setAllAccessIds] = useState<Access[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
    const {showMessage} = useMessage();

    function handleDeleteRequest(role: Role) {
        setRoleToDelete(role);
        setShowDeleteModal(true);
    }

    function handleCancelDelete() {
        setShowDeleteModal(false);
        setRoleToDelete(null);
    }

    async function handleConfirmDelete() {
        if (!roleToDelete) return;

        await deleteRole(roleToDelete.id);

        setShowDeleteModal(false);
        setRoleToDelete(null);
        setSelectedRole(null)
        fetchFullRoleAccess()
            .then(groupByRole)
            .then(setRoles);
    }

    async function handleUpdateAccess(role: Role, ids: Set<number>) {
        if (!role || ids.size === 0) {
            showMessage("No role oder access selected: ", "error", 10)
            return
        }


        const roleAccessArray: RoleAccess[] = Array.from(ids).map((accessId) => ({
            accessId,
            roleId: role.id,
        }));

        try {
            const deleteRes = await deleteRoleAccess(role.id)
            const res = await saveAccess(roleAccessArray);
            if (res.success && deleteRes.success) {
                fetchFullRoleAccess()
                    .then(groupByRole)
                    .then(setRoles);
                showMessage("Access updated successfully.", "success");
            } else {
                showMessage("Unable to update access.", "error", 10);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleSave(selectedRole: Role) {
        try {
            const res = await saveRoles([selectedRole]);
            if (!res) {
                console.error("Unknown server reply: ", res)
                showMessage("Failed to save role", "error", 10);
            } else if (!res.success) {
                console.error("Error while saving role: ", res)
                showMessage("Failed to save role", "error", 10);
            } else if (res.success && res.roles.length > 0) {
                showMessage("Role name saved", "success");
                setSelectedRole(res.roles[0]);
                setRoles(prev => {
                    const updatedRole = res.roles[0];
                    const exists = prev.some(r => r.role.id === updatedRole.id);

                    if (exists) {
                        return prev.map(r =>
                            r.role.id === updatedRole.id
                                ? { ...r, role: { ...r.role, name: updatedRole.name } }
                                : r
                        );
                    } else {
                        return [...prev, { role: updatedRole, accessIds: [] }];
                    }
                });
            } else {
                console.error("Unknown error: ", res)
                showMessage("Failed to save role", "error", 10);
            }
        } catch (error) {
            console.error("EXCEPTION: Error while saving role: ", error)
        }
    }


    useEffect(() => {
        if (!validateAccess(session, AccessId.ADMIN)) return;

        fetchAllAccessIDs().then(setAllAccessIds);

        fetchFullRoleAccess()
            .then(groupByRole)
            .then(setRoles);
    }, [session]);

    useEffect(() => {
        if (!selectedRole) return;

        const role = roles.find(r => r.role.id === selectedRole.id);
        if (role) {
            setEditAccessIds(new Set(role.accessIds));
        }
    }, [selectedRole, roles]);

    const toggleAccess = (id: number) => {
        const copy = new Set(editAccessIds);
        if (copy.has(id)) {
            copy.delete(id);
        } else {
            copy.add(id);
        }
        setEditAccessIds(copy);
    };

    if (!validateAccess(session, AccessId.ADMIN)) {
        return <>ACCESS DENIED</>;
    }

    let accessFrame = (
        <div className={style.placeholder}>
            Please select a role from the pane on the left.
        </div>
    );


    if (selectedRole) {
        accessFrame = (
            <>
                <div className={style.roleHeader}>
                    <input
                        type="text"
                        value={selectedRole.name}
                        onChange={(e) => {
                            setSelectedRole({
                                ...selectedRole,
                                name: e.target.value
                            });
                        }}
                    />
                    <button className="imageButton" onClick={() => handleSave(selectedRole)}>
                        <img src={saveIcon} alt="Save role name"/>
                    </button>
                    <button className="imageButton" onClick={() => handleDeleteRequest(selectedRole)}>
                        <img src={deleteIcon} alt="Delete role"/>
                    </button>
                </div>
                <div className={style.accessCheckboxList}>
                    {allAccessIds.map((access) => (
                        <label key={access.id} className={style.checkboxEntry}>
                            <input
                                type="checkbox"
                                checked={editAccessIds.has(access.id)}
                                onChange={() => toggleAccess(access.id)}
                            />
                            {access.name}
                        </label>
                    ))}
                    <div className={style.accessDetailsButtonFrame}>
                        <button className={!selectedRole || (selectedRole && selectedRole.id < 0) ? "shadowButtonDisabled" : "shadowButton"}
                                disabled={!selectedRole || (selectedRole && selectedRole.id < 0)}
                                onClick={() => handleUpdateAccess(selectedRole, editAccessIds)}>Save
                        </button>
                    </div>
                </div>
            </>
        );
    }

    function handleNewRole() {
        const newRole: Role = {
            id: -1,
            name: ""
        }
        setSelectedRole(newRole);
        setEditAccessIds(new Set<number>);
    }

    return (
        <>
            <div className={style.roleManagementFrame}>
                <div className={style.roleSelectionFrame}>
                    <button className="imageButton"
                            onClick={() => handleNewRole()}>
                        <img src={addRoleIcon} alt="add role"/> Add role
                    </button>
                    {roles.map(({role}) => (
                        <React.Fragment key={`role-id-${role.id}`}>
                            <button className="shadowButton" onClick={() => setSelectedRole(role)}>
                                {role.name}
                            </button>
                        </React.Fragment>
                    ))}
                </div>
                <div className={style.accessSelectionFrame}>
                    <h2>{(selectedRole && selectedRole.id > -1) || selectedRole === null ? "Access level" : "New role"}</h2>
                    {accessFrame}
                </div>
            </div>
            {showDeleteModal && roleToDelete && (
                <DeleteRoleModal
                    role={roleToDelete}
                    onCancel={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                />
            )}</>
    );
}
