import {Uom} from "../../types/recipe/uom.ts";
import apiClient from "../axios.ts";
import {UomResponse} from "../../types/recipe/uomResponse.ts";

export async function fetchUomList(): Promise<Uom[]> {
    try {
        console.log("fetching UOM...");
        const res = await apiClient.get<UomResponse>('/getUomList');
        console.log(`fetched UOM data: ${res.data}`);
        console.log("fetched " + res.data.length + " UOM");
        return res.data.uoms;
    } catch (error) {
        console.log(error);
    }
    return [];
}