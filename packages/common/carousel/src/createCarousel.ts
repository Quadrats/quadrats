import { Editor, Transforms, Element, QuadratsElement } from '@quadrats/core';
import {
  Carousel,
  CarouselTypes,
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
  accept?: string[];
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
  const accept: string[] = acceptOptions || ['image/*'];

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

  return {
    types,
    accept,
    ratio,
    maxLength,
    limitSize,
    selectFiles,
    insertCarouselPlaceholder,
    removeCarouselPlaceholder,
    getBody,
    getHeaders,
    getUrl,
    uploader,
    with(editor) {
      return editor;
    },
  };
}
