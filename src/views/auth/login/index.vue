<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useRequest } from "@/api/hook/useRequest";
import { loginService } from "@/api/client";
import { themeAnimation } from "@/utils/ui/animation";
import { $t, languageOptions } from "@/i18n";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();
// i18n 实例
const { locale } = useI18n();

// 语言切换状态
const showLanguageMenu = ref(false);

// 当前语言信息（用于比较是否为当前语言）
const isCurrentLanguage = (languageValue: string) =>
  languageValue === locale.value;

// 切换语言菜单显示
function toggleLanguageMenu() {
  showLanguageMenu.value = !showLanguageMenu.value;
}

// 切换语言
function switchLanguage(languageValue: string) {
  if (languageValue !== locale.value) {
    locale.value = languageValue;
    userStore.setLanguage(languageValue);
    showLanguageMenu.value = false;
  }
}

// 点击其他地方关闭菜单
function closeLanguageMenu() {
  if (showLanguageMenu.value) {
    showLanguageMenu.value = false;
  }
}

// 表单数据
const form = reactive({
  username: "",
  password: "",
});

// 错误信息
const errorMsg = ref("");
const fieldErrors = reactive({
  username: "",
  password: "",
});

// 验证规则类型定义
interface ValidationRule {
  required: boolean;
  minLength: number;
  maxLength: number;
  pattern?: RegExp;
  messages: {
    required: string;
    minLength: string;
    maxLength: string;
    pattern?: string;
  };
}

// 验证规则
const validationRules: Record<keyof typeof form, ValidationRule> = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    messages: {
      required: "auth.login.validation.username.required",
      minLength: "auth.login.validation.username.minLength",
      maxLength: "auth.login.validation.username.maxLength",
      pattern: "auth.login.validation.username.pattern",
    },
  },
  password: {
    required: true,
    minLength: 6,
    maxLength: 32,
    messages: {
      required: "auth.login.validation.password.required",
      minLength: "auth.login.validation.password.minLength",
      maxLength: "auth.login.validation.password.maxLength",
    },
  },
};

// 字段验证函数
function validateField(
  field: keyof typeof validationRules,
  value: string
): string {
  const rules = validationRules[field];
  const trimmedValue = value.trim();

  // 必填验证
  if (rules.required && !trimmedValue) {
    return rules.messages.required;
  }

  // 最小长度验证
  if (rules.minLength && trimmedValue.length < rules.minLength) {
    return rules.messages.minLength;
  }

  // 最大长度验证
  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    return rules.messages.maxLength;
  }

  // 正则验证
  if (
    rules.pattern &&
    rules.messages.pattern &&
    !rules.pattern.test(trimmedValue)
  ) {
    return rules.messages.pattern;
  }

  return "";
}

// 表单验证函数
function validateForm(): boolean {
  let isValid = true;

  // 清空之前的错误
  errorMsg.value = "";
  Object.keys(fieldErrors).forEach((key) => {
    fieldErrors[key as keyof typeof fieldErrors] = "";
  });

  // 验证用户名
  const usernameError = validateField("username", form.username);
  if (usernameError) {
    fieldErrors.username = usernameError;
    isValid = false;
  }

  // 验证密码
  const passwordError = validateField("password", form.password);
  if (passwordError) {
    fieldErrors.password = passwordError;
    isValid = false;
  }

  return isValid;
}

// 计算属性：表单是否有基本内容（用于按钮样式提示）
const hasBasicContent = computed(() => {
  return form.username.trim().length > 0 && form.password.trim().length > 0;
});

// API请求
const { run, loading } = useRequest(loginService, {
  manual: true,
  defaultParams: [form],
  loadingKeep: 500,
  onSuccess: (data) => {
    console.log("Login Success:", data);
    // TODO: 跳转首页
  },
  onError: (error) => {
    console.error("Login Error:", error);
    errorMsg.value = "auth.login.error.loginFailed";
  },
});

// 提交处理函数
async function handleLogin() {
  // 表单验证
  if (!validateForm()) {
    // 验证失败，不阻止用户操作，让他们看到错误信息并修正
    return;
  }

  // 清空错误信息
  errorMsg.value = "";

  // 提交表单
  run(form);
}

// 实时验证函数（失去焦点时触发）
function validateOnBlur(field: keyof typeof validationRules) {
  const error = validateField(field, form[field]);
  fieldErrors[field] = error;
}
</script>

