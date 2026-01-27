# Fast Art CMS

![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Rolldown-646CFF?logo=vite)
![Naive UI](https://img.shields.io/badge/Naive%20UI-2.43-18A058)
![Oxc](https://img.shields.io/badge/Oxc-Tools-yellow)

Fast Art CMS 是一个基于 **Vue 3** + **TypeScript** + **Vite** 的现代化后台管理系统模板。它集成了高性能的 **Oxc** 工具链（Linter, Formatter）和 **Rolldown** 打包器，旨在提供极致的开发体验和运行性能。

本项目不仅是一个开箱即用的 CMS 框架，也是学习 Vue 3 Composition API、TypeScript 高级用法以及前端工程化最佳实践的优秀示例。

## ✨ 特性

- **⚡️ 极致性能**: 采用 Vite + Rolldown 构建，配合 Oxc 工具链（比 ESLint 快 50-100 倍，比 Prettier 快 30 倍），秒级启动与热更新。
- **🏗️ 现代化架构**: 全面使用 Vue 3 Composition API (`<script setup>`)，结合 Pinia 状态管理和 Vue Router 4。
- **🎨 优雅 UI**: 集成 **Naive UI** 组件库，配合 **UnoCSS** 原子化 CSS 引擎，支持属性化模式 (`Attributify Mode`)。
- **🌗 主题系统**: 内置完善的亮色/暗色主题切换机制，自动适配系统偏好。
- **🌍 国际化**: 内置 Vue I18n，支持多语言切换（已包含中文、英文、阿拉伯语），支持 RTL 布局。
- **📱 响应式布局**: 自动适配桌面端和移动端，提供流畅的跨设备体验。
- **🛠️ 完善封装**:
  - **API 层**: 基于 Fetch 的统一请求封装，包含拦截器、错误处理（401/403/404/500）、DTO 类型定义。
  - **Hooks**: 封装常用的 Composition API Hooks (`useRequest`, `useTheme`, `useLanguage` 等)。
  - **路由**: 动态路由注册与菜单生成自动化处理。

## 📦 技术栈

| 模块          | 技术                                            | 说明                                      |
| ------------- | ----------------------------------------------- | ----------------------------------------- |
| **核心框架**  | [Vue 3](https://vuejs.org/)                     | Composition API, `<script setup>`         |
| **构建工具**  | [Vite](https://vitejs.dev/)                     | 集成 Rolldown 打包器                      |
| **语言**      | [TypeScript](https://www.typescriptlang.org/)   | 强类型支持，使用 `vue-tsc` 进行类型检查   |
| **UI 组件库** | [Naive UI](https://www.naiveui.com/)            | Vue 3 组件库                              |
| **CSS 引擎**  | [UnoCSS](https://unocss.dev/)                   | 高性能原子化 CSS                          |
| **状态管理**  | [Pinia](https://pinia.vuejs.org/)               | 轻量级状态管理                            |
| **路由**      | [Vue Router](https://router.vuejs.org/)         | 路由管理                                  |
| **国际化**    | [Vue I18n](https://kazupon.github.io/vue-i18n/) | 多语言支持                                |
| **代码规范**  | [Oxc](https://oxc.rs/)                          | `oxlint` (Linting) + `oxfmt` (Formatting) |
| **Git 规范**  | Husky + Commitlint                              | Git Hooks 与提交规范                      |

## 📂 目录结构

```
src/
├── api/                # API 请求层
│   ├── client/         # 业务 API 定义 (DTO, Services)
│   └── feachHook/      # Fetch 封装与 Hooks
├── assets/             # 静态资源与全局样式
├── components/         # 全局通用组件 (Breadcrumb, Logo, etc.)
├── hook/               # 通用 Hooks (useTheme, useLanguage)
├── injection/          # 依赖注入 Key 定义
├── layout/             # 布局组件 (Header, Sidebar, Footer)
├── locale/             # 国际化语言包
├── router/             # 路由配置与守卫
│   ├── core/           # 路由核心逻辑 (MenuProcessor)
│   └── routes/         # 路由表定义
├── store/              # Pinia 状态仓库
├── theme/              # 主题配置 (Colors, Dark/Light modes)
├── utils/              # 工具函数 (Storage, Message)
└── view/               # 页面视图
    ├── auth/           # 认证相关页面
    ├── dashboard/      # 仪表盘
    └── ...
```

## 🚀 快速开始

### 1. 环境准备

- Node.js >= 18
- pnpm >= 8 (推荐)

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发服务器

```bash
pnpm dev
```

### 4. 构建生产版本

```bash
pnpm build
```

### 5. 代码检查与格式化

```bash
# Lint 检查
pnpm lint

# Lint 自动修复
pnpm lint:fix

# 代码格式化
pnpm format

# 检查格式
pnpm format:check
```

## 🧩 开发指南

### 新增页面

1.  在 `src/view/` 下创建页面组件。
2.  在 `src/router/routes/asyncRoutes/module/` 下添加路由配置。
3.  路由配置会自动注册到菜单中（通过 `MenuProcessor`）。

### API 调用

项目采用 DTO (Data Transfer Object) 模式规范前后端数据交互：

1.  在 `src/api/client/DTO/` 定义接口返回类型。
2.  在 `src/api/client/index.ts` 导出服务函数。
3.  在组件中使用 `useRequest` 调用：

```typescript
import { useRequest } from '@/api/feachHook/useRequest';
import { someService } from '@/api/client';

const { data, loading, error } = useRequest(someService);
```

### 样式开发

推荐使用 UnoCSS 原子类进行样式开发，支持属性化写法：

```vue
<!-- 示例 -->
<div flex items-center justify-between p-4 bg-neutral-card>
  <span text-primary text-lg>Content</span>
</div>
```

主题颜色变量定义在 `uno.config.ts` 和 `src/theme/` 中，使用 CSS 变量（如 `var(--primary-color)`）实现动态换肤。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！提交代码前请确保通过 lint 和 format 检查。
