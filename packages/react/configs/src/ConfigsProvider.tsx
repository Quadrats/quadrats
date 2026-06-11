import React, { ReactNode, useContext, useMemo } from 'react';
import { Theme } from '@quadrats/theme';
import { LocaleDefinition } from '@quadrats/locales';
import { LocaleContext } from './locale';
import { resolveThemeToProps, ThemeContext, ThemeContextValue } from './theme';

export interface ConfigsProviderRenderProps {
  theme: ThemeContextValue;
  locale: LocaleDefinition;
}

export interface ConfigsProviderProps {
  theme?: Theme;
  locale?: LocaleDefinition;
  /**
   * Can pass any react elements or a render props which provide the resolved result.
   */
  children: ReactNode | ((props: ConfigsProviderRenderProps) => ReactNode);
}

/**
 * Provide theme / locale configs.
 *
 * Omitted configs are inherited from the closest ancestor `ConfigsProvider`
 * (falling back to the context defaults, e.g. `enUS`, at the top level), so
 * components which render their own nested `ConfigsProvider` (e.g.
 * `<Quadrats>`) won't reset configs provided by the host application.
 */
function ConfigsProvider({ theme, locale, children }: ConfigsProviderProps) {
  const inheritedTheme = useContext(ThemeContext);
  const inheritedLocale = useContext(LocaleContext);
  const resolvedLocale = locale ?? inheritedLocale;
  const themeContext: ThemeContextValue = useMemo(
    () => (theme
      ? {
        props: resolveThemeToProps(theme),
        theme,
      }
      : inheritedTheme),
    [theme, inheritedTheme],
  );

  return (
    <ThemeContext.Provider value={themeContext}>
      <LocaleContext.Provider value={resolvedLocale}>
        {typeof children === 'function' ? children({ theme: themeContext, locale: resolvedLocale }) : children}
      </LocaleContext.Provider>
    </ThemeContext.Provider>
  );
}

export default ConfigsProvider;
