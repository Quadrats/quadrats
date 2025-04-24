export interface SpacingObject {
  'spacing-0': string;
  'spacing-1': string;
  'spacing-2': string;
  'spacing-4': string;
  'spacing-6': string;
  'spacing-7': string;
  'spacing-8': string;
  'spacing-14': string;
  'spacing-25': string;
  'spacing-27': string;
  'spacing-28': string;
  'spacing-30': string;

  'radius-1': string;
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

  typographyBasicInput1FontSize: string;
  typographyBasicInput1LineHeight: string;
  typographyBasicInput1LetterSpacing: string;
  typographyBasicInput1FontWeight: string;
}

export type ThemeObject = {
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
} & SpacingObject;

export type Theme = string | ThemeObject;
