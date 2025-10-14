import { Path } from '@quadrats/core';
import { createContext, useContext } from 'react';

export interface CompositionContextValue {
  compositionType: string;
  compositionPath: Path;
}

export const CompositionContext = createContext<CompositionContextValue>({
  compositionType: '',
  compositionPath: [],
});

export function useComposition() {
  return useContext(CompositionContext);
}
