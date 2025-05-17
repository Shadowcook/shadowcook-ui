import {ApiResponse} from "./apiResponse.ts";
import {Category} from "./category.ts";

export interface CategoriesResponse extends ApiResponse<Category[]> {
    categories: Category[];
}