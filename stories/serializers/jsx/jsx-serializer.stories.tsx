import { boolean, select } from '@storybook/addon-knobs';

import React, { useState } from 'react';
import { THEME_QDR, THEME_QDR_DARK } from '@quadrats/theme';
import { enUS, zhTW } from '@quadrats/locales';
import { Node, PARAGRAPH_TYPE } from '@quadrats/core';
import { ConfigsProvider } from '@quadrats/react/configs';
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

import { createJsxSerializer } from '@quadrats/react/jsx-serializer';
import { createJsxSerializeParagraph } from '@quadrats/react/paragraph/jsx-serializer';
import { createJsxSerializeBold } from '@quadrats/react/bold/jsx-serializer';
import { createJsxSerializeHighlight } from '@quadrats/react/highlight/jsx-serializer';
import { createJsxSerializeItalic } from '@quadrats/react/italic/jsx-serializer';
import { createJsxSerializeStrikethrough } from '@quadrats/react/strikethrough/jsx-serializer';
import { createJsxSerializeUnderline } from '@quadrats/react/underline/jsx-serializer';
import { createJsxSerializeBlockquote } from '@quadrats/react/blockquote/jsx-serializer';
import { createJsxSerializeDivider } from '@quadrats/react/divider/jsx-serializer';
import { createJsxSerializeEmbed } from '@quadrats/react/embed/jsx-serializer';
import { createJsxSerializeHeading } from '@quadrats/react/heading/jsx-serializer';
import { createJsxSerializeImage } from '@quadrats/react/image/jsx-serializer';
import { createJsxSerializeLink } from '@quadrats/react/link/jsx-serializer';
import { createJsxSerializeList } from '@quadrats/react/list/jsx-serializer';
import { createJsxSerializeReadMore } from '@quadrats/react/read-more/jsx-serializer';
import { createJsxSerializeFootnote } from '@quadrats/react/footnote/jsx-serializer';

import { customRenderBlockquote } from '../../custom-elements';
import PlaygroudEditor, { PlaygroudEditorProps } from '../../components/PlaygroudEditor';

export default {
  title: 'Serializers/Jsx',
};

const jsxSerializer = createJsxSerializer({
  leafs: [
    createJsxSerializeBold(),
    createJsxSerializeHighlight(),
    createJsxSerializeItalic(),
    createJsxSerializeStrikethrough(),
    createJsxSerializeUnderline(),
  ],
  elements: [
    createJsxSerializeParagraph(),
    createJsxSerializeBlockquote({ render: customRenderBlockquote }),
    createJsxSerializeDivider(),
    createJsxSerializeEmbed({
      strategies: {
        youtube: YoutubeEmbedStrategy,
        vimeo: VimeoEmbedStrategy,
        instagram: InstagramEmbedStrategy,
        facebook: FacebookEmbedStrategy,
        twitter: TwitterEmbedStrategy,
      },
      renderers: {
        youtube: defaultRenderYoutubeEmbedElement,
        vimeo: defaultRenderVimeoEmbedElement,
        instagram: defaultRenderInstagramEmbedElement,
        facebook: defaultRenderFacebookEmbedElement,
        twitter: defaultRenderTwitterEmbedElement,
      },
    }),
    createJsxSerializeHeading(),
    createJsxSerializeImage(),
    createJsxSerializeLink(),
    createJsxSerializeList(),
    createJsxSerializeReadMore(),
    createJsxSerializeFootnote(),
  ],
});

export const Example = () => {
  const theme = boolean('dark mode', false, 'editor') ? THEME_QDR_DARK : THEME_QDR;
  const locales = [enUS, zhTW];
  const localeNames = locales.map(({ locale }) => locale);
  const localeName = select('locale', localeNames, enUS.locale, 'editor');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const locale = locales.find(({ locale: name }) => name === localeName)!;
  const Display = ({ theme, locale }: Pick<PlaygroudEditorProps, 'theme' | 'locale'>) => {
    const [value, setValue] = useState<Node[]>([
      {
        type: PARAGRAPH_TYPE,
        children: [{ text: '' }],
      },
    ]);

    return (
      <div className="stories__examples__playgroud__serializer-jsx">
        <PlaygroudEditor theme={theme} locale={locale} value={value} setValue={setValue} />
        <ConfigsProvider theme={theme} locale={locale}>
          {({
            theme: {
              props: { style },
            },
          }) => (
            <div className="stories__custom-elements" style={style}>
              {jsxSerializer.serialize(value)}
            </div>
          )}
        </ConfigsProvider>
      </div>
    );
  };

  return <Display theme={theme} locale={locale} />;
};
