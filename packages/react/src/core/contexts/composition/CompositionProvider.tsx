import React, { ReactNode } from 'react';
import { Path } from '@quadrats/core';
import { CompositionContext } from './composition';

export interface CompositionProviderProps {
  compositionType: string;
  compositionPath: Path;
  children: ReactNode;
}

export const CompositionProvider = ({ compositionType, compositionPath, children }: CompositionProviderProps) => {
  return (
    <CompositionContext.Provider value={{ compositionType, compositionPath }}>{children}</CompositionContext.Provider>
  );
};
