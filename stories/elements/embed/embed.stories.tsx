import { text } from '@storybook/addon-knobs';

import React, { useMemo, useState } from 'react';
import { THEME_QDR } from '@quadrats/theme';
import {
  Video as VideoIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
} from '@quadrats/icons';
import { Node, PARAGRAPH_TYPE } from '@quadrats/core';
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
import { InstagramEmbedStrategy } from '@quadrats/common/embed/strategies/instagram';
import { FacebookEmbedStrategy } from '@quadrats/common/embed/strategies/facebook';
import { TwitterEmbedStrategy } from '@quadrats/common/embed/strategies/twitter';
import { defaultRenderYoutubeEmbedElement } from '@quadrats/react/embed/renderers/youtube';
import { defaultRenderVimeoEmbedElement } from '@quadrats/react/embed/renderers/vimeo';
import { defaultRenderInstagramEmbedElement } from '@quadrats/react/embed/renderers/instagram';
import { defaultRenderFacebookEmbedElement } from '@quadrats/react/embed/renderers/facebook';
import { defaultRenderTwitterEmbedElement } from '@quadrats/react/embed/renderers/twitter';
import { EmbedToolbarIcon } from '@quadrats/react/embed/toolbar';
import { Toolbar } from '@quadrats/react/toolbar';

export default {
  title: 'Elements/Embed',
};

export const Example = () => {
  const type = text('type', EMBED_TYPE);
  const embed = createReactEmbed({
    type,
    strategies: {
      youtube: YoutubeEmbedStrategy,
      vimeo: VimeoEmbedStrategy,
      instagram: InstagramEmbedStrategy,
      facebook: FacebookEmbedStrategy,
      twitter: TwitterEmbedStrategy,
    },
  });
  const renderElement = composeRenderElements([
    embed.createRenderElement({
      youtube: defaultRenderYoutubeEmbedElement,
      vimeo: defaultRenderVimeoEmbedElement,
      instagram: defaultRenderInstagramEmbedElement,
      facebook: defaultRenderFacebookEmbedElement,
      twitter: defaultRenderTwitterEmbedElement,
    }),
  ]);
  const initialValues: Node[] = [
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
            </>
          )}
        </Toolbar>
        <Editable className="stories__custom-elements stories__editable" renderElement={renderElement} />
      </Quadrats>
    );
  };

  return <Editor />;
};
