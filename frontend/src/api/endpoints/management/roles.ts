import {Role} from "@types/user/role.ts";
import apiClient from "@api/axios.ts";
import {RoleResponse} from "@types/user/roleResponse.ts";
import {RoleAccessFull} from "@types/user/roleAccessFull.ts";
import {RoleAccessFullResponse} from "@types/user/roleAccessFullResponse.ts";
import {Access} from "@types/user/access.ts";
import {AccessResponse} from "@types/user/accessResponse.ts";
import {RoleAccess} from "@types/user/roleAccess.ts";
import {RoleAccessResponse} from "@types/user/roleAccessResponse.ts";

export async function fetchAllRoles(): Promise<Role[]> {
    try {
        console.log("fetching roles");
        const res = await apiClient.get<RoleResponse>('/getAllRoles');
        console.log("retrieved role data: ", res);
        console.log("fetched " + res.data.length + " roles");
        return res.data.roles;
    } catch (error) {
        console.error(error);
    }
    return [];
}

export async function fetchFullRoleAccess(): Promise<RoleAccessFull[]> {
    try {
        console.log("fetching full role access");
        const res = await apiClient.get<RoleAccessFullResponse>('/getAllRoleAccess');
        console.log("retrieved role access data: ", res);
        console.log("fetched " + res.data.length + " roles accesses");
        return res.data.rolesAccess;
    } catch (error) {
        console.error(error);
    }
    return [];
}

export async function fetchAllAccessIDs(): Promise<Access[]> {
    console.log("fetching all access IDs");
    const res = await apiClient.get<AccessResponse>('/getAllAccessIDs');
    console.log("fetched " + res.data.length + " access IDs");
    return res.data.access;
}

export async function saveRoles(roles: Role[]): Promise<RoleResponse> {
    try {
        console.log(`saving ${roles.length} roles`);
        const res = await apiClient.post('/saveRole', {roles}, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        console.log(`${res.data.length} Roles saved`);
        return res.data;
    } catch (error) {
        console.error("Failed to save roles: ", error);
        throw error;
    }
}

export async function saveAccess(roleAccess: RoleAccess[]): Promise<RoleAccessResponse> {
    try {

        console.log(`saving ${roleAccess.length} access`);
        const res = await apiClient.post('/saveAccess', {roleAccessList: roleAccess}, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        console.log("received data: ", res);
        console.log(`${res.data.length} access saved`);
        return res.data;
    } catch (error) {
        console.error("Failed to save access: ", error);
        throw error;
    }
}

export async function deleteRoleAccess(roleId: number): Promise<RoleAccessResponse> {
    try {
        console.log(`deleting role access for ${roleId}`);
        const res = await apiClient.get<RoleAccessResponse>(`/deleteRoleAccess/${roleId}`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
