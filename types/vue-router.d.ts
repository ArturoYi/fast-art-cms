import 'vue-router';
declare module 'vue-router' {
  interface RouteMeta {
    // 根据实际需求定义字段
    title: string; // 路由标题
    icon?: string; // 图标类名
    isHideTab?: boolean; // 是否隐藏
    isKeepAlive?: boolean; // 是否缓存组件
    isAffixTab?: boolean; // 是否固定在标签栏
    isIframeTab?: boolean; // 是否为iframe嵌套
    permission?: string[]; // 权限列表
  }
}
