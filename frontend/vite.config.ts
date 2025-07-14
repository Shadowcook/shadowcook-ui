import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig(({ command }) => ({
    server: {
        host: '0.0.0.0',
        allowedHosts: true,
        hmr: command === 'serve'
            ? {
                protocol: 'ws',   // ✅ ungesicherter WebSocket
                host: 'localhost',
                port: 5173,
            }
            : undefined,
    },
    plugins: [
        react(),
        svgr(),
    ],
    resolve: {
        alias: {
            '@api': path.resolve(__dirname, 'src/api'),
            '@project-types': path.resolve(__dirname, 'src/types'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@hooks': path.resolve(__dirname, 'src/hooks'),
        },
    },
}));
