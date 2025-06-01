export function sanitizeUrl(baseUrl: string, endpoint: string): string {
    // remove trailing "/"
    const base = baseUrl.replace(/\/+$/, '');
    // remove leading "/"
    const path = endpoint.replace(/^\/+/, '');
    return `${base}/${path}`;
}
