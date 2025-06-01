import {Category} from "../types/category/category.ts";
import {TreeItem} from "../types/utilities/treeItem.ts";


export function buildCategoryTree(flatList: Category[]): TreeItem[] {
    const map = new Map<number, TreeItem>();

    for (const cat of flatList) {
        map.set(cat.id, { id: cat.id, name: cat.name, children: [] });
    }

    const rootNodes: TreeItem[] = [];

    for (const cat of flatList) {
        const node = map.get(cat.id)!;
        if (cat.parent === -1) {
            rootNodes.push(node);
        } else {
            const parent = map.get(cat.parent);
            if (parent) {
                parent.children!.push(node);
            }
        }
    }
    console.log("Nodes: ", rootNodes);
    return rootNodes;
}
