import type { AppRouteRecord } from '@/router/router';
import type { MenuMixedOption } from 'naive-ui/es/menu/src/interface';
import { NIcon, NEllipsis } from 'naive-ui';
import { h } from 'vue';
import { RouterLink } from 'vue-router';

export class MenuProcessor {
  private static instance: MenuProcessor | null = null;
  private registered = false;
  private menuList: MenuMixedOption[] = [];

  private constructor() {}

  /**
   * 将 AppRouteRecord 转换为 MenuMixedOption
   * @param route AppRouteRecord
   * @returns MenuMixedOption
   */
  private convertToMenuMixedOption(route: AppRouteRecord): MenuMixedOption {
    const { icon, type, title } = route.meta;

    /**
     * 判断是否有icon，如果有，则转换为函数
     */
    const renderIcon = icon ? () => h(NIcon, null, { default: () => h(icon) }) : undefined;

    /**
     * 如果有children，children转换为MenuMixedOption
     */
    const children = route.children ? route.children.map(child => this.convertToMenuMixedOption(child)) : undefined;

    /**
     * label转换为函数，使用RouterLink包裹，并使用NEllipsis处理文本溢出
     */
    const renderLabel = () =>
      h(NEllipsis, null, {
        default: () =>
          h(
            RouterLink,
            { to: route.path },
            {
              default: () => title
            }
          )
      });

    return {
      type: type || 'item',
      label: renderLabel,
      key: String(route.path) + String(route.name),
      icon: renderIcon,
      meta: {},
      children: children
    };
  }

  /**
   * 注册菜单列表
   * 因为routes都是本地配置，所以不需要更多验证，如果要动态下发，需要添加验证
   * @param routes 路由配置
   */
  registerMenuList(routes: AppRouteRecord[]) {
    // 1. 如果已经注册过，则直接返回
    if (this.registered) {
      return;
    }
    this.menuList.length = 0;

    routes.forEach(route => {
      this.menuList.push(this.convertToMenuMixedOption(route));
    });
    this.registered = true;
  }

  /**
   * 获取菜单列表
   * @returns MenuMixedOption[]
   */
  getMenuList() {
    return this.menuList;
  }

  /**
   * 注销菜单列表
   */
  unregisterMenuList() {
    this.menuList = [];
    this.registered = false;
  }

  /**
   * 检查是否已经注册过
   * @returns boolean
   */
  isRegistered() {
    return this.registered;
  }

  /**
   * 获取单例实例
   * @returns MenuProcessor
   */
  static getInstance(): MenuProcessor {
    if (!MenuProcessor.instance) {
      MenuProcessor.instance = new MenuProcessor();
    }
    return MenuProcessor.instance;
  }
}
