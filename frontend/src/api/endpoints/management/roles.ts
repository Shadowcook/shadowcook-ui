import {Role} from "../../../types/session/role.ts";
import apiClient from "@api/axios.ts";
import {RoleResponse} from "../../../types/session/roleResponse.ts";
import {RoleAccessFull} from "../../../types/session/roleAccessFull.ts";
import {RoleAccessFullResponse} from "../../../types/session/roleAccessFullResponse.ts";
import {Access} from "../../../types/session/access.ts";
import {AccessResponse} from "../../../types/session/accessResponse.ts";

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