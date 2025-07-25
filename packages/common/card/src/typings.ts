import { Editor, Withable, QuadratsElement, WithElementType, Text } from '@quadrats/core';
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

export interface CardElement extends QuadratsElement, WithElementType {
  confirmModal: boolean;
  alignment: CardAlignment;
  imageItem: {
    file: File;
    progress: number;
    preview: string;
    url: string;
  };
  title: string;
  description: string;
  remark: string;
  haveLink: boolean;
  linkText: string;
  linkUrl: string;
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
  accept: ImageAccept[];
  ratio?: [number, number];
  limitSize: number;
  confirmModal: boolean;
  getBody: FileUploaderGetBody;
  getHeaders?: FileUploaderGetHeaders;
  getUrl: FileUploaderGetUrl;
  uploader?: FileUploaderImplement;
}
