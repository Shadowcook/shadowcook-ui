import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        svgr(),
    ],
    resolve: {
        alias: {
            '@api': path.resolve(__dirname, 'src/api'),
            '@project-types': path.resolve(__dirname, 'src/types'),
            '@assets': path.resolve(__dirname, 'src/assets'),
        },
    },
});
