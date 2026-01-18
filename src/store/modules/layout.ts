import { defineStore } from 'pinia';

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    // 桌面端侧边栏是否折叠
    _collapsed: false,
    // 移动端抽屉是否显示
    _mobileDrawerVisible: false,
    // 移动端设置抽屉是否显示
    _mobileSettingsDrawerVisible: false
  }),
  getters: {
    // 获取桌面端侧边栏折叠状态
    isCollapsed: state => state._collapsed,
    // 获取移动端抽屉显示状态
    isMobileDrawerVisible: state => state._mobileDrawerVisible,
    // 获取移动端设置抽屉显示状态
    isMobileSettingsDrawerVisible: state => state._mobileSettingsDrawerVisible
  },
  actions: {
    // 设置桌面端侧边栏折叠状态
    setCollapsed(collapsed: boolean) {
      this._collapsed = collapsed;
    },
    // 切换桌面端侧边栏折叠状态
    toggleCollapsed() {
      this._collapsed = !this._collapsed;
    },
    // 设置移动端抽屉显示状态
    setMobileDrawerVisible(visible: boolean) {
      this._mobileDrawerVisible = visible;
    },
    // 打开移动端抽屉
    openMobileDrawer() {
      this._mobileDrawerVisible = true;
    },
    // 关闭移动端抽屉
    closeMobileDrawer() {
      this._mobileDrawerVisible = false;
    },
    // 切换移动端抽屉显示状态
    toggleMobileDrawer() {
      this._mobileDrawerVisible = !this._mobileDrawerVisible;
    },
    // 设置移动端设置抽屉显示状态
    setMobileSettingsDrawerVisible(visible: boolean) {
      this._mobileSettingsDrawerVisible = visible;
    },
    // 打开移动端设置抽屉
    openMobileSettingsDrawer() {
      this._mobileSettingsDrawerVisible = true;
    },
    // 关闭移动端设置抽屉
    closeMobileSettingsDrawer() {
      this._mobileSettingsDrawerVisible = false;
    },
    // 切换移动端设置抽屉显示状态
    toggleMobileSettingsDrawer() {
      this._mobileSettingsDrawerVisible = !this._mobileSettingsDrawerVisible;
    }
  }
});
