import { defineConfig, presetAttributify, presetWind4 } from 'unocss';

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify({
      prefix: 'uno:',
      ignoreAttributes: []
    })
  ],
  theme: {
    colors: {
      // Neutral Base
      'neutral-base': 'var(--neutral-base)',
      // Primary Colors
      primary: 'var(--primary-color)',
      'primary-hover': 'var(--primary-color-hover)',
      'primary-pressed': 'var(--primary-color-pressed)',
      'primary-suppl': 'var(--primary-color-suppl)',

      // Info Colors
      info: 'var(--info-color)',
      'info-hover': 'var(--info-color-hover)',
      'info-pressed': 'var(--info-color-pressed)',
      'info-suppl': 'var(--info-color-suppl)',

      // Success Colors
      success: 'var(--success-color)',
      'success-hover': 'var(--success-color-hover)',
      'success-pressed': 'var(--success-color-pressed)',
      'success-suppl': 'var(--success-color-suppl)',

      // Warning Colors
      warning: 'var(--warning-color)',
      'warning-hover': 'var(--warning-color-hover)',
      'warning-pressed': 'var(--warning-color-pressed)',
      'warning-suppl': 'var(--warning-color-suppl)',

      // Error Colors
      error: 'var(--error-color)',
      'error-hover': 'var(--error-color-hover)',
      'error-pressed': 'var(--error-color-pressed)',
      'error-suppl': 'var(--error-color-suppl)'
    }
  },
  // 安全列表，确保颜色类被生成
  safelist: [
    'bg-neutral-base',
    'bg-primary',
    'bg-primary-hover',
    'bg-primary-pressed',
    'bg-primary-suppl',
    'text-primary',
    'text-primary-hover',
    'text-primary-pressed',
    'border-primary',
    'border-primary-hover',

    'bg-info',
    'bg-info-hover',
    'bg-info-pressed',
    'bg-info-suppl',
    'text-info',
    'text-info-hover',
    'text-info-pressed',
    'border-info',
    'border-info-hover',

    'bg-success',
    'bg-success-hover',
    'bg-success-pressed',
    'bg-success-suppl',
    'text-success',
    'text-success-hover',
    'text-success-pressed',
    'border-success',
    'border-success-hover',

    'bg-warning',
    'bg-warning-hover',
    'bg-warning-pressed',
    'bg-warning-suppl',
    'text-warning',
    'text-warning-hover',
    'text-warning-pressed',
    'border-warning',
    'border-warning-hover',

    'bg-error',
    'bg-error-hover',
    'bg-error-pressed',
    'bg-error-suppl',
    'text-error',
    'text-error-hover',
    'text-error-pressed',
    'border-error',
    'border-error-hover'
  ]
});
