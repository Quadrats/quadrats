import { createContext, useContext } from 'react';
import { enUS, LocaleDefinition } from '@quadrats/locales';

export const LocaleContext = createContext<LocaleDefinition>(enUS);

export function useLocale() {
  return useContext(LocaleContext);
}
