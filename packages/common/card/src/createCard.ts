import { Editor, Transforms, Element, QuadratsElement } from '@quadrats/core';
import {
  FileUploaderGetBody,
  FileUploaderGetHeaders,
  FileUploaderGetUrl,
  FileUploaderImplement,
} from '@quadrats/common/file-uploader';
import { Card, CardTypes, CardPlaceholderElement } from './typings';
import { CARD_TYPES, CARD_PLACEHOLDER_TYPE } from './constants';

export interface CreateCardOptions {
  types?: Partial<CardTypes>;
  accept?: ('image/jpeg' | 'image/jpg' | 'image/png')[];
  getBody: FileUploaderGetBody;
  getHeaders?: FileUploaderGetHeaders;
  getUrl: FileUploaderGetUrl;
  uploader?: FileUploaderImplement;
}

export function createCard(options: CreateCardOptions): Card<Editor> {
  const { types: typesOptions, accept: acceptOptions, getBody, getHeaders, getUrl, uploader } = options;

  const types: CardTypes = { ...CARD_TYPES, ...typesOptions };
  const accept = acceptOptions || ['image/jpeg', 'image/jpg', 'image/png'];

  const insertCardPlaceholder: Card<Editor>['insertCardPlaceholder'] = (editor) => {
    const cardPlaceholderElement: CardPlaceholderElement = {
      type: CARD_PLACEHOLDER_TYPE,
      children: [{ text: '' }],
    };

    Editor.withoutNormalizing(editor, () => {
      Transforms.insertNodes(editor, cardPlaceholderElement);
    });
  };

  const removeCardPlaceholder: Card<Editor>['removeCardPlaceholder'] = (editor) => {
    Transforms.removeNodes(editor, {
      match: (node) => Element.isElement(node) && (node as QuadratsElement).type === CARD_PLACEHOLDER_TYPE,
    });
  };

  return {
    types,
    accept,
    insertCardPlaceholder,
    removeCardPlaceholder,
    getBody,
    getHeaders,
    getUrl,
    uploader,
    with(editor) {
      return editor;
    },
  };
}
