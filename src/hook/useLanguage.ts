import { isRTLLanguage, LANGUAGE } from '@/locale';
import { useUserStore } from '@/store/modules/user';
import { arDZ, dateArDZ, dateEnUS, dateZhCN, enUS, zhCN, type NDateLocale, type NLocale } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export function useLanguage() {
  const { locale } = useI18n();
  const userStore = useUserStore();
  const { getCurrentLocale } = storeToRefs(userStore);
  const { setCurrentLocale } = userStore;

  /**
   * 设置语言
   * @param locale 语言
   */
  const setLanguage = (language?: LANGUAGE) => {
    const newLocale = language || getCurrentLocale.value;
    locale.value = newLocale;
    setCurrentLocale(newLocale);
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('lang', newLocale);
    htmlElement.setAttribute('dir', isRTLLanguage(newLocale) ? 'rtl' : 'ltr');
  };

  /**
   * 获取Naive UI 的语言主题
   * @returns 语言主题
   */
  const getNaiveThemeLanguage = computed<NLocale>(() => {
    switch (getCurrentLocale.value) {
      case LANGUAGE.EN_US:
        return enUS;
      case LANGUAGE.ZH_CN:
        return zhCN;
      case LANGUAGE.AR_DZ:
      case LANGUAGE.AR_SA:
        return arDZ;
      default:
        return zhCN;
    }
  });

  /**
   * 获取Naive UI 的日期时间格式
   * @returns 日期时间格式
   */
  const getNaiveThemeDatetimeFormat = computed<NDateLocale>(() => {
    switch (getCurrentLocale.value) {
      case LANGUAGE.EN_US:
        return dateEnUS;
      case LANGUAGE.ZH_CN:
        return dateZhCN;
      case LANGUAGE.AR_DZ:
      case LANGUAGE.AR_SA:
        return dateArDZ;
      default:
        return dateZhCN;
    }
  });

  return {
    getCurrentLocale,
    setLanguage,
    getNaiveThemeLanguage,
    getNaiveThemeDatetimeFormat
  };
}
