import {useSession} from "../../session/SessionContext.tsx";
import {validateAccess} from "../../utilities/validate.ts";
import {AccessId} from "@types/user/accessId.ts";
import React, {useEffect, useState} from "react";
import {deleteRoleAccess, fetchAllAccessIDs, fetchFullRoleAccess, saveAccess, saveRoles} from "@api";
import style from "./RoleManagement.module.css"
import {Access} from "@types/user/access.ts";
import {Role} from "@types/user/role.ts";
import {RoleAccessFull} from "@types/user/roleAccessFull.ts";
import saveIcon from "../../assets/font-awesome/solid/floppy-disk.svg"
import {useMessage} from "../../hooks/useMessage.ts";
import {RoleAccess} from "@types/user/roleAccess.ts";

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
    const {showMessage} = useMessage();


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
                setRoles(prev =>
                    prev.map(r =>
                        r.role.id === res.roles[0].id
                            ? {...r, role: {...r.role, name: selectedRole.name}}
                            : r
                    )
                );
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
                        <img src={saveIcon} alt="Save"/>
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
                        <button className="shadowButton"
                                onClick={() => handleUpdateAccess(selectedRole, editAccessIds)}>Save
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className={style.roleManagementFrame}>
            <div className={style.roleSelectionFrame}>
                <h2>Roles</h2>
                {roles.map(({role}) => (
                    <React.Fragment key={`role-id-${role.id}`}>
                        <button className="shadowButton" onClick={() => setSelectedRole(role)}>
                            {role.name}
                        </button>
                    </React.Fragment>
                ))}
            </div>
            <div className={style.accessSelectionFrame}>
                <h2>Access level</h2>
                {accessFrame}
            </div>
        </div>
    );
}
