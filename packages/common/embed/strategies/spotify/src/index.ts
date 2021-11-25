import { EmbedElement, EmbedStrategy } from '@quadrats/common/embed';

export type SpotifyEmbedType = 'spotify';

export type SpotifyEmbedElementData = {
  embedType: SpotifyEmbedType;
  contextId: string;
};

export type SpotifyEmbedElement = EmbedElement & SpotifyEmbedElementData;

export type SpotifyEmbedStrategy = EmbedStrategy<SpotifyEmbedElementData, string>;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SpotifyEmbedStrategy: SpotifyEmbedStrategy = {
  serialize: (embedCode) => {
    const result = /^https:\/\/open.spotify.com\/([\S]*)/i.exec(embedCode);

    if (result) {
      const [, contextId] = result;

      return {
        embedType: 'spotify',
        contextId,
      };
    }
  },
  deserialize: (data) => `https://open.spotify.com/embed/${data.contextId}?utm_source=generator`,
  isElementDataValid: (data) => typeof data.contextId === 'string' && !!(data.contextId),
};
