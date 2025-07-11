import { Editor, Transforms, Element, QuadratsElement } from '@quadrats/core';
import {
  Carousel,
  CarouselTypes,
  CarouselImagesElement,
  CarouselCaptionElement,
  CarouselPlaceholderElement,
  FileUploaderGetBody,
  FileUploaderGetHeaders,
  FileUploaderGetUrl,
  FileUploaderImplement,
} from './typings';
import { CAROUSEL_TYPES, CAROUSEL_PLACEHOLDER_TYPE } from './constants';
import { getFilesFromInput } from './getFilesFromInput';

export interface CreateCarouselOptions {
  types?: Partial<CarouselTypes>;
  accept?: ('image/jpeg' | 'image/jpg' | 'image/png')[];
  ratio?: [number, number];
  maxLength?: number;
  limitSize?: number;
  getBody: FileUploaderGetBody;
  getHeaders?: FileUploaderGetHeaders;
  getUrl: FileUploaderGetUrl;
  uploader?: FileUploaderImplement;
}

export function createCarousel(options: CreateCarouselOptions): Carousel<Editor> {
  const {
    types: typesOptions,
    accept: acceptOptions,
    ratio,
    maxLength: maxLengthOptions,
    limitSize: limitSizeOptions,
    getBody,
    getHeaders,
    getUrl,
    uploader,
  } = options;

  const types: CarouselTypes = { ...CAROUSEL_TYPES, ...typesOptions };
  const maxLength: number = maxLengthOptions || 10;
  const limitSize: number = limitSizeOptions || 5;
  const accept = acceptOptions || ['image/jpeg', 'image/jpg', 'image/png'];

  const selectFiles: Carousel<Editor>['selectFiles'] = async () => {
    const files = await getFilesFromInput({ accept });

    return files;
  };

  const insertCarouselPlaceholder: Carousel<Editor>['insertCarouselPlaceholder'] = (editor) => {
    const carouselPlaceholderElement: CarouselPlaceholderElement = {
      type: CAROUSEL_PLACEHOLDER_TYPE,
      ratio,
      children: [{ text: '' }],
    };

    Editor.withoutNormalizing(editor, () => {
      Transforms.insertNodes(editor, carouselPlaceholderElement);
    });
  };

  const removeCarouselPlaceholder: Carousel<Editor>['removeCarouselPlaceholder'] = (editor) => {
    Transforms.removeNodes(editor, {
      match: (node) => Element.isElement(node) && (node as QuadratsElement).type === CAROUSEL_PLACEHOLDER_TYPE,
    });
  };

  const createCarouselElement: Carousel<Editor>['createCarouselElement'] = ({ images, captions }) => {
    const carouselImagesElement: CarouselImagesElement = {
      type: types.carousel_images,
      images,
      children: [{ text: '' }],
    };

    const carouselCaptionElement: CarouselCaptionElement = {
      type: types.carousel_caption,
      captions,
      children: [{ text: '' }],
    };

    return {
      type: types.carousel,
      children: [carouselImagesElement, carouselCaptionElement],
    };
  };

  return {
    types,
    accept,
    ratio,
    maxLength,
    limitSize,
    selectFiles,
    insertCarouselPlaceholder,
    removeCarouselPlaceholder,
    createCarouselElement,
    getBody,
    getHeaders,
    getUrl,
    uploader,
    with(editor) {
      return editor;
    },
  };
}
