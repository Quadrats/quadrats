import { QDR_SPACING } from './spacing';
import { ThemeObject } from './typings';

export const THEME_QDR: ThemeObject = {
  primary: '#465bc7',
  primaryLight: '#778de8',
  primaryDark: '#2d2d9e',
  onPrimary: '#fff',
  primaryHoverBg: '#778de826',
  primaryActiveBg: '#465bc733',

  secondary: '#383838',
  secondaryLight: '#6a6a6a',
  secondaryDark: '#161616',
  onSecondary: '#fff',
  secondaryHoverBg: '#6a6a6a26',
  secondaryActiveBg: '#38383833',

  error: '#fb414a',
  errorLight: '#ff6461',
  errorDark: '#cf1322',
  onError: '#fff',
  errorHoverBg: '#ff646126',
  errorActiveBg: '#fb414a33',

  warning: '#f7ac38',
  warningLight: '#fdd948',
  warningDark: '#f1842b',
  onWarning: '#fff',
  warningHoverBg: '#fdd94826',
  warningActiveBg: '#f7ac3833',

  success: '#00b42a',
  successLight: '#23c343',
  successDark: '#009a29',
  onSuccess: '#fff',
  successHoverBg: '#00b42a26',
  successActiveBg: '#23c34333',

  textPrimary: '#161616',
  textSecondary: '#8f8f8f',
  textDisabled: '#bcbcbc',

  actionActive: '#161616',
  actionInactive: '#8f8f8f',
  actionDisabled: '#bcbcbc',
  actionDisabledBg: '#e5e5e5',

  surface: '#fff',
  block: '#fafafa',
  bg: '#f5f5f5',

  divider: '#e7e7e7',
  border: '#d9d9d9',

  overlayDark: '#16161680',
  overlayLight: '#ffffffe6',

  ...QDR_SPACING,
};
