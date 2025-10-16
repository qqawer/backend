import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 确保打包后资源路径正确
  build: {
    outDir: 'dist', // 打包输出目录（默认即可）
  },
  server: {
    proxy: {
      // 开发时代理API请求到Spring Boot（避免跨域，仅开发用）
      '/api': {
        target: 'http://localhost:8080/', // Spring Boot服务地址
        changeOrigin: true,
      },
    },
  },
});