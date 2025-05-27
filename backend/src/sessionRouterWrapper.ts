import { Request, Response } from 'express';

type Handler = (cookie: string | undefined, req: Request, res: Response) => Promise<any>;

export function sessionRouteWrapper(handler: Handler) {
    return async (req: Request, res: Response) => {
        try {
            const cookie = req.headers.cookie;
            const result = await handler(cookie, req, res);
            if (!res.headersSent) {
                res.json(result);
            }
        } catch (e) {
            console.error(`SessionRouter error on ${req.path}:`, e);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}

