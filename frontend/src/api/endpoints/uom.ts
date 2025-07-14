import {Uom} from "../../types/recipe/uom.ts";
import {UomResponse} from "../../types/recipe/uomResponse.ts";
import {apiGet} from "@api/apiRequest.ts";

export async function fetchUomList(): Promise<Uom[]> {
    try {
        console.log("fetching UOM...");
        const res = await apiGet<UomResponse>('/getUomList');
        console.log(`fetched UOM data: ${res.data}`);
        console.log("fetched " + res.length + " UOM");
        return res.uoms;
    } catch (error) {
        console.log(error);
    }
    return [];
}