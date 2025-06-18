import apiClient from "@api/axios.ts";
import {Uom} from "@project-types/recipe/uom.ts";
import {UomResponse} from "@project-types/recipe/uomResponse.ts";

export async function fetchAllUom(): Promise<Uom[]> {
    console.log("fetching uoms");
    const res = await apiClient.get<UomResponse>('/getActiveUom');
    console.log("retrieved uom data: ", res);
    console.log("fetched " + res.data.length + " uoms");
    return res.data.uoms;
}

export async function pushUom(uom: Uom): Promise<UomResponse> {
    const res = await apiClient.post('/pushUom', {uom: uom}, {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });
    console.log("Uom saved: ", res.data);
    return res.data;
}