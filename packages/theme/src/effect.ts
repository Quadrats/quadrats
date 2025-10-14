import { EffectObject } from './typings';

export const QDR_EFFECT: EffectObject = {
  durationShortest: '150ms',
  durationShorter: '200ms',
  durationShort: '250ms',
  durationStandard: '300ms',
  durationLong: '375ms',
  durationLonger: '450ms',
  durationLongest: '600ms',

  easingStandard: 'cubic-bezier(0.58, 0.01, 0.29, 1.01)',
  easingEmphasized: 'cubic-bezier(0.83, 0, 0.17, 1)',
  easingDecelerated: 'cubic-bezier(0, 0, 0.3, 1)',
  easingAccelerated: 'cubic-bezier(0.32, 0, 0.67, 0)',

  'shadow-xs': '0px 2px 6px 0px rgba(0, 0, 0, 0.08), 0px 1px 2px 0px rgba(0, 0, 0, 0.01)',
  'shadow-s': '0px 4px 8px -2px rgba(0, 0, 0, 0.10), 0px 2px 4px -2px rgba(0, 0, 0, 0.04)',
  'shadow-m': '0px 12px 16px -4px rgba(0, 0, 0, 0.08), 0px 4px 6px -2px rgba(0, 0, 0, 0.03)',
  'shadow-l': '0px 20px 24px -4px rgba(0, 0, 0, 0.08), 0px 8px 8px -4px rgba(0, 0, 0, 0.03)',
  'shadow-xl': '0px 24px 48px -12px rgba(0, 0, 0, 0.18), 0px 4px 8px 2px rgba(0, 0, 0, 0.04)',
  'shadow-2xl': '0px 32px 64px -12px rgba(0, 0, 0, 0.25), 0px 4px 8px 2px rgba(0, 0, 0, 0.04)',
};