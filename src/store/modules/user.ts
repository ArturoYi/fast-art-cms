import { StorageConfig } from '@/utils';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useUserStore = defineStore(StorageConfig.USER_KEY, {
  state: () =>
    useLocalStorage(
      StorageConfig.USER_KEY,
      {
        accessToken: ''
      },
      {
        listenToStorageChanges: true,
        mergeDefaults: true
      }
    ),
  getters: {
    isLogin: state => state.accessToken !== ''
  },
  actions: {
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken;
    },
    logout() {
      this.accessToken = '';
    }
  }
});
