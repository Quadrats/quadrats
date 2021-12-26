import { QuadratsElement } from '@quadrats/core';
import { WithElementParent } from '../typings';

export function getFirstAncestor<E extends QuadratsElement>(
  element: QuadratsElement & WithElementParent,
  match: (element: QuadratsElement & WithElementParent) => boolean,
): (E & WithElementParent) | undefined {
  const { parent } = element;

  return (parent && !match(parent) ? getFirstAncestor(parent, match) : parent) as (E & WithElementParent) | undefined;
}
