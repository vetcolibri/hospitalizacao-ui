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
            strategies: "injectManifest",
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
                        src: './img/cvl-192x192.png',
                        type: 'image/png'
                    },
                    {
                        sizes: '384x384',
                        src: './img/cvl-384x384.png',
                        type: 'image/png'
                    },
                    {
                        sizes: '512x512',
                        src: './img/cvl-512x512.png',
                        type: 'image/png'
                    }
                ],
                screenshots: [
                    {
                        src: './img/cvl-320x320.png',
                        type: 'image/png',
                        sizes: '320x320',
                        form_factor: 'wide'
                    },
                ],
                display_override: ['fullscreen', 'standalone'],
                display: 'fullscreen'
            },
            workbox: {
                cleanupOutdatedCaches: true,
            }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
