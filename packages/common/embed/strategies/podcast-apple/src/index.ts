import { EmbedElement, EmbedStrategy } from '@quadrats/common/embed';

export type PodcastAppleEmbedType = 'podcast-apple';

export type PodcastAppleEmbedElementData = {
  embedType: PodcastAppleEmbedType;
  language?: string;
  contextId: string;
};

export type PodcastAppleEmbedElement = EmbedElement & PodcastAppleEmbedElementData;

export type PodcastAppleEmbedStrategy = EmbedStrategy<PodcastAppleEmbedElementData, string>;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PodcastAppleEmbedStrategy: PodcastAppleEmbedStrategy = {
  serialize: (embedCode) => {
    const result = /^https:\/\/embed.podcasts.apple.com\/([\w-]*)\/podcast\/[\S]*\/id([\d]*)/i.exec(embedCode)
      ?? /^https:\/\/embed.podcasts.apple.com\/([\w-]*)\/podcast\/id([\d]*)/i.exec(embedCode)
      ?? /^https:\/\/podcasts.apple.com\/([\w-]*)\/podcast\/[\S]*\/id([\d]*)/i.exec(embedCode);

    if (result) {
      const [, language, contextId] = result;

      return {
        embedType: 'podcast-apple',
        language,
        contextId,
      };
    }
  },
  deserialize: data => `https://embed.podcasts.apple.com/${data.language ?? 'us'}/podcast/id${data.contextId}`,
  isElementDataValid: data => typeof data.contextId === 'string' && !!(data.contextId),
};
