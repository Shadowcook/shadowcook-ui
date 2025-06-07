export const enum AccessId {
    ADMIN = 0,
    CREATE_TAG = 3,
    EDIT_CATEGORY = 5,
    EDIT_RECIPE = 2,
    EDIT_UOM = 6,
    EDIT_USER = 1,
    READ_RECIPE = 4
}

export const MANAGEMENT_ACCESS_IDS: AccessId[] = [
    AccessId.ADMIN,
    AccessId.EDIT_CATEGORY,
    AccessId.EDIT_RECIPE,
    AccessId.EDIT_UOM,
    AccessId.EDIT_USER,
];