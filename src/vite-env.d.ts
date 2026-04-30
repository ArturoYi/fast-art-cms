/// <reference types="vite/client" />
interface ViteTypeOptions {
  // 添加这行代码，你就可以将 ImportMetaEnv 的类型设为严格模式，
  // 这样就不允许有未知的键值了。
  strictImportMetaEnv: true;
}

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string; // 基础URL
  readonly VITE_PORT: number; // 端口
  readonly VITE_OPEN: boolean; // 是否打开浏览器
  readonly VITE_REPORT: boolean; // 是否生成打包分析文件
  readonly VITE_VERSION: string; // 版本号
  /** 关于页：邮箱（会出现在前端打包产物中） */
  readonly VITE_ABOUT_EMAIL: string;
  /** 关于页：GitHub 主页或仓库完整 URL */
  readonly VITE_ABOUT_GITHUB: string;
  /** 关于页：微信号、公众号名或手机号等 */
  readonly VITE_ABOUT_WECHAT: string;
  /** 关于页：QQ 号（仅展示；可选跳转临时会话链接） */
  readonly VITE_ABOUT_QQ: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 全局变量声明
declare const __APP_VERSION__: string; // 应用版本号
// Vue Runes / Reactivity Transform 宏（供 $state 等使用）
declare function $state<T>(initial?: T): T;
