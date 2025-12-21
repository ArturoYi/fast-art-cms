import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useScreenOrientation } from '@vueuse/core';

// 辅助函数：获取设备类型
function getDeviceType(width: number): DeviceType {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTabletUA = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
  // 基于屏幕宽度和用户代理判断设备类型
  if (width < 768 || isMobileUA) {
    return 'mobile';
  } else if ((width >= 768 && width < 1024) || isTabletUA) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

// 辅助函数：获取屏幕方向
function getScreenOrientation(orientation: any, screenWidth: number, screenHeight: number): ScreenOrientation {
  // 优先使用设备方向 API
  if (orientation && typeof orientation === 'string') {
    return orientation.includes('landscape') ? 'landscape' : 'portrait';
  }
  // 降级使用屏幕尺寸判断
  return screenWidth > screenHeight ? 'landscape' : 'portrait';
}

/**
 * 设备类型
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * 屏幕方向
 */
export type ScreenOrientation = 'portrait' | 'landscape';

/**
 * 设备信息 Store
 *
 * @description
 * 全局管理设备信息，包括设备类型和屏幕方向。
 * 使用单例模式确保只有一个实例，避免重复监听。
 */
export const useDeviceStore = defineStore('device', {
  state: () => {
    // 屏幕尺寸状态
    const screenWidth = ref(window.innerWidth);
    const screenHeight = ref(window.innerHeight);
    // 使用 VueUse 的屏幕方向 hook
    const { orientation } = useScreenOrientation();
    // 只在 store 初始化时添加一次监听器
    window.addEventListener('resize', () => {
      screenWidth.value = window.innerWidth;
      screenHeight.value = window.innerHeight;
    });
    return {
      screenWidth,
      screenHeight,
      orientation
    };
  },
  getters: {
    /**
     * 检测设备类型
     */
    deviceType: state => getDeviceType(state.screenWidth),
    /**
     * 屏幕方向
     */
    screenOrientation: state => getScreenOrientation(state.orientation, state.screenWidth, state.screenHeight),
    // 基于设备类型的便捷属性
    isMobile: state => getDeviceType(state.screenWidth) === 'mobile',
    isTablet: state => getDeviceType(state.screenWidth) === 'tablet',
    isDesktop: state => getDeviceType(state.screenWidth) === 'desktop',
    // 基于屏幕方向的便捷属性
    isPortrait: state => getScreenOrientation(state.orientation, state.screenWidth, state.screenHeight) === 'portrait',
    isLandscape: state => getScreenOrientation(state.orientation, state.screenWidth, state.screenHeight) === 'landscape'
  }
});
