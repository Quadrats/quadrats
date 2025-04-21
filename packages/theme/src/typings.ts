export interface ThemeObject {
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

export type Theme = string | ThemeObject;
