import {
  Editor,
  QuadratsElement,
  Node,
  Text,
  Withable,
  WithElementType,
} from '@quadrats/core';

export interface EmbedElement extends QuadratsElement, WithElementType {
  /**
   * The embed provider.
   *
   * e.g. If you embed a youtube video, then you can use `youtube` as provider.
   */
  provider: string;
  children: [Text];
}

export interface EmbedStrategy<EmbedData extends Record<string, unknown>, RenderData> {
  /**
   * To serialize embed code to element data.
   */
  readonly serialize: (embedCode: string) => EmbedData | undefined;
  /**
   * To deserialize element to data for rendering.
   */
  readonly deserialize: (element: EmbedElement & EmbedData) => RenderData;
  readonly isElementDataValid: (data: Record<keyof EmbedData, unknown>) => boolean;
}

export type EmbedStrategies<Provider extends string> = Record<Provider, EmbedStrategy<any, any>>;

export interface Embed<P extends string, T extends Editor = Editor> extends WithElementType, Withable {
  strategies: EmbedStrategies<P>;
  insertEmbed(editor: T, providers: P[], embedCode: string, defaultNode?: Node | string): void;
}
