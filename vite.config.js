import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias:{
            '@': "resources/js",
        }
    },
    build: {
        rollupOptions: {
          external: ['@mui/material', '@emotion/react', '@emotion/styled'],
        },
      },
});
