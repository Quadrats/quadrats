import { createContext, useContext } from 'react';

export interface ToolbarMenuContextValue {
  isInGroup: boolean;
  menuExpanded: boolean;
}

export const ToolbarMenuContext = createContext<ToolbarMenuContextValue>({
  isInGroup: false,
  menuExpanded: false,
});

export function useToolbarMenu() {
  return useContext(ToolbarMenuContext);
}