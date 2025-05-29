export interface EffectObject {
  durationShortest: string;
  durationShorter: string;
  durationShort: string;
  durationStandard: string;
  durationLong: string;
  durationLonger: string;
  durationLongest: string;

  easingStandard: string;
  easingEmphasized: string;
  easingDecelerated: string;
  easingAccelerated: string;

  'shadow-xs': string;
  'shadow-s': string;
  'shadow-m': string;
  'shadow-l': string;
  'shadow-xl': string;
  'shadow-2xl': string;
}

export interface SpacingObject {
  'spacing-0': string;
  'spacing-1': string;
  'spacing-2': string;
  'spacing-3': string;
  'spacing-4': string;
  'spacing-6': string;
  'spacing-7': string;
  'spacing-8': string;
  'spacing-9': string;
  'spacing-10': string;
  'spacing-11': string;
  'spacing-14': string;
  'spacing-25': string;
  'spacing-27': string;
  'spacing-28': string;
  'spacing-30': string;

  'radius-1': string;
  'radius-2': string;
  'radius-3': string;

  typographyArticleH1FontSize: string;
  typographyArticleH1LineHeight: string;
  typographyArticleH1LetterSpacing: string;
  typographyArticleH1FontWeight: string;

  typographyArticleH2FontSize: string;
  typographyArticleH2LineHeight: string;
  typographyArticleH2LetterSpacing: string;
  typographyArticleH2FontWeight: string;

  typographyArticleH3FontSize: string;
  typographyArticleH3LineHeight: string;
  typographyArticleH3LetterSpacing: string;
  typographyArticleH3FontWeight: string;

  typographyArticleH4FontSize: string;
  typographyArticleH4LineHeight: string;
  typographyArticleH4LetterSpacing: string;
  typographyArticleH4FontWeight: string;

  typographyArticleH5FontSize: string;
  typographyArticleH5LineHeight: string;
  typographyArticleH5LetterSpacing: string;
  typographyArticleH5FontWeight: string;

  typographyArticleH6FontSize: string;
  typographyArticleH6LineHeight: string;
  typographyArticleH6LetterSpacing: string;
  typographyArticleH6FontWeight: string;

  typographyArticleSubtitle1FontSize: string;
  typographyArticleSubtitle1LineHeight: string;
  typographyArticleSubtitle1LetterSpacing: string;
  typographyArticleSubtitle1FontWeight: string;

  typographyArticleBody1FontSize: string;
  typographyArticleBody1LineHeight: string;
  typographyArticleBody1LetterSpacing: string;
  typographyArticleBody1FontWeight: string;

  typographyArticleBody2FontSize: string;
  typographyArticleBody2LineHeight: string;
  typographyArticleBody2LetterSpacing: string;
  typographyArticleBody2FontWeight: string;

  typographyBasicInput1FontSize: string;
  typographyBasicInput1LineHeight: string;
  typographyBasicInput1LetterSpacing: string;
  typographyBasicInput1FontWeight: string;

  typographyBasicInput2FontSize: string;
  typographyBasicInput2LineHeight: string;
  typographyBasicInput2LetterSpacing: string;
  typographyBasicInput2FontWeight: string;

  typographyBasicBody2FontSize: string;
  typographyBasicBody2LineHeight: string;
  typographyBasicBody2LetterSpacing: string;
  typographyBasicBody2FontWeight: string;
}

export interface PalettesObject {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  onPrimary: string;
  primaryHoverBg: string;
  primaryActiveBg: string;

  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  onSecondary: string;
  secondaryHoverBg: string;
  secondaryActiveBg: string;

  error: string;
  errorLight: string;
  errorDark: string;
  onError: string;
  errorHoverBg: string;
  errorActiveBg: string;

  warning: string;
  warningLight: string;
  warningDark: string;
  onWarning: string;
  warningHoverBg: string;
  warningActiveBg: string;

  success: string;
  successLight: string;
  successDark: string;
  onSuccess: string;
  successHoverBg: string;
  successActiveBg: string;

  textPrimary: string;
  textSecondary: string;
  textDisabled: string;

  actionActive: string;
  actionInactive: string;
  actionDisabled: string;
  actionDisabledBg: string;

  surface: string;
  block: string;
  bg: string;

  divider: string;
  border: string;

  overlayDark: string;
  overlayLight: string;
}

export type ThemeObject = EffectObject & PalettesObject & SpacingObject;

export type Theme = string | ThemeObject;
