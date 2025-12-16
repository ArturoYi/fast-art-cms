/** @type {import('vite').UserConfig} */
import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const { VITE_PORT, VITE_OPEN, VITE_VERSION } = loadEnv(mode, process.cwd());
  return defineConfig({
    define: {
      __APP_VERSION__: JSON.stringify(VITE_VERSION)
    },
    plugins: [vue()],
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
      rolldownOptions: {
        output: {
          advancedChunks: {
            groups: [
              {
                name: 'vueuse',
                test: /\/vueuse/
              },
              {
                name: 'vue',
                test: /\/vue/
              },
              {
                name: 'naive-ui',
                test: /\/naive-ui/
              },
              {
                name: 'vue-router',
                test: /\/vue-router/
              },
              {
                name: 'pinia',
                test: /\/pinia/
              }
            ]
          }
        }
      }
    }
  });
});
