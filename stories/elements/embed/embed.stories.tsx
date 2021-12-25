import React, { useMemo, useState } from 'react';
import { THEME_QDR } from '@quadrats/theme';
import {
  Video as VideoIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  PodcastApple as PodcastAppleIcon,
  Spotify as SpotifyIcon,
} from '@quadrats/icons';
import { Descendant, PARAGRAPH_TYPE } from '@quadrats/core';
import {
  Quadrats,
  Editable,
  createReactEditor,
  composeRenderElements,
} from '@quadrats/react';
import { EMBED_TYPE } from '@quadrats/common/embed';
import { createReactEmbed } from '@quadrats/react/embed';
import { YoutubeEmbedStrategy } from '@quadrats/common/embed/strategies/youtube';
import { VimeoEmbedStrategy } from '@quadrats/common/embed/strategies/vimeo';
import { FacebookEmbedStrategy } from '@quadrats/common/embed/strategies/facebook';
import { InstagramEmbedStrategy } from '@quadrats/common/embed/strategies/instagram';
import { PodcastAppleEmbedStrategy } from '@quadrats/common/embed/strategies/podcast-apple';
import { SpotifyEmbedStrategy } from '@quadrats/common/embed/strategies/spotify';
import { TwitterEmbedStrategy } from '@quadrats/common/embed/strategies/twitter';
import { defaultRenderFacebookEmbedElement } from '@quadrats/react/embed/renderers/facebook';
import { defaultRenderInstagramEmbedElement } from '@quadrats/react/embed/renderers/instagram';
import { defaultRenderPodcastAppleEmbedElement } from '@quadrats/react/embed/renderers/podcast-apple';
import { defaultRenderTwitterEmbedElement } from '@quadrats/react/embed/renderers/twitter';
import { defaultRenderVimeoEmbedElement } from '@quadrats/react/embed/renderers/vimeo';
import { defaultRenderYoutubeEmbedElement } from '@quadrats/react/embed/renderers/youtube';
import { EmbedToolbarIcon } from '@quadrats/react/embed/toolbar';
import { Toolbar } from '@quadrats/react/toolbar';

export default {
  title: 'Elements/Embed',
};

export const Example = ({ type }: { type: string }) => {
  const embed = createReactEmbed({
    type,
    strategies: {
      youtube: YoutubeEmbedStrategy,
      vimeo: VimeoEmbedStrategy,
      instagram: InstagramEmbedStrategy,
      facebook: FacebookEmbedStrategy,
      twitter: TwitterEmbedStrategy,
      podcastApple: PodcastAppleEmbedStrategy,
      spotify: SpotifyEmbedStrategy,
    },
  });
  const renderElement = composeRenderElements([
    embed.createRenderElement({
      youtube: defaultRenderYoutubeEmbedElement,
      vimeo: defaultRenderVimeoEmbedElement,
      instagram: defaultRenderInstagramEmbedElement,
      facebook: defaultRenderFacebookEmbedElement,
      twitter: defaultRenderTwitterEmbedElement,
      podcastApple: defaultRenderPodcastAppleEmbedElement,
      spotify: defaultRenderTwitterEmbedElement,
    }),
  ]);
  const initialValues: Descendant[] = [
    {
      type: PARAGRAPH_TYPE,
      children: [
        {
          text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        },
      ],
    },
    {
      type: embed.type,
      children: [
        {
          text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        },
      ],
    },
  ];

  const Editor = () => {
    const [value, setValue] = useState(initialValues);
    const editor = useMemo(() => embed.with(createReactEditor()), []);

    return (
      <Quadrats editor={editor} theme={THEME_QDR} onChange={setValue} value={value}>
        <Toolbar>
          {() => (
            <>
              <EmbedToolbarIcon
                icon={VideoIcon}
                controller={embed}
                providers={['youtube', 'vimeo']}
                getPlaceholder={(locale) => locale.editor.video.inputPlaceholder}
              />
              <EmbedToolbarIcon
                icon={InstagramIcon}
                controller={embed}
                providers={['instagram']}
                getPlaceholder={(locale) => locale.editor.instagram.inputPlaceholder}
              />
              <EmbedToolbarIcon
                icon={FacebookIcon}
                controller={embed}
                providers={['facebook']}
                getPlaceholder={(locale) => locale.editor.facebook.inputPlaceholder}
              />
              <EmbedToolbarIcon
                icon={TwitterIcon}
                controller={embed}
                providers={['twitter']}
                getPlaceholder={(locale) => locale.editor.twitter.tweet.inputPlaceholder}
              />
              <EmbedToolbarIcon
                icon={PodcastAppleIcon}
                controller={embed}
                providers={['podcastApple']}
                getPlaceholder={(locale) => locale.editor.podcastApple.inputPlaceholder}
              />
              <EmbedToolbarIcon
                icon={SpotifyIcon}
                controller={embed}
                providers={['spotify']}
                getPlaceholder={(locale) => locale.editor.spotify.inputPlaceholder}
              />
            </>
          )}
        </Toolbar>
        <Editable className="stories__custom-elements stories__editable" renderElement={renderElement} />
      </Quadrats>
    );
  };

  return <Editor />;
};

Example.args = {
  type: EMBED_TYPE,
};
