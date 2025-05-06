import { useEffect } from 'react';

function getInstagramEmbedApi():
| {
  Embeds: {
    process: () => void;
  };
}
| undefined {
  return (window as any).instgrm;
}

export function useLoadInstagramEmbedApi(permalink: string) {
  useEffect(() => {
    if (permalink) {
      let instgrm = getInstagramEmbedApi();

      if (instgrm) {
        instgrm.Embeds.process();

        return;
      }

      const script = document.createElement('script');

      script.src = '//www.instagram.com/embed.js';
      script.onload = () => {
        instgrm = getInstagramEmbedApi();
        instgrm?.Embeds.process();

        script.remove();
      };

      script.async = true;

      document.body.appendChild(script);

      if (!document.getElementById('add-instagram-title-script')) {
        const addTitleScript = document.createElement('script');

        addTitleScript.id = 'add-instagram-title-script';

        addTitleScript.textContent = `
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'IFRAME' && node.src.includes('instagram.com')) {
                  node.setAttribute('title', 'Instagram 貼文');
                }
              });
            });
          });

          observer.observe(document.body, { childList: true, subtree: true });
        `;

        document.body.appendChild(addTitleScript);
      }
    }
  }, [permalink]);
}
