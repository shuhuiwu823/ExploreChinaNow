import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      },
      '/auth': {
        target: 'http://localhost:4000',
      },
    },
  },
  // 添加 Vitest 配置
  test: {
    globals: true, // 启用 Vitest 的全局 API (如 describe、test)
    environment: 'jsdom', // 设置测试环境为 jsdom
    setupFiles: './src/test/setup.js', // 指定全局设置文件的路径
    include: ['**/test/**/*.{test,spec}.{js,ts,jsx,tsx}'], // 指定测试文件的匹配规则
  },
});
