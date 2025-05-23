import { Request, Response } from 'express';

type Handler<T> = (clientCookie: string | undefined, req: Request) => Promise<T>;

export function sessionRouteWrapper<T>(handler: Handler<T>) {
    return async (req: Request, res: Response) => {
        const cookie = req.headers.cookie;

        try {
            const result = await handler(cookie, req);
            res.json(result);
        } catch (e) {
            console.error(`SessionRouter error on ${req.path}:`, (e as Error).message);
            res.status(500).json({ error: 'Internal proxy error' });
        }
    };
}
