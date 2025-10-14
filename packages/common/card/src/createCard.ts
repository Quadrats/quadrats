import { Editor, Transforms, Element, QuadratsElement, createParagraphElement, Node } from '@quadrats/core';
import {
  ImageAccept,
  FileUploaderGetBody,
  FileUploaderGetHeaders,
  FileUploaderGetUrl,
  FileUploaderImplement,
} from '@quadrats/common/file-uploader';
import { Card, CardTypes, CardElement, CardImageElement, CardContentsElement, CardPlaceholderElement } from './typings';
import { CARD_TYPES, CARD_PLACEHOLDER_TYPE } from './constants';

export interface CreateCardOptions {
  types?: Partial<CardTypes>;
  accept?: ImageAccept[];
  ratio?: [number, number];
  limitSize?: number;
  confirmModal?: boolean;
  getBody: FileUploaderGetBody;
  getHeaders?: FileUploaderGetHeaders;
  getUrl: FileUploaderGetUrl;
  uploader?: FileUploaderImplement;
}

export function createCard(options: CreateCardOptions): Card<Editor> {
  const {
    types: typesOptions,
    accept: acceptOptions,
    ratio,
    limitSize: limitSizeOptions,
    confirmModal = true,
    getBody,
    getHeaders,
    getUrl,
    uploader,
  } = options;

  const types: CardTypes = { ...CARD_TYPES, ...typesOptions };
  const limitSize: number = limitSizeOptions || 5;
  const accept = acceptOptions || ['image/jpeg', 'image/jpg', 'image/png'];

  const insertCardPlaceholder: Card<Editor>['insertCardPlaceholder'] = (editor) => {
    const cardPlaceholderElement: CardPlaceholderElement = {
      type: CARD_PLACEHOLDER_TYPE,
      ratio,
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

  const createCardElement: Card<Editor>['createCardElement'] = (cardValues) => {
    const cardImageElement: CardImageElement = {
      type: types.card_image,
      src: cardValues.imageItem?.url || '',
      ratio,
      children: [{ text: '' }],
    };

    const cardContentsElement: CardContentsElement = {
      type: types.card_contents,
      children: [{ text: '' }],
      alignment: cardValues.alignment,
      title: cardValues.title,
      description: cardValues.description,
      remark: cardValues.remark,
      haveLink: cardValues.haveLink,
      linkText: cardValues.linkText,
      linkUrl: cardValues.linkUrl,
    };

    return {
      type: types.card,
      confirmModal,
      ...cardValues,
      children: [cardImageElement, cardContentsElement],
    };
  };

  const insertCard: Card<Editor>['insertCard'] = ({ editor, cardValues }) => {
    Transforms.insertNodes(editor, [createCardElement(cardValues), createParagraphElement()]);
  };

  const updateCardElement: Card<Editor>['updateCardElement'] = ({ editor, cardValues, path }) => {
    Transforms.setNodes(editor, cardValues as CardElement, { at: path });

    const imageEntries = Editor.nodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && (node as QuadratsElement).type === types.card_image,
      mode: 'all',
    });

    const imageNode = imageEntries.next().value;

    const contentsEntries = Editor.nodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && (node as QuadratsElement).type === types.card_contents,
      mode: 'all',
    });

    const contentsNode = contentsEntries.next().value;

    if (imageNode) {
      const [, imagePath] = imageNode;

      Transforms.setNodes(editor, { src: cardValues.imageItem?.url || '' } as CardImageElement, { at: imagePath });
    }

    if (contentsNode) {
      const [, contentsPath] = contentsNode;

      Transforms.setNodes(
        editor,
        {
          alignment: cardValues.alignment,
          title: cardValues.title,
          description: cardValues.description,
          remark: cardValues.remark,
          haveLink: cardValues.haveLink,
          linkText: cardValues.linkText,
          linkUrl: cardValues.linkUrl,
        } as CardContentsElement,
        {
          at: contentsPath,
        },
      );
    }
  };

  const updateCardAlignment: Card<Editor>['updateCardAlignment'] = ({ editor, alignment, path }) => {
    Transforms.setNodes(editor, { alignment } as CardElement, { at: path });

    const contentsEntries = Editor.nodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && (node as QuadratsElement).type === types.card_contents,
      mode: 'all',
    });

    const contentsNode = contentsEntries.next().value;

    if (contentsNode) {
      const [, contentsPath] = contentsNode;

      Transforms.setNodes(
        editor,
        {
          alignment,
        } as CardContentsElement,
        {
          at: contentsPath,
        },
      );
    }
  };

  return {
    types,
    createCardElement,
    insertCard,
    updateCardElement,
    updateCardAlignment,
    accept,
    ratio,
    limitSize,
    confirmModal,
    insertCardPlaceholder,
    removeCardPlaceholder,
    getBody,
    getHeaders,
    getUrl,
    uploader,
    with(editor) {
      const { normalizeNode } = editor;

      editor.normalizeNode = (entry) => {
        const [node, path] = entry;

        if (Element.isElement(node)) {
          const type = (node as QuadratsElement).type;

          if (type === types.card) {
            for (const [child, childPath] of Node.children(editor, path)) {
              if (
                Element.isElement(child) &&
                (child as QuadratsElement).type !== types.card_contents &&
                (child as QuadratsElement).type !== types.card_image
              ) {
                Transforms.removeNodes(editor, { at: childPath });

                return;
              }
            }
          } else if (type === types.card_contents || type === types.card_image) {
            for (const [child, childPath] of Node.children(editor, path)) {
              if (Element.isElement(child)) {
                Transforms.removeNodes(editor, { at: childPath });

                return;
              }
            }
          }
        }

        normalizeNode(entry);
      };

      return editor;
    },
  };
}
