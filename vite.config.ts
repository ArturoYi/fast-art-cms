/** @type {import('vite').UserConfig} */
import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const { VITE_PORT, VITE_OPEN, VITE_VERSION } = loadEnv(mode, process.cwd());
  return defineConfig({
    define: {
      __APP_VERSION__: JSON.stringify(VITE_VERSION)
    },
    plugins: [vue(), UnoCSS()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      port: Number(VITE_PORT),
      open: Boolean(VITE_OPEN)
    },
    build: {
      chunkSizeWarningLimit: 800,
      rolldownOptions: {
        output: {
          advancedChunks: {
            groups: [
              { name: 'vue', test: /[\\/]node_modules[\\/]vue[\\/]/ },
              { name: 'naive-ui', test: /[\\/]node_modules[\\/]naive-ui[\\/]/ },
              { name: 'tiptap', test: /[\\/]node_modules[\\/]@tiptap[\\/]/ },
              { name: 'vueuse', test: /[\\/]node_modules[\\/]@vueuse[\\/]/ },
              { name: 'vue-router', test: /[\\/]node_modules[\\/]vue-router[\\/]/ },
              { name: 'pinia', test: /[\\/]node_modules[\\/]pinia[\\/]/ },
              { name: 'vendor', test: /[\\/]node_modules[\\/]/ }
            ]
          }
        }
      }
    }
  });
});
