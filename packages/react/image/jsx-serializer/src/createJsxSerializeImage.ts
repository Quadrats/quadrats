import {
  getFirstAncestor,
  getMergedNodeTexts,
  WithElementParent,
} from '@quadrats/core/serializers';
import {
  getImageElementCommonProps,
  getImageFigureElementCommonProps,
  ImageCaptionTypeKey,
  ImageElement,
  ImageFigureElement,
  ImageFigureTypeKey,
  ImageHostingResolvers,
  ImageTypeKey,
  IMAGE_TYPES,
} from '@quadrats/common/image';
import { Descendant } from '@quadrats/core';
import { CreateJsxSerializeElementOptions, createJsxSerializeElements } from '@quadrats/react/jsx-serializer';
import { defaultRenderImageElements } from './defaultRenderImageElements';
import {
  JsxSerializeImageCaptionElementProps,
  JsxSerializeImageElementProps,
  JsxSerializeImageFigureElementProps,
} from './typings';

export type CreateJsxSerializeImageOptions<H extends string> = Partial<
Record<ImageFigureTypeKey, Partial<CreateJsxSerializeElementOptions<JsxSerializeImageFigureElementProps>>> &
Record<ImageTypeKey, Partial<CreateJsxSerializeElementOptions<JsxSerializeImageElementProps>>> &
Record<ImageCaptionTypeKey, Partial<CreateJsxSerializeElementOptions<JsxSerializeImageCaptionElementProps>>> & {
  hostingResolvers?: ImageHostingResolvers<H>;
}
>;

export function createJsxSerializeImage<H extends string>(options: CreateJsxSerializeImageOptions<H> = {}) {
  const {
    figure = {}, image = {}, caption = {}, hostingResolvers,
  } = options;
  const figureType = figure.type || IMAGE_TYPES.figure;
  const captionType = caption.type || IMAGE_TYPES.caption;
  const renderFigure = figure.render || defaultRenderImageElements.figure;
  const renderImage = image.render || defaultRenderImageElements.image;
  const renderCaption = caption.render || defaultRenderImageElements.caption;

  return createJsxSerializeElements([
    {
      type: figureType,
      render: (props) => {
        const { children } = props;
        const element = props.element as ImageFigureElement & WithElementParent;

        return renderFigure({
          ...getImageFigureElementCommonProps(element),
          children,
          element,
        });
      },
    },
    {
      type: image.type || IMAGE_TYPES.image,
      render: (props) => {
        const { children } = props;
        const element = props.element as ImageElement & WithElementParent;
        const figure = getFirstAncestor<ImageFigureElement>(element, (node) => node.type === figureType);
        const caption = figure?.children?.[1];

        return renderImage({
          ...getImageElementCommonProps(element, hostingResolvers),
          caption: (caption as ImageElement)?.type === captionType ? getMergedNodeTexts(caption as Descendant) : '',
          children,
          element,
        });
      },
    },
    {
      type: captionType,
      render: (props) => renderCaption({
        ...(props as JsxSerializeImageCaptionElementProps),
        isEmpty: !getMergedNodeTexts(props.element),
      }),
    },
  ]);
}
