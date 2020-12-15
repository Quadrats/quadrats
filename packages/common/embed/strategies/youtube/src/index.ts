import { EmbedElement, EmbedStrategy } from '@quadrats/common/embed';

export type YoutubeEmbedElementData = {
  videoId: string;
};

export type YoutubeEmbedElement = EmbedElement & YoutubeEmbedElementData;

export type YoutubeEmbedStrategy = EmbedStrategy<YoutubeEmbedElementData, string>;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const YoutubeEmbedStrategy: YoutubeEmbedStrategy = {
  serialize: (embedCode) => {
    const videoIdByShort = /^https:\/\/youtu.be\/([\w-]*)/.exec(embedCode)?.[1];
    const videoId = videoIdByShort ?? /^https:\/\/www.youtube.com\/(watch\?v=|embed\/)([\w-]*)/i.exec(embedCode)?.[2];

    if (videoId) {
      return {
        videoId,
      };
    }
  },
  deserialize: ({ videoId }) => `https://www.youtube.com/embed/${videoId}`,
  isElementDataValid: ({ videoId }) => typeof videoId === 'string' && !!videoId,
};
