import {Uom} from "./uom.ts";

export interface StepIngredient {
    name: string;
    uom: Uom;
    value: number;
    order: number;
}