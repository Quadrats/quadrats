import { createContext, useContext } from 'react';

export interface ToolbarMenuContextValue {
  menuExpanded: boolean;
}

export const ToolbarMenuContext = createContext<ToolbarMenuContextValue>({
  menuExpanded: false,
});

export function useToolbarMenu() {
  return useContext(ToolbarMenuContext);
}