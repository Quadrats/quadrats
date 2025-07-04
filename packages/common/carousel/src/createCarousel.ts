import { Editor, Transforms, Element, QuadratsElement } from '@quadrats/core';
import { Carousel, CarouselTypes, CarouselPlaceholderElement } from './typings';
import { CAROUSEL_TYPES, CAROUSEL_PLACEHOLDER_TYPE } from './constants';

export interface CreateCarouselOptions {
  types?: Partial<CarouselTypes>;
  accept?: string[];
  maxLength?: number;
  limitSize?: number;
}

export function createCarousel(options: CreateCarouselOptions = {}): Carousel<Editor> {
  const {
    types: typesOptions,
    accept: acceptOptions,
    maxLength: maxLengthOptions,
    limitSize: limitSizeOptions,
  } = options;

  const types: CarouselTypes = { ...CAROUSEL_TYPES, ...typesOptions };
  const maxLength: number = maxLengthOptions || 10;
  const limitSize: number = limitSizeOptions || 5;
  const accept: string[] = acceptOptions || ['image/*'];

  const insertCarouselPlaceholder: Carousel<Editor>['insertCarouselPlaceholder'] = (editor) => {
    const carouselPlaceholderElement: CarouselPlaceholderElement = {
      type: CAROUSEL_PLACEHOLDER_TYPE,
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
    maxLength,
    limitSize,
    insertCarouselPlaceholder,
    removeCarouselPlaceholder,
    with(editor) {
      return editor;
    },
  };
}
