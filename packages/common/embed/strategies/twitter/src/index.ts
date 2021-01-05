import { EmbedElement, EmbedStrategy } from '@quadrats/common/embed';

export type TwitterEmbedType = 'tweet';

export type TwitterEmbedElementData = {
  embedType: TwitterEmbedType;
  tweetId: string;
};

export type TwitterEmbedElement = EmbedElement & TwitterEmbedElementData;

export type TwitterEmbedStrategy = EmbedStrategy<TwitterEmbedElementData, string>;

export function getTwitterTweetDataFromUrl(url: string): TwitterEmbedElementData | undefined {
  const result = /^https:\/\/twitter.com\/[\w]*\/status\/([\w-]*)/i.exec(url);

  if (result) {
    const [, tweetId] = result;

    return {
      embedType: 'tweet',
      tweetId,
    };
  }
}

export function getTwitterTweetDataFromBlockquote(embedCode: string): TwitterEmbedElementData | undefined {
  const template = document.createElement('template');
  template.innerHTML = embedCode;
  const { firstChild } = template.content;

  if (!firstChild || firstChild.nodeName !== 'BLOCKQUOTE') {
    return;
  }

  const blockquote = firstChild as HTMLElement;
  const link = blockquote.lastChild as HTMLLinkElement | null | undefined;
  const url = link?.getAttribute('href');
  return url ? getTwitterTweetDataFromUrl(url) : undefined;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const TwitterEmbedStrategy: TwitterEmbedStrategy = {
  serialize: (embedCode) => {
    const getter = embedCode.startsWith('<blockquote') ? getTwitterTweetDataFromBlockquote : getTwitterTweetDataFromUrl;

    return getter(embedCode);
  },
  deserialize: (data) => {
    if (data.embedType === 'tweet') {
      return data.tweetId;
    }

    return '';
  },
  isElementDataValid: (data) => {
    if (data.embedType === 'tweet') {
      const { tweetId } = data;

      return typeof tweetId === 'string' && !!tweetId;
    }

    return true;
  },
};
