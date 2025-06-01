import dotenv from 'dotenv';
dotenv.config();

export class Config {
    readonly port: number;
    readonly baseUrl: string;
    readonly username: string;
    readonly password: string;

    constructor() {
        this.port = parseInt(process.env.PORT || '3001', 10);
        this.baseUrl = process.env.BASE_URL || '';
        this.username = process.env.SC_USER || '';
        this.password = process.env.SC_PASS || '';
        if (!this.baseUrl || !this.username || !this.password) {
            throw new Error('Missing required environment variables!');
        }
    }
}

export const config = new Config();
