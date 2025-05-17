export function resolveCJSModule(mod: any) {
    return mod.default ?? mod;
}