import {
  Editor,
  Transforms,
  Element,
  QuadratsElement,
  createParagraphElement,
  isAboveBlockEmpty,
} from '@quadrats/core';
import {
  Carousel,
  CarouselTypes,
  CarouselElement,
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
  confirmModal?: boolean;
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
    confirmModal = true,
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

  const createCarouselElement: Carousel<Editor>['createCarouselElement'] = ({ items }) => {
    const carouselImagesElement: CarouselImagesElement = {
      type: types.carousel_images,
      images: items.map((i) => i.url),
      ratio,
      children: [{ text: '' }],
    };

    const carouselCaptionElement: CarouselCaptionElement = {
      type: types.carousel_caption,
      captions: items.map((i) => i.caption),
      children: [{ text: '' }],
    };

    return {
      type: types.carousel,
      items,
      children: [carouselImagesElement, carouselCaptionElement],
    };
  };

  const insertCarousel: Carousel<Editor>['insertCarousel'] = ({ editor, items }) => {
    if (isAboveBlockEmpty(editor)) {
      Transforms.removeNodes(editor, {
        at: editor.selection?.anchor,
      });
    }

    Transforms.insertNodes(editor, [createCarouselElement({ items }), createParagraphElement()]);
  };

  const updateCarouselElement: Carousel<Editor>['updateCarouselElement'] = ({ editor, items, path }) => {
    Transforms.setNodes(editor, { items } as CarouselElement, { at: path });

    const imagesEntries = Editor.nodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && (node as QuadratsElement).type === types.carousel_images,
      mode: 'all',
    });

    const imagesNode = imagesEntries.next().value;

    const captionEntries = Editor.nodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && (node as QuadratsElement).type === types.carousel_caption,
      mode: 'all',
    });

    const captionNode = captionEntries.next().value;

    if (imagesNode) {
      const [, imagesPath] = imagesNode;

      Transforms.setNodes(editor, { images: items.map((i) => i.url) } as CarouselImagesElement, { at: imagesPath });
    }

    if (captionNode) {
      const [, captionPath] = captionNode;

      Transforms.setNodes(editor, { captions: items.map((i) => i.caption) } as CarouselCaptionElement, {
        at: captionPath,
      });
    }
  };

  return {
    types,
    accept,
    ratio,
    maxLength,
    limitSize,
    confirmModal,
    selectFiles,
    insertCarouselPlaceholder,
    removeCarouselPlaceholder,
    createCarouselElement,
    insertCarousel,
    updateCarouselElement,
    getBody,
    getHeaders,
    getUrl,
    uploader,
    with(editor) {
      return editor;
    },
  };
}
