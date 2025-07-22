import { Editor, Withable, QuadratsElement, WithElementType } from '@quadrats/core';
import {
  FileUploaderGetBody,
  FileUploaderGetHeaders,
  FileUploaderGetUrl,
  FileUploaderImplement,
} from '@quadrats/common/file-uploader';

export type CardTypeKey = 'card';
export type CardImageTypeKey = 'card_image';
export type CardContentsTypeKey = 'card_contents';

export type CardTypes = Record<CardTypeKey | CardImageTypeKey | CardContentsTypeKey, string>;

export interface CardPlaceholderElement extends QuadratsElement, WithElementType {}

export interface Card<T extends Editor = Editor> extends Withable {
  types: CardTypes;
  insertCardPlaceholder(editor: T): void;
  removeCardPlaceholder(editor: T): void;
  accept: string[];
  getBody: FileUploaderGetBody;
  getHeaders?: FileUploaderGetHeaders;
  getUrl: FileUploaderGetUrl;
  uploader?: FileUploaderImplement;
}