<template>
  <div
    class="login-container relative flex items-center justify-center min-h-[100dvh] bg-gray-100 dark:bg-gray-900 transition-colors duration-300 sm:px-6 md:px-8"
    @click="closeLanguageMenu"
  >
    <!-- 右上角操作按钮组 -->
    <div class="absolute top-4 right-4 flex items-center space-x-2">
      <!-- 语言切换按钮 -->
      <div class="relative">
        <button
          class="p-2.5 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 transition-all duration-300 focus:outline-none"
          @click.stop="toggleLanguageMenu"
          :title="$t('common.language')"
        >
          <!-- 语言图标 -->
          <span class="text-xl">🌐</span>
        </button>

        <!-- 语言选择菜单 -->
        <div
          v-show="showLanguageMenu"
          class="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
        >
          <button
            v-for="lang in languageOptions"
            :key="lang.value"
            class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :class="
              isCurrentLanguage(lang.value)
                ? 'text-blue-600 dark:text-blue-400 font-medium'
                : 'text-gray-700 dark:text-gray-300'
            "
            @click="switchLanguage(lang.value)"
          >
            {{ lang.label }}
            <span v-if="isCurrentLanguage(lang.value)" class="ml-2">✓</span>
          </button>
        </div>
      </div>

      <!-- 主题切换按钮 -->
      <button
        class="p-2.5 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 transition-all duration-300 focus:outline-none"
        @click="themeAnimation"
        :title="$t('common.theme')"
      >
        <!-- 太阳图标 (亮色模式显示) -->
        <div class="i-tabler-sun text-xl dark:hidden" />
        <!-- 月亮图标 (暗色模式显示) -->
        <div class="i-tabler-moon text-xl hidden dark:block" />
      </button>
    </div>

    <div
      class="scroll-container w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl transition-all duration-300"
    >
      <div class="text-center space-y-2 sm:space-y-3">
        <h1
          class="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          {{ $t("auth.login.title") }}
        </h1>
        <p
          class="text-sm sm:text-base text-gray-500 dark:text-gray-400 px-2 sm:px-0"
        >
          {{ $t("auth.login.description") }}
        </p>
      </div>

      <form class="space-y-9" @submit.prevent="handleLogin">
        <div class="space-y-7">
          <div class="space-y-2">
            <label
              for="username"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ $t("auth.login.username.label") }}
            </label>
            <div class="relative">
              <input
                id="username"
                v-model="form.username"
                type="text"
                :placeholder="$t('auth.login.username.placeholder')"
                :class="[
                  'block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm bg-white dark:bg-gray-700 dark:text-white transition-all duration-200',
                  fieldErrors.username
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500',
                ]"
                :disabled="loading"
                @blur="validateOnBlur('username')"
              />
              <!-- 字段错误提示 - 绝对定位，不占用布局空间 -->
              <div
                class="absolute left-0 top-full mt-1 text-red-500 text-xs transition-all duration-300 ease-out pointer-events-none z-10"
                :class="
                  fieldErrors.username
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-1'
                "
              >
                {{ fieldErrors.username ? $t(fieldErrors.username) : "" }}
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ $t("auth.login.password.label") }}
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                type="password"
                :placeholder="$t('auth.login.password.placeholder')"
                :class="[
                  'block w-full px-4 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm bg-white dark:bg-gray-700 dark:text-white transition-all duration-200',
                  fieldErrors.password
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500',
                ]"
                :disabled="loading"
                autocomplete="current-password"
                @blur="validateOnBlur('password')"
              />
              <!-- 字段错误提示 - 绝对定位，不占用布局空间 -->
              <div
                class="absolute left-0 top-full mt-1 text-red-500 text-xs transition-all duration-300 ease-out pointer-events-none z-10"
                :class="
                  fieldErrors.password
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-1'
                "
              >
                {{ fieldErrors.password ? $t(fieldErrors.password) : "" }}
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="errorMsg"
          class="text-red-500 text-sm text-center animate-shake bg-red-50 dark:bg-red-900/20 py-2 rounded"
        >
          {{ errorMsg ? $t(errorMsg) : "" }}
        </div>

        <button
          type="submit"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white transition-all duration-200 transform active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2"
          :class="[
            hasBasicContent && !loading
              ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              : 'bg-gray-400 cursor-not-allowed focus:ring-gray-300',
          ]"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="i-svg-spinners:90-ring-with-bg mr-2 text-lg"
          ></span>
          {{
            loading
              ? $t("auth.login.button.loggingIn")
              : $t("auth.login.button.login")
          }}
        </button>
      </form>

      <div class="text-center text-xs text-gray-400 mt-6">
        <span>{{ $t("auth.login.register.text") }}</span>
        <a
          href="#"
          class="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium transition-colors ml-1"
          >{{ $t("auth.login.register.link") }}</a
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-bounce-in {
  animation: bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
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

/* 错误提示的平滑过渡动画已内联实现 */

/* 登录页面特定样式优化 */

/* 语言菜单动画 */
.language-menu-enter-active,
.language-menu-leave-active {
  transition: all 0.2s ease;
}

.language-menu-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.language-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
</style>
