import { QuadratsElement } from '../typings';

export type ParagraphType = 'p';

export interface ParagraphElement extends QuadratsElement {
  /**
   * The default element in slate is paragraph element.
   * Not customizable.
   */
  type: ParagraphType;
}
