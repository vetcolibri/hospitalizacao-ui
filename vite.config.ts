import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            devOptions: {
                enabled: true
            },
            includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
            manifest: {
                name: 'CVL - Hospitalização',
                short_name: 'CVL - Hospitalização',
                description: 'App para gestão dos paciente hospitalizados',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                icons: [
                    {
                        sizes: '192x192',
                        src: './src/assets/icons/cvl-192x192.png',
                        type: 'image/png'
                    },
                    {
                        sizes: '384x384',
                        src: './src/assets/icons/cvl-192x192.png',
                        type: 'image/png'
                    },
                    {
                        sizes: '512x512',
                        src: './src/assets/icons/cvl-192x192.png',
                        type: 'image/png'
                    }
                ],
                display: 'standalone'
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg}']
            }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
