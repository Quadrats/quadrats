import { Editor, Transforms } from 'slate';

export interface WithElementType {
  /**
   * If there is a element type `foo`, then some elements may have a `type` property equal to `foo`.
   */
  type: string;
}

export interface WithMarkType {
  /**
   * If there is a mark type `foo`, then some texts may have a `foo` property.
   */
  type: string;
}

type ExtractTransformsMethodOptions<K extends keyof typeof Transforms, I extends number> = NonNullable<
Parameters<typeof Transforms[K]>[I]
>;

export type TransformsInsertNodesOptions = ExtractTransformsMethodOptions<'insertNodes', 2>;
export type TransformsSetNodesOptions = ExtractTransformsMethodOptions<'setNodes', 2>;
export type TransformsWrapNodesOptions = ExtractTransformsMethodOptions<'wrapNodes', 2>;

export interface Withable<R = undefined> {
  /**
   * The decorator for editor.
   */
  with: <T extends Editor>(editor: T) => R extends undefined ? T : T & R;
}
