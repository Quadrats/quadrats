import { RefObject, useEffect } from 'react';

function getTwitterEmbedApi():
| {
  widgets: {
    createTweet: (
      tweetId: string,
      element: HTMLElement,
    ) => void;
  };
}
| undefined {
  return (window as any).twttr;
}

function createTweet(
  tweetId: string,
  containerEl: HTMLElement,
) {
  const twttr = getTwitterEmbedApi();

  if (twttr) {
    twttr.widgets.createTweet(tweetId, containerEl);

    return true;
  }

  return false;
}

export function useLoadTwitterEmbedApi(
  tweetId: string,
  tweetContainerRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const { current: containerEl } = tweetContainerRef;

    if (tweetId && containerEl) {
      const created = createTweet(tweetId, containerEl);

      if (!created) {
        const script = document.createElement('script');

        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.onload = () => {
          createTweet(tweetId, containerEl);
          script.remove();
        };

        document.body.appendChild(script);
      }
    }
  }, [tweetId, tweetContainerRef]);
}
