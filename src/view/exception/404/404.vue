<script setup lang="ts">
import { NButton } from 'naive-ui';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

function goHome() {
  void router.push({ path: '/' });
}

function goBack() {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    router.back();
  } else {
    void router.push({ path: '/' });
  }
}
</script>

<template>
  <div class="not-found-page">
    <div
      class="not-found-page__glow"
      aria-hidden="true" />
    <div class="not-found-page__inner">
      <div class="not-found-page__code-wrap">
        <span
          class="not-found-page__code"
          aria-hidden="true"
          >404</span
        >
        <span
          class="not-found-page__code-shadow"
          aria-hidden="true"
          >404</span
        >
      </div>
      <h1 class="not-found-page__title">{{ t('exception.notFoundHeading') }}</h1>
      <p class="not-found-page__desc">
        {{ t('exception.notFoundDesc') }}
      </p>
      <div class="not-found-page__actions">
        <NButton
          type="primary"
          size="large"
          round
          @click="goHome">
          {{ t('exception.backHome') }}
        </NButton>
        <NButton
          size="large"
          round
          secondary
          @click="goBack">
          {{ t('exception.goBack') }}
        </NButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: max(1.25rem, env(safe-area-inset-top)) max(1.25rem, env(safe-area-inset-right))
    max(1.25rem, env(safe-area-inset-bottom)) max(1.25rem, env(safe-area-inset-left));
  box-sizing: border-box;
  background-color: var(--page-background-color);
  color: var(--neutral-text-base);
  overflow: hidden;
}

.not-found-page__glow {
  position: absolute;
  inset: -40% -20% auto;
  height: min(70vh, 520px);
  pointer-events: none;
  background: radial-gradient(
    ellipse 65% 55% at 50% 0%,
    color-mix(in srgb, var(--primary-color) 22%, transparent),
    transparent 72%
  );
  animation: glow-breathe 8s ease-in-out infinite;
}

.not-found-page__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 36rem;
  text-align: center;
}

.not-found-page__code-wrap {
  position: relative;
  display: inline-block;
  margin-bottom: clamp(0.75rem, 3vw, 1.5rem);
}

.not-found-page__code-shadow {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  font-weight: 800;
  font-size: clamp(3.5rem, 16vw, 9rem);
  line-height: 1;
  letter-spacing: -0.06em;
  user-select: none;
  transform: translate(0.08em, 0.1em);
  color: color-mix(in srgb, var(--neutral-text-base) 8%, transparent);
  z-index: 0;
}

.not-found-page__code {
  position: relative;
  z-index: 1;
  display: block;
  font-weight: 800;
  font-size: clamp(3.5rem, 16vw, 9rem);
  line-height: 1;
  letter-spacing: -0.06em;
  user-select: none;
  background: linear-gradient(
    120deg,
    var(--primary-color) 0%,
    var(--info-color) 45%,
    var(--primary-color-hover) 90%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation:
    code-shimmer 5s ease-in-out infinite alternate,
    code-float 4.5s ease-in-out infinite;
}

.not-found-page__title {
  margin: 0 0 0.75rem;
  font-size: clamp(1.05rem, 4vw, 1.35rem);
  font-weight: 600;
  color: color-mix(in srgb, var(--neutral-text-base) 92%, transparent);
}

.not-found-page__desc {
  margin: 0 auto 1.75rem;
  max-width: 26rem;
  font-size: clamp(0.8125rem, 3.2vw, 0.9375rem);
  line-height: 1.65;
  color: color-mix(in srgb, var(--neutral-text-base) 58%, transparent);
}

.not-found-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;
}

@keyframes code-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes code-shimmer {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

@keyframes glow-breathe {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.72;
  }
}

@media (max-width: 480px) {
  .not-found-page__actions {
    flex-direction: column;
    width: 100%;
  }

  .not-found-page__actions :deep(.n-button) {
    width: 100%;
    max-width: 280px;
  }
}
</style>
