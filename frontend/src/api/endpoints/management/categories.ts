import apiClient from "@api/axios.ts";
import {Category} from "@project-types/category/category.ts";
import {CategoriesResponse} from "@project-types/category/categoriesResponse.ts";
import {CategoryRequest} from "@project-types/category/categoryRequest.ts";

export async function pushCategory(category: Category): Promise<CategoriesResponse> {
    console.log("Saving category: ", category);
    const rq: CategoryRequest = {
        id: -1,
        name: category.name,
        parent: category.parent
    }

    const res = await apiClient.post('/pushCategory', {category: rq}, {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });
    console.log("Category saved:", res.data);
    return res.data;
}

export async function deleteCategory(catDelete: Category): Promise<CategoriesResponse> {
    console.log(`deleting category ${catDelete.id}.`);
    const res = await apiClient.get<CategoriesResponse>(`/deleteCategory/${catDelete.id}`);
    return res.data;
}