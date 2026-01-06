import type { InjectionKey } from 'vue';
import type { MediaQueryProvider } from '@/injection/interface';

export const mediaQueryInjectionKey: InjectionKey<MediaQueryProvider> = Symbol('mediaQueryInjectionKey');
