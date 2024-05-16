import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // 代理 API 请求到另一个服务器
      '/yk': {
        target: 'http://1.202.169.153:8890', // 后端目标接口地址
        changeOrigin: true, // 必须设置为true，需要虚拟主机站点
        // rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})

