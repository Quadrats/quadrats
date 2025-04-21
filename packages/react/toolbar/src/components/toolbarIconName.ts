import { LocaleDefinition } from '@quadrats/locales';

export function getIconNameInGroup(iconOriginName: string, locale: LocaleDefinition): string {
  switch (iconOriginName) {
    case 'align-center':
      return locale.editor.toolbar.alignCenter;

    case 'align-left':
      return locale.editor.toolbar.alignLeft;

    case 'align-right':
      return locale.editor.toolbar.alignRight;

    case 'blockquote':
      return locale.editor.toolbar.quote;

    case 'bold':
      return locale.editor.toolbar.bold;

    case 'dance':
      return locale.editor.toolbar.dance;

    case 'divider':
      return locale.editor.toolbar.divider;

    case 'drama':
      return locale.editor.toolbar.drama;

    case 'erase':
      return locale.editor.toolbar.erase;

    case 'facebook':
      return locale.editor.toolbar.facebook;

    case 'fn':
      return locale.editor.toolbar.footnote;

    case 'heading1':
      return locale.editor.toolbar.heading1;

    case 'heading2':
      return locale.editor.toolbar.heading2;

    case 'heading3':
      return locale.editor.toolbar.heading3;

    case 'heading4':
      return locale.editor.toolbar.heading4;

    case 'heading5':
      return locale.editor.toolbar.heading5;

    case 'heading6':
      return locale.editor.toolbar.heading6;

    case 'highlight':
      return locale.editor.toolbar.highlight;

    case 'image':
      return locale.editor.toolbar.image;

    case 'instagram':
      return locale.editor.toolbar.instagram;

    case 'italic':
      return locale.editor.toolbar.italic;

    case 'link':
      return locale.editor.toolbar.link;

    case 'ordered list':
      return locale.editor.toolbar.numberList;

    case 'paragraph':
      return locale.editor.toolbar.paragraph;

    case 'podcast-apple':
      return locale.editor.toolbar.podcastApple;

    case 'read-more':
      return locale.editor.toolbar.readMore;

    case 'sheet-music':
      return locale.editor.toolbar.sheetMusic;

    case 'spotify':
      return locale.editor.toolbar.spotify;

    case 'strikethrough':
      return locale.editor.toolbar.strikethrough;

    case 'twitter':
      return locale.editor.toolbar.twitter;

    case 'underline':
      return locale.editor.toolbar.underline;

    case 'unlink':
      return locale.editor.toolbar.unlink;

    case 'unordered list':
      return locale.editor.toolbar.bulletList;

    case 'video':
      return locale.editor.toolbar.video;

    default:
      return '';
  }
}