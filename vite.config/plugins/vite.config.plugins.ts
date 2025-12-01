import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

export function createVitePlugins(): PluginOption[] {
  const plugins: PluginOption[] = [
    vue(),
    UnoCSS(),
  ]
  return plugins
}

