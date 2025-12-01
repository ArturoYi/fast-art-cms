import { createApp } from "vue"; // 引入 createApp 函数
import "./style.css"; // 引入全局样式
import App from "./App.vue"; // 引入 App 组件
import "virtual:uno.css"; // 引入 UnoCSS
import "@unocss/reset/sanitize/sanitize.css"; // 引入 UnoCSS 重置样式
import "@unocss/reset/sanitize/assets.css"; // 引入 UnoCSS 重置样式
import i18n from "./i18n"; // 引入 i18n 插件
import { pinia } from "./store"; // 引入 pinia
import { initRouter } from "./router"; // 引入 router

const app = createApp(App); // 创建 App 实例

// 初始化 i18n，懒加载默认语言包
app.use(i18n).use(pinia); // 使用 i18n 插件和 pinia 插件
initRouter(app);
app.mount("#app"); // 挂载 App 组件
