import { defineConfig } from 'vite';
import * as path from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
      { find: '@game', replacement: path.resolve(__dirname, 'src/game') },
      { find: '@stores', replacement: path.resolve(__dirname, 'src/stores') },
      { find: '@lib', replacement: path.resolve(__dirname, 'src/lib') },
    ],
  },
})
