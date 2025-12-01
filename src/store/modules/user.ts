import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { STORAGE_KEY_USER_INFO, StorageKeyManager } from "@/utils/storage";
import { LANGUAGE_ZH_CN } from "@/enums/appEnum";
import { computed } from "vue";

const key = StorageKeyManager.getStorageKey(STORAGE_KEY_USER_INFO);
export const useUserStore = defineStore(key, {
  state: () => {
    const user = useLocalStorage(key, {
      name: "张三",
      age: 20,
      accessToken: "",
      tags: ["user", "admin"],
      language: LANGUAGE_ZH_CN,
    });

    // 计算属性：是否已经登录
    const isLogin = computed(() => {
      return !!user.value.accessToken;
    });

    return {
      user,
      isLogin,
    };
  },
});
