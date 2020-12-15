import {
  ImageElement,
  ImageFigureElement,
  ImageCaptionElement,
} from '@quadrats/common/image';
import {
  ReactImage,
  ReactImageCreateRenderElementOptions,
  RenderImageFigureElementProps,
  RenderImageElementProps,
  RenderImageCaptionElementProps,
} from '@quadrats/react/image';
import {
  JsxSerializeImageFigureElementProps,
  JsxSerializeImageElementProps,
  JsxSerializeImageCaptionElementProps,
} from '@quadrats/react/image/jsx-serializer';

export const createHandlersDocgen = (options: Record<string, unknown>) => options;
export const createRenderElementDocgen = (options: ReactImageCreateRenderElementOptions) => options;
export const ReactImageDocgen = (t: ReactImage<string>) => t;
export const ImageFigureElementDocgen = (element: ImageFigureElement) => element;
export const ImageElementDocgen = (element: ImageElement) => element;
export const ImageCaptionElementDocgen = (element: ImageCaptionElement) => element;
export const RenderImageFigureElementPropsDocgen = (props: RenderImageFigureElementProps) => props;
export const RenderImageElementPropsDocgen = (props: RenderImageElementProps) => props;
export const RenderImageCaptionElementPropsDocgen = (props: RenderImageCaptionElementProps) => props;
export const JsxSerializeImageFigureElementPropsDocgen = (props: JsxSerializeImageFigureElementProps) => props;
export const JsxSerializeImageElementPropsDocgen = (props: JsxSerializeImageElementProps) => props;
export const JsxSerializeImageCaptionElementPropsDocgen = (props: JsxSerializeImageCaptionElementProps) => props;
