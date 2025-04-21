import { createContext, useContext, RefObject } from 'react';

export interface ToolbarContextValue {
  fixed: boolean;
  toolbarRef?: RefObject<HTMLDivElement | null>
}

export const ToolbarContext = createContext<ToolbarContextValue>({
  fixed: false,
});

export function useToolbar() {
  return useContext(ToolbarContext);
}