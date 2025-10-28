import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    '@pinia/nuxt',
    'shadcn-nuxt'
  ],
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'https://api.zcondo.com.br', //'https://api.zcondo.com.br' 'http://localhost:5000' 'https://localhost:7275'
    }
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  // Configuração para rodar com HTTPS no ambiente de desenvolvimento
  // devServer: {
  //   https: {
  //     key: fs.readFileSync(
  //       path.resolve('C:/Users/renzo/.certs/localhost-key.pem'),
  //       'utf-8'
  //     ),
  //     cert: fs.readFileSync(
  //       path.resolve('C:/Users/renzo/.certs/localhost.pem'),
  //       'utf-8'
  //     )
  //   },
  //   host: 'localhost',
  //   port: 3000
  // },
  // nitro: {
  //   devProxy: {
  //     '/api': {
  //       target: 'https://api.zcondo.com.br',
  //       changeOrigin: true,
  //       secure: false
  //     }
  //   }
  // },
})
