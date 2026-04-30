<script setup lang="ts">
import { aboutTimeline } from '@/config/aboutTimeline';
import { NAlert, NCard, NDivider, NEmpty, NScrollbar, NSpace } from 'naive-ui';
import {
  Book,
  BrandGithub,
  CalendarEvent,
  Hammer,
  Heart,
  Mail,
  MessageCircle,
  Messages
} from '@vicons/tabler';
import type { Component } from 'vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

function aboutEnv(key: 'VITE_ABOUT_EMAIL' | 'VITE_ABOUT_GITHUB' | 'VITE_ABOUT_WECHAT' | 'VITE_ABOUT_QQ'): string {
  const v = import.meta.env[key];
  return typeof v === 'string' ? v.trim().replace(/^["']|["']$/g, '') : '';
}

/** 纯数字视为可拨打手机号 */
function isDialablePhone(s: string): boolean {
  return /^\d{6,20}$/.test(s);
}

function normalizeGithubHref(raw: string): string | undefined {
  if (!raw) return undefined;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw.replace(/^\/+/, '')}`;
}

function qqTempChatHref(qq: string): string | undefined {
  if (!/^\d{5,12}$/.test(qq)) return undefined;
  return `https://wpa.qq.com/msgrd?v=3&uin=${qq}&site=qq&menu=yes`;
}

const directions = computed(() => [
  t('aboutPage.directionEssay'),
  t('aboutPage.directionTech'),
  t('aboutPage.directionWorks'),
  t('aboutPage.directionLife')
]);

const buildRows = computed(() => [
  { label: t('aboutPage.buildStack'), value: t('aboutPage.buildStackValue') },
  { label: t('aboutPage.buildTheme'), value: t('aboutPage.buildThemeValue') },
  { label: t('aboutPage.buildHosting'), value: t('aboutPage.buildHostingValue') },
  { label: t('aboutPage.buildSince'), value: t('aboutPage.buildSinceValue') },
  { label: t('aboutPage.buildPhilosophy'), value: t('aboutPage.buildPhilosophyValue') }
]);

type ContactKind = 'email' | 'github' | 'wechat' | 'qq';

type ContactRow = {
  kind: ContactKind;
  label: string;
  value: string;
  href?: string;
  icon: Component;
};

const contactRows = computed((): ContactRow[] => {
  const email = aboutEnv('VITE_ABOUT_EMAIL');
  const githubRaw = aboutEnv('VITE_ABOUT_GITHUB');
  const wechat = aboutEnv('VITE_ABOUT_WECHAT');
  const qq = aboutEnv('VITE_ABOUT_QQ');

  const rows: ContactRow[] = [];

  if (email) {
    rows.push({
      kind: 'email',
      label: t('aboutPage.contactEmail'),
      value: email,
      href: `mailto:${email}`,
      icon: Mail
    });
  }
  if (githubRaw) {
    const href = normalizeGithubHref(githubRaw);
    rows.push({
      kind: 'github',
      label: t('aboutPage.contactGithub'),
      value: githubRaw,
      href,
      icon: BrandGithub
    });
  }
  if (wechat) {
    const href = isDialablePhone(wechat) ? `tel:${wechat}` : undefined;
    rows.push({
      kind: 'wechat',
      label: t('aboutPage.contactWechat'),
      value: wechat,
      href,
      icon: MessageCircle
    });
  }
  if (qq) {
    rows.push({
      kind: 'qq',
      label: t('aboutPage.contactQq'),
      value: qq,
      href: qqTempChatHref(qq),
      icon: Messages
    });
  }

  return rows;
});

const hasContacts = computed(() => contactRows.value.length > 0);

const milestones = aboutTimeline;
</script>

<template>
  <div class="about-view h-full min-h-0">
    <NScrollbar class="h-full">
      <div
        p-6
        pb-10
        max-w-48rem
        mx-auto
        flex
        flex-col
        gap-4>
        <header>
          <h1
            text-2xl
            font-semibold
            m-0
            leading-tight>
            {{ t('aboutPage.pageLead') }}
          </h1>
        </header>

        <NCard :title="t('aboutPage.siteTitle')">
          <template #header-extra>
            <Book
              w-5
              h-5
              op-60 />
          </template>
          <p
            m-0
            mb-4
            text-15px
            leading-7
            op-90>
            {{ t('aboutPage.siteBody') }}
          </p>
          <div
            text-sm
            font-medium
            op-80
            mb-2>
            {{ t('aboutPage.directionTitle') }}
          </div>
          <ul
            m-0
            pl-5
            space-y-1
            text-15px
            leading-7
            op-90>
            <li
              v-for="(item, i) in directions"
              :key="i">
              {{ item }}
            </li>
          </ul>
        </NCard>

        <NCard :title="t('aboutPage.buildTitle')">
          <template #header-extra>
            <Hammer
              w-5
              h-5
              op-60 />
          </template>
          <dl class="m-0 flex flex-col gap-4">
            <div
              v-for="(row, i) in buildRows"
              :key="i">
              <dt class="m-0 mb-1 text-sm font-medium op-80">
                {{ row.label }}
              </dt>
              <dd class="m-0 text-15px leading-7 op-90">
                {{ row.value }}
              </dd>
            </div>
          </dl>
        </NCard>

        <NCard :title="t('aboutPage.contactTitle')">
          <template #header-extra>
            <Mail
              w-5
              h-5
              op-60 />
          </template>
          <p
            m-0
            mb-4
            text-15px
            leading-7
            op-90>
            {{ t('aboutPage.contactIntro') }}
          </p>
          <NEmpty
            v-if="!hasContacts"
            :description="t('aboutPage.contactNone')"
            op-80 />
          <div
            v-else
            class="grid grid-cols-1 gap-4 gap-x-5 min-[36rem]:grid-cols-2">
            <div
              v-for="(row, i) in contactRows"
              :key="i"
              class="flex min-w-0 items-start gap-3">
              <div
                class="box-border mt-0.5 h-10 w-10 flex shrink-0 items-center justify-center rounded-full border border-solid"
                :class="`brand-contact-chip--${row.kind}`">
                <component
                  :is="row.icon"
                  class="brand-contact-icon h-5 w-5" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="mb-1 text-sm font-medium leading-5 op-80">
                  {{ row.label }}
                </div>
                <div class="text-15px leading-6">
                  <a
                    v-if="row.href && row.value"
                    :href="row.href"
                    :target="row.href.startsWith('http') ? '_blank' : undefined"
                    :rel="row.href.startsWith('http') ? 'noopener noreferrer' : undefined"
                    class="text-[var(--n-primary-color)] no-underline hover:underline"
                    break-all>
                    {{ row.value }}
                  </a>
                  <span
                    v-else
                    class="op-90"
                    break-all>
                    {{ row.value }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </NCard>

        <NAlert
          type="info"
          :bordered="false"
          show-icon
          :title="t('aboutPage.legalTitle')">
          <div
            text-15px
            leading-7
            op-90>
            {{ t('aboutPage.legalBody') }}
          </div>
        </NAlert>

        <NCard :title="t('aboutPage.historyTitle')">
          <template #header-extra>
            <CalendarEvent
              w-5
              h-5
              op-60 />
          </template>
          <p
            m-0
            mb-4
            text-15px
            leading-7
            op-90>
            {{ t('aboutPage.historyBody') }}
          </p>
          <NDivider
            dashed
            my-2 />
          <NEmpty
            v-if="milestones.length === 0"
            :description="t('aboutPage.historyEmpty')"
            op-80 />
          <NSpace
            v-else
            vertical
            :size="16">
            <div
              v-for="(m, i) in milestones"
              :key="i"
              flex
              gap-3>
              <Heart
                w-5
                h-5
                op-50
                shrink-0
                mt-0.5 />
              <div>
                <div
                  text-sm
                  font-medium
                  op-80>
                  {{ m.title }}
                </div>
                <div
                  text-15px
                  leading-7
                  op-90
                  mt-0.5>
                  {{ m.description }}
                </div>
              </div>
            </div>
          </NSpace>
        </NCard>
      </div>
    </NScrollbar>
  </div>
</template>
