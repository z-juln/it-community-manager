import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

type IMode = 'development' | 'production' | ({} & string);

// https://vitejs.dev/config/
export default ({ mode }: { mode: IMode }) =>
  defineConfig({
    plugins: [react()],
    resolve: {
      alias: [
        { find: /^~/, replacement: '' }, // 处理less里面的 ~ 识别问题
        { find: '@', replacement: path.resolve(__dirname, 'src') },
      ],
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'primary-color': '#3169E8',
            '@link-color': '#3169E8',
            '@border-radius-base': '3px',
          },
          javascriptEnabled: true,
        },
      },
    },
    server: {
      open: 'http://127.0.0.1:3000/',
      proxy: {
        '^/api/.*': {
          target: 'http://127.0.0.1:3456',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    base: '/',
  });
