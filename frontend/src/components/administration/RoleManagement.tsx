import {useSession} from "../../session/SessionContext.tsx";
import {validateAccess} from "../../utilities/validate.ts";
import {AccessId} from "../../types/session/accessId.ts";
import React, {useEffect, useState} from "react";
import {fetchAllAccessIDs, fetchFullRoleAccess} from "@api";
import style from "./RoleManagement.module.css"
import {Access} from "../../types/session/access.ts";
import {Role} from "../../types/session/role.ts";
import {RoleAccessFull} from "../../types/session/roleAccessFull.ts";

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
    const [editAccessIds, setEditAccessIds] = useState<Set<number>>(new Set());
    const [allAccessIds, setAllAccessIds] = useState<Access[]>([]);

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
