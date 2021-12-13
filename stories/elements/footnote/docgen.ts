import {
  FootnoteData,
  FootnoteElement,
} from '@quadrats/common/Footnote';
import {
  ReactFootnote,
  ReactFootnoteCreateRenderElementOptions,
  RenderFootnoteElementProps,
} from '@quadrats/react/Footnote';
import { JsxSerializeFootnoteElementProps } from '@quadrats/react/Footnote/jsx-serializer';

export const createRenderElementDocgen = (options: ReactFootnoteCreateRenderElementOptions) => options;
export const ReactFootnoteDocgen = (t: ReactFootnote) => t;
export const FootnoteElementDocgen = (element: FootnoteElement) => element;
export const FootnoteDataDocgen = (element: FootnoteData) => element;
export const RenderFootnoteElementPropsDocgen = (props: RenderFootnoteElementProps) => props;
export const JsxSerializeFootnoteElementPropsDocgen = (props: JsxSerializeFootnoteElementProps) => props;
