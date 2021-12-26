import { QuadratsElement } from '@quadrats/core';

export interface WithElementParent {
  parent: (QuadratsElement & WithElementParent) | undefined;
}
