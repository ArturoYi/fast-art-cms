<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useRequest } from "@/api/hook/useRequest";
import { loginService } from "@/api/client";

const form = reactive({
  username: "",
  password: "",
});

const errorMsg = ref("");

const canSubmit = computed(() => {
  return form.username.trim().length > 0 && form.password.trim().length > 0;
});

const { run, loading } = useRequest(loginService, {
  manual: true,
  defaultParams: [form],
  loadingKeep: 3000,
  onSuccess: (data) => {
    console.log(data);
  },
  onError: (error) => {
    console.log(error);
  },
});

async function handleLogin() {
  if (!canSubmit.value) return;
  run(form);
}
</script>

<template>
  <div
    class="login-container flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4"
  >
    <div
      class="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      <div class="text-center space-y-2">
        <div class="flex justify-center mb-4">
          <img src="/vite.svg" alt="Logo" class="h-12 w-12 animate-bounce-in" />
        </div>
        <h1
          class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          欢迎回来
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          请输入您的账号和密码登录系统
        </p>
      </div>

      <form class="space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div class="space-y-1">
            <label
              for="username"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              账号
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              placeholder="请输入用户名"
              class="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200"
              :disabled="loading"
            />
          </div>

          <div class="space-y-1">
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              密码
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              class="appearance-none block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200"
              :disabled="loading"
              autocomplete="current-password"
            />
          </div>
        </div>

        <div
          v-if="errorMsg"
          class="text-red-500 text-sm text-center animate-shake"
        >
          {{ errorMsg }}
        </div>

        <button
          type="submit"
          class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          :disabled="!canSubmit || loading"
        >
          <span
            v-if="loading"
            class="i-svg-spinners:90-ring-with-bg mr-2"
          ></span>
          {{ loading ? "登录中..." : "登录" }}
        </button>
      </form>

      <div class="text-center text-xs text-gray-400 mt-4">
        <span>还没有账号？</span>
        <a
          href="#"
          class="text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
          >立即注册</a
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-bounce-in {
  animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
