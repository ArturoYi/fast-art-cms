import { StorageConfig } from '@/utils';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export type PermissionMode = 'any' | 'all';

type PermissionState = {
  _permissions: string[];
  _loaded: boolean;
};

export const usePermissionStore = defineStore(StorageConfig.PERMISSION_KEY, {
  state: () =>
    useLocalStorage<PermissionState>(
      StorageConfig.PERMISSION_KEY,
      {
        _permissions: [],
        _loaded: false
      },
      {
        listenToStorageChanges: true,
        mergeDefaults: true
      }
    ),
  getters: {
    permissions: state => state._permissions,
    permissionSet: state => new Set(state._permissions),
    isLoaded: state => state._loaded
  },
  actions: {
    setPermissions(perms: string[]) {
      this._permissions = Array.from(new Set((perms ?? []).filter(Boolean)));
      this._loaded = true;
    },
    resetPermissions() {
      this._permissions = [];
      this._loaded = false;
    },
    hasPermission(code: string): boolean {
      if (!code) return true;
      return this.permissionSet.has(code);
    },
    hasAny(codes: string[]): boolean {
      if (!codes || codes.length === 0) return true;
      const set = this.permissionSet;
      return codes.some(c => set.has(c));
    },
    hasAll(codes: string[]): boolean {
      if (!codes || codes.length === 0) return true;
      const set = this.permissionSet;
      return codes.every(c => set.has(c));
    }
  }
});
