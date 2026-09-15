import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

// Testes de componente com DOM real (jsdom). Os testes de serviço continuam a
// correr com `bun test tests/`.
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    test: {
        environment: 'jsdom',
        include: ['tests/component/**/*.test.ts']
    }
});
