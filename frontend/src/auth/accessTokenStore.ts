let accessToken: string | null = null;

export function setAccessToken(token: string) {
    console.log({newAccessToken: token});
    accessToken = token;
}

export function getAccessToken(): string | null {
    return accessToken;
}

export function clearAccessToken(): void {
    accessToken = null;
}