/** @type {import('vite').UserConfig} */ // 为编辑器/IDE 提供类型提示（即使在 TS 中也无害）
import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from "vite"; // 从 vite 导入配置函数与类型
import path from "path"; // 引入 path 模块以处理路径
import { createVitePlugins } from "./vite.config/plugins/vite.config.plugins";

// https://vite.dev/config/ // 官方配置文档入口
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  // 使用 defineConfig 导出配置；带命令与模式参数
  const { VITE_PORT, VITE_OPEN, VITE_VERSION } = loadEnv(mode, process.cwd());
  return defineConfig({
    // 返回 Vite 配置对象
    plugins: createVitePlugins(),
    define: {
      __APP_VERSION__: JSON.stringify(VITE_VERSION),
    },
    server: {
      // 开发服务器相关配置
      port: Number(VITE_PORT), // 指定本地开发端口
      host: "0.0.0.0",
      open: VITE_OPEN, // 设为 true 时自动打开浏览器
      strictPort: false, // 设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口
    }, // 结束 server 配置
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        // 其他常用别名（根据项目结构添加）
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@store": path.resolve(__dirname, "./src/store"),
        "@enums": path.resolve(__dirname, "./src/enums"),
      },
    },
  }); // 结束配置对象
}); // 结束 defineConfig 调用并导出默认配置
