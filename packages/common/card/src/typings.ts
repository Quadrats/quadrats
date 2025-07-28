import { Editor, Withable, QuadratsElement, WithElementType, Text, Path } from '@quadrats/core';
import {
  ImageAccept,
  FileUploaderGetBody,
  FileUploaderGetHeaders,
  FileUploaderGetUrl,
  FileUploaderImplement,
} from '@quadrats/common/file-uploader';

export type CardTypeKey = 'card';
export type CardImageTypeKey = 'card_image';
export type CardContentsTypeKey = 'card_contents';

export type CardTypes = Record<CardTypeKey | CardImageTypeKey | CardContentsTypeKey, string>;

export type CardAlignment = 'leftImageRightText' | 'rightImageLeftText' | 'noImage';

export type CardImageItem = {
  file: File;
  progress: number;
  preview: string;
  url: string;
};

export type CardElementValues = {
  alignment: CardAlignment;
  imageItem: CardImageItem;
  title: string;
  description: string;
  remark: string;
  haveLink: boolean;
  linkText: string;
  linkUrl: string;
};

export interface CardElement extends QuadratsElement, WithElementType, CardElementValues {
  confirmModal: boolean;
}

export interface CardImageElement extends QuadratsElement, WithElementType {
  children: [Text];
  ratio?: [number, number];
  src: string;
}

export interface CardContentsElement extends QuadratsElement, WithElementType {
  children: [Text];
  title: string;
  description: string;
  remark: string;
  haveLink: boolean;
  linkText: string;
  linkUrl: string;
}

export interface CardPlaceholderElement extends QuadratsElement, WithElementType {
  ratio?: [number, number];
  children: [Text];
}

export interface Card<T extends Editor = Editor> extends Withable {
  types: CardTypes;
  insertCardPlaceholder(editor: T): void;
  removeCardPlaceholder(editor: T): void;
  createCardElement(cardValues: CardElementValues): CardElement;
  insertCard({ editor, cardValues }: { editor: T; cardValues: CardElementValues }): void;
  updateCardElement({ editor, cardValues, path }: { editor: T; cardValues: CardElementValues; path: Path }): void;
  updateCardAlignment({ editor, alignment, path }: { editor: T; alignment: CardAlignment; path: Path }): void;
  accept: ImageAccept[];
  ratio?: [number, number];
  limitSize: number;
  confirmModal: boolean;
  getBody: FileUploaderGetBody;
  getHeaders?: FileUploaderGetHeaders;
  getUrl: FileUploaderGetUrl;
  uploader?: FileUploaderImplement;
}
