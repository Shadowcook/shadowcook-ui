import type { Request, Response } from 'express';
import { defaultApiRequest } from './defaultApiRequest.js';
import { userClientRequest } from './userClient.js';
import type { AxiosRequestConfig } from 'axios';


export function sessionRouteWrapper(
    configFactory: (req: Request) => AxiosRequestConfig
): (req: Request, res: Response) => Promise<void>;

export function sessionRouteWrapper(
    options: {
        configFactory: (req: Request) => AxiosRequestConfig;
        transformResponse?: (data: any, req: Request) => any;
    }
): (req: Request, res: Response) => Promise<void>;

// Implementation
export function sessionRouteWrapper(arg: any) {
    const configFactory =
        typeof arg === 'function' ? arg : arg.configFactory;
    const transformResponse =
        typeof arg === 'function' ? undefined : arg.transformResponse;

    return async (req: Request, res: Response) => {
        try {
            const cookie = req.headers.cookie;
            const token = req.headers.authorization?.replace(/^Access\s+/i, '');
            const config = configFactory(req);

            if (req.method === 'POST' && req.body && !config.data) {
                config.data = req.body;
            }

            const data = token || cookie
                ? await userClientRequest(config, cookie, token)
                : await defaultApiRequest(config);

            const finalData = transformResponse ? transformResponse(data, req) : data;
            res.json(finalData);
        } catch (e) {
            console.error(`SessionRouter error on ${req.path}:`, e);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
