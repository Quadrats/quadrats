import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  Accordion as AccordionIcon,
  Carousel as CarouselIcon,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough as StrikethroughIcon,
  Highlight as HighlightIcon,
  Link as LinkIcon,
  Unlink as UnlinkIcon,
  Paragraph as ParagraphIcon,
  Heading1 as Heading1Icon,
  Heading2 as Heading2Icon,
  Heading3 as Heading3Icon,
  Heading4 as Heading4Icon,
  Heading5 as Heading5Icon,
  Heading6 as Heading6Icon,
  Blockquote as BlockquoteIcon,
  UnorderedList as UnorderedListIcon,
  OrderedList as OrderedListIcon,
  Divider as DividerIcon,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  Vimeo as VimeoIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  ReadMore as ReadMoreIcon,
  Fn as FnIcon,
  SheetMusic as SheetMusicIcon,
  Drama as DramaIcon,
  Dance as DanceIcon,
  PodcastApple as PodcastAppleIcon,
  Spotify as SpotifyIcon,
} from '@quadrats/icons';
import { ConfigsProvider } from '@quadrats/react/configs';
import type { Meta, StoryObj } from '@storybook/react';
import { Theme } from '@quadrats/theme';
import { LocaleDefinition, zhTW, enUS } from '@quadrats/locales';
import { pipe } from '@quadrats/utils';
import {
  Quadrats,
  Editable,
  createReactEditor,
  composeRenderElements,
  composeRenderLeafs,
  composeHandlers,
  Descendant,
} from '@quadrats/react';
import { createRenderParagraphElement, renderParagraphElementWithSymbol } from '@quadrats/react/paragraph';
import { createReactLineBreak, renderLineBreakElementWithSymbol } from '@quadrats/react/line-break';
import { createReactBold } from '@quadrats/react/bold';
import { createReactItalic } from '@quadrats/react/italic';
import { createReactUnderline } from '@quadrats/react/underline';
import { createReactStrikethrough } from '@quadrats/react/strikethrough';
import { createReactHighlight } from '@quadrats/react/highlight';
import { createReactAccordion } from '@quadrats/react/accordion';
import { createReactCarousel } from '@quadrats/react/carousel';
import { createReactBlockquote } from '@quadrats/react/blockquote';
import { createReactDivider } from '@quadrats/react/divider';
import { createReactEmbed } from '@quadrats/react/embed';
import { YoutubeEmbedStrategy } from '@quadrats/common/embed/strategies/youtube';
import { VimeoEmbedStrategy } from '@quadrats/common/embed/strategies/vimeo';
import { InstagramEmbedStrategy } from '@quadrats/common/embed/strategies/instagram';
import { FacebookEmbedStrategy } from '@quadrats/common/embed/strategies/facebook';
import { TwitterEmbedStrategy } from '@quadrats/common/embed/strategies/twitter';
import { PodcastAppleEmbedStrategy } from '@quadrats/common/embed/strategies/podcast-apple';
import {
  defaultRenderYoutubeEmbedElement,
  defaultRenderYoutubeEmbedPlaceholderElement,
  defaultRenderYoutubeEmbedJsxSerializer,
} from '@quadrats/react/embed/renderers/youtube';
import {
  defaultRenderVimeoEmbedElement,
  defaultRenderVimeoEmbedPlaceholderElement,
  defaultRenderVimeoEmbedJsxSerializer,
} from '@quadrats/react/embed/renderers/vimeo';
import {
  defaultRenderInstagramEmbedElement,
  defaultRenderInstagramEmbedPlaceholderElement,
  defaultRenderInstagramEmbedJsxSerializer,
} from '@quadrats/react/embed/renderers/instagram';
import {
  defaultRenderFacebookEmbedElement,
  defaultRenderFacebookEmbedPlaceholderElement,
  defaultRenderFacebookEmbedJsxSerializer,
} from '@quadrats/react/embed/renderers/facebook';
import {
  defaultRenderTwitterEmbedElement,
  defaultRenderTwitterEmbedPlaceholderElement,
  defaultRenderTwitterEmbedJsxSerializer,
} from '@quadrats/react/embed/renderers/twitter';
import {
  defaultRenderSpotifyEmbedElement,
  defaultRenderSpotifyEmbedPlaceholderElement,
  defaultRenderSpotifyEmbedJsxSerializer,
} from '@quadrats/react/embed/renderers/spotify';
import {
  defaultRenderPodcastAppleEmbedElement,
  defaultRenderPodcastAppleEmbedPlaceholderElement,
  defaultRenderPodcastAppleEmbedJsxSerializer,
} from '@quadrats/react/embed/renderers/podcast-apple';
import { createReactFileUploader } from '@quadrats/react/file-uploader';
import { createReactHeading } from '@quadrats/react/heading';
import { createReactImage, ImagePlaceholder } from '@quadrats/react/image';
import { createReactLink } from '@quadrats/react/link';
import { createReactList } from '@quadrats/react/list';
import { createReactReadMore } from '@quadrats/react/read-more';
import { createReactInputBlock } from '@quadrats/react/input-block';

import { Toolbar, ToolbarGroupIcon, TOOLBAR_DIVIDER } from '@quadrats/react/toolbar';
import { ToggleMarkToolbarIcon } from '@quadrats/react/toggle-mark/toolbar';
import { AccordionToolbarIcon } from '@quadrats/react/accordion/toolbar';
import { CarouselToolbarIcon } from '@quadrats/react/carousel/toolbar';
import { BlockquoteToolbarIcon } from '@quadrats/react/blockquote/toolbar';
import { DividerToolbarIcon } from '@quadrats/react/divider/toolbar';
import { EmbedToolbarIcon } from '@quadrats/react/embed/toolbar';
import { FileUploaderToolbarIcon } from '@quadrats/react/file-uploader/toolbar';
import { HeadingToolbarIcon } from '@quadrats/react/heading/toolbar';
import { LinkToolbarIcon, UnlinkToolbarIcon } from '@quadrats/react/link/toolbar';
import { ListToolbarIcon } from '@quadrats/react/list/toolbar';
import { FootnoteToolbarIcon } from '@quadrats/react/footnote/toolbar';
import { ReadMoreToolbarIcon } from '@quadrats/react/read-more/toolbar';
import { SpotifyEmbedStrategy } from '@quadrats/common/embed/strategies/spotify';

import { createReactFootnote } from '@quadrats/react/footnote';
import { HeadingLevel } from '@quadrats/common/heading';
import type { EmbedStrategies } from '@quadrats/common/embed';
import { PARAGRAPH_TYPE } from '@quadrats/core';
import getLocalFileUploaderOptions from '../helper/local-file-uploader-options';

import { createJsxSerializeBold } from '@quadrats/react/bold/jsx-serializer';
import { createJsxSerializeItalic } from '@quadrats/react/italic/jsx-serializer';
import { createJsxSerializeUnderline } from '@quadrats/react/underline/jsx-serializer';
import { createJsxSerializeStrikethrough } from '@quadrats/react/strikethrough/jsx-serializer';
import { createJsxSerializeHighlight } from '@quadrats/react/highlight/jsx-serializer';
import { createJsxSerializeLineBreak } from '@quadrats/react/line-break/jsx-serializer';
import { createJsxSerializeParagraph } from '@quadrats/react/paragraph/jsx-serializer';
import { createJsxSerializeAccordion } from '@quadrats/react/accordion/jsx-serializer';
import { createJsxSerializeCarousel } from '@quadrats/react/carousel/jsx-serializer';
import { createJsxSerializeBlockquote } from '@quadrats/react/blockquote/jsx-serializer';
import { createJsxSerializeHeading } from '@quadrats/react/heading/jsx-serializer';
import { createJsxSerializeList } from '@quadrats/react/list/jsx-serializer';
import { createJsxSerializeDivider } from '@quadrats/react/divider/jsx-serializer';
import { createJsxSerializeFootnote } from '@quadrats/react/footnote/jsx-serializer';
import { createJsxSerializeLink } from '@quadrats/react/link/jsx-serializer';
import { createJsxSerializeReadMore } from '@quadrats/react/read-more/jsx-serializer';
import { createJsxSerializeImage } from '@quadrats/react/image/jsx-serializer';
import { createJsxSerializeEmbed } from '@quadrats/react/embed/jsx-serializer';
import { createJsxSerializer } from '@quadrats/react/jsx-serializer';

import JSONPretty from 'react-json-pretty';

// Default
const lineBreak = createReactLineBreak();

// Options
const list = createReactList();
const accordion = createReactAccordion();
const carousel = createReactCarousel();
const blockquote = createReactBlockquote();
const divider = createReactDivider();
const bold = createReactBold();
const italic = createReactItalic();
const underline = createReactUnderline();
const strikethrough = createReactStrikethrough();
const highlight = createReactHighlight();
const sheetMusic = createReactHighlight('sheet-music');
const drama = createReactHighlight('drama');
const dance = createReactHighlight('dance');
const inputBlock = createReactInputBlock();
const footnote = createReactFootnote();
const readMore = createReactReadMore();
const fileUploader = createReactFileUploader();
const image = createReactImage(
  {
    sizeSteps: [25, 50, 75],
  },
  (img) => getLocalFileUploaderOptions(img),
);

export interface PlaygroundEditorProps {
  theme: 'Default' | 'Dark';
  locale: 'Chinese' | 'English';
  withTitles: ('h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6')[];
  withAccordion: boolean;
  withCarousel: boolean;
  withBlockquote: boolean;
  withLists: ('ol' | 'ul')[];
  withDivider: boolean;
  withEmbeds: ('youtube' | 'vimeo' | 'instagram' | 'facebook' | 'twitter' | 'podcastApple' | 'spotify')[];
  withBold: boolean;
  withItalic: boolean;
  withUnderline: boolean;
  withStrikethrough: boolean;
  withHighlight: boolean;
  withCustomHighlights: ('sheet-music' | 'drama' | 'dance')[];
  withFootnote: boolean;
  withLink: boolean;
  withImage: boolean;
  withReadMore: boolean;
}

function PlaygroundEditor(props: PlaygroundEditorProps) {
  const {
    theme,
    locale,
    withTitles,
    withAccordion,
    withCarousel,
    withBlockquote,
    withLists,
    withDivider,
    withEmbeds,
    withBold,
    withItalic,
    withUnderline,
    withStrikethrough,
    withHighlight,
    withCustomHighlights,
    withFootnote,
    withLink,
    withImage,
    withReadMore,
  } = props;

  const editorTheme = useMemo<Theme>(() => (theme === 'Dark' ? 'dark' : 'light'), [theme]);
  const editorLocale = useMemo<LocaleDefinition>(() => (locale === 'Chinese' ? zhTW : enUS), [locale]);

  const link = useMemo(() => {
    const wrappableVoidTypes = [];

    if (withImage) wrappableVoidTypes.push(image.types.image);

    return createReactLink({
      wrappableVoidTypes,
    });
  }, [withImage]);

  const heading = useMemo(() => {
    const levels: HeadingLevel[] = [];

    if (~withTitles.indexOf('h1')) {
      levels.push(1);
    }

    if (~withTitles.indexOf('h2')) {
      levels.push(2);
    }

    if (~withTitles.indexOf('h3')) {
      levels.push(3);
    }

    if (~withTitles.indexOf('h4')) {
      levels.push(4);
    }

    if (~withTitles.indexOf('h5')) {
      levels.push(5);
    }

    if (~withTitles.indexOf('h6')) {
      levels.push(6);
    }

    return createReactHeading({
      enabledLevels: levels,
    });
  }, [withTitles]);

  const embedStrategies = useMemo(() => {
    const strategies: EmbedStrategies<string> = {};

    if (~withEmbeds.indexOf('youtube')) strategies.youtube = YoutubeEmbedStrategy;
    if (~withEmbeds.indexOf('vimeo')) strategies.vimeo = VimeoEmbedStrategy;
    if (~withEmbeds.indexOf('instagram')) strategies.instagram = InstagramEmbedStrategy;
    if (~withEmbeds.indexOf('facebook')) strategies.facebook = FacebookEmbedStrategy;
    if (~withEmbeds.indexOf('twitter')) strategies.twitter = TwitterEmbedStrategy;
    if (~withEmbeds.indexOf('podcastApple')) strategies.podcastApple = PodcastAppleEmbedStrategy;
    if (~withEmbeds.indexOf('spotify')) strategies.spotify = SpotifyEmbedStrategy;

    return strategies;
  }, [withEmbeds]);

  const embed = useMemo(
    () =>
      createReactEmbed({
        strategies: embedStrategies,
      }),
    [embedStrategies],
  );

  const editor = useMemo(
    () =>
      (() => {
        const editorWithOptions = [lineBreak.with, inputBlock.with];

        if (withTitles.length) editorWithOptions.push(heading.with);
        if (withAccordion) editorWithOptions.push(accordion.with);
        if (withCarousel) editorWithOptions.push(carousel.with);
        if (withBlockquote) editorWithOptions.push(blockquote.with);
        if (withLists.length) editorWithOptions.push(list.with);
        if (withDivider) editorWithOptions.push(divider.with);
        if (withEmbeds.length) editorWithOptions.push(embed.with);
        if (withFootnote) editorWithOptions.push(footnote.with);
        if (withLink) editorWithOptions.push(link.with);
        if (withImage) editorWithOptions.push(image.with);
        if (withImage) editorWithOptions.push(fileUploader.with);
        if (withReadMore) editorWithOptions.push(fileUploader.with);

        return pipe(createReactEditor(), ...editorWithOptions);
      })(),
    [
      withTitles.length,
      heading.with,
      withAccordion,
      withCarousel,
      withBlockquote,
      withLists.length,
      withDivider,
      withEmbeds.length,
      embed.with,
      withFootnote,
      withLink,
      link.with,
      withImage,
      withReadMore,
    ],
  );

  const handlers = useMemo(() => {
    const handlers = [lineBreak.createHandlers()];

    if (withTitles.length) handlers.push(heading.createHandlers());
    if (withAccordion) handlers.push(accordion.createHandlers());
    if (withBlockquote) handlers.push(blockquote.createHandlers());
    if (withLists.length) handlers.push(list.createHandlers());
    if (withBold) handlers.push(bold.createHandlers());
    if (withItalic) handlers.push(italic.createHandlers());
    if (withUnderline) handlers.push(underline.createHandlers());
    if (withStrikethrough) handlers.push(strikethrough.createHandlers());
    if (withHighlight) handlers.push(highlight.createHandlers());
    if (~withCustomHighlights.indexOf('sheet-music')) handlers.push(sheetMusic.createHandlers());
    if (~withCustomHighlights.indexOf('drama')) handlers.push(drama.createHandlers());
    if (~withCustomHighlights.indexOf('dance')) handlers.push(dance.createHandlers());
    if (withImage) handlers.push(image.createHandlers());

    return composeHandlers(handlers)(editor);
  }, [
    editor,
    heading,
    withTitles,
    withAccordion,
    withBlockquote,
    withLists,
    withBold,
    withItalic,
    withUnderline,
    withStrikethrough,
    withHighlight,
    withCustomHighlights,
    withImage,
  ]);

  const renderElement = useMemo(() => {
    const elements = [
      createRenderParagraphElement({
        render: renderParagraphElementWithSymbol,
      }),
      lineBreak.createRenderElement({
        render: renderLineBreakElementWithSymbol,
      }),
      inputBlock.createRenderElement(),
    ];

    if (withTitles.length) elements.push(heading.createRenderElement());
    if (withLists.length) elements.push(list.createRenderElement());
    if (withDivider) elements.push(divider.createRenderElement());
    if (withFootnote) elements.push(footnote.createRenderElement());
    if (withLink) elements.push(link.createRenderElement());
    if (withImage) elements.push(image.createRenderElement());
    if (withImage) {
      elements.push(fileUploader.createRenderElement());
      elements.push(
        fileUploader.createRenderPlaceholderElement({ render: (props) => <ImagePlaceholder {...props} /> }),
      );
    }

    if (withReadMore) elements.push(readMore.createRenderElement());

    if (withEmbeds.length) {
      const embedElements: Record<string, (props: any) => React.JSX.Element> = {};
      const embedPlaceholderElements: Record<string, (props: any) => React.JSX.Element> = {};

      if (~withEmbeds.indexOf('youtube')) {
        embedElements.youtube = defaultRenderYoutubeEmbedElement;
        embedPlaceholderElements.youtube = defaultRenderYoutubeEmbedPlaceholderElement;
      }

      if (~withEmbeds.indexOf('vimeo')) {
        embedElements.vimeo = defaultRenderVimeoEmbedElement;
        embedPlaceholderElements.vimeo = defaultRenderVimeoEmbedPlaceholderElement;
      }

      if (~withEmbeds.indexOf('instagram')) {
        embedElements.instagram = defaultRenderInstagramEmbedElement;
        embedPlaceholderElements.instagram = defaultRenderInstagramEmbedPlaceholderElement;
      }

      if (~withEmbeds.indexOf('facebook')) {
        embedElements.facebook = defaultRenderFacebookEmbedElement;
        embedPlaceholderElements.facebook = defaultRenderFacebookEmbedPlaceholderElement;
      }

      if (~withEmbeds.indexOf('twitter')) {
        embedElements.twitter = defaultRenderTwitterEmbedElement;
        embedPlaceholderElements.twitter = defaultRenderTwitterEmbedPlaceholderElement;
      }

      if (~withEmbeds.indexOf('podcastApple')) {
        embedElements.podcastApple = defaultRenderPodcastAppleEmbedElement;
        embedPlaceholderElements.podcastApple = defaultRenderPodcastAppleEmbedPlaceholderElement;
      }

      if (~withEmbeds.indexOf('spotify')) {
        embedElements.spotify = defaultRenderSpotifyEmbedElement;
        embedPlaceholderElements.spotify = defaultRenderSpotifyEmbedPlaceholderElement;
      }

      elements.push(embed.createRenderElement(embedElements));
      elements.push(embed.createRenderPlaceholderElement(embedPlaceholderElements));
    }

    if (withAccordion) {
      elements.push(accordion.createRenderElement());
    }

    if (withCarousel) {
      elements.push(carousel.createRenderElement());
      elements.push(carousel.createRenderPlaceholderElement());
    }

    if (withBlockquote) {
      elements.push(blockquote.createRenderElement());
    }

    return composeRenderElements(elements);
  }, [
    withTitles.length,
    heading,
    withLists.length,
    withDivider,
    withFootnote,
    withLink,
    link,
    withImage,
    withReadMore,
    withEmbeds,
    withAccordion,
    withCarousel,
    withBlockquote,
    embed,
  ]);

  const renderLeaf = useMemo(() => {
    const leafs = [];

    if (withBold) leafs.push(bold.createRenderLeaf());
    if (withItalic) leafs.push(italic.createRenderLeaf());
    if (withUnderline) leafs.push(underline.createRenderLeaf());
    if (withStrikethrough) leafs.push(strikethrough.createRenderLeaf());
    if (withHighlight) leafs.push(highlight.createRenderLeaf());
    if (~withCustomHighlights.indexOf('sheet-music')) leafs.push(sheetMusic.createRenderLeaf());
    if (~withCustomHighlights.indexOf('drama')) leafs.push(drama.createRenderLeaf());
    if (~withCustomHighlights.indexOf('dance')) leafs.push(dance.createRenderLeaf());

    return composeRenderLeafs(leafs);
  }, [withBold, withItalic, withUnderline, withStrikethrough, withHighlight, withCustomHighlights]);

  const toolbarRenderer = useCallback(
    (expanded: boolean) => {
      const linkTool = <LinkToolbarIcon icon={LinkIcon} controller={link} />;
      const unlinkTool = <UnlinkToolbarIcon icon={UnlinkIcon} controller={link} />;
      const accordionTool = <AccordionToolbarIcon icon={AccordionIcon} controller={accordion} />;
      const carouselTool = <CarouselToolbarIcon icon={CarouselIcon} controller={carousel} />;
      const blockquoteTool = <BlockquoteToolbarIcon icon={BlockquoteIcon} controller={blockquote} />;
      const footnoteTool = <FootnoteToolbarIcon icon={FnIcon} controller={footnote} />;

      if (expanded) {
        return (
          <>
            {withBold ? <ToggleMarkToolbarIcon icon={BoldIcon} controller={bold} /> : null}
            {withItalic ? <ToggleMarkToolbarIcon icon={ItalicIcon} controller={italic} /> : null}
            {withUnderline ? <ToggleMarkToolbarIcon icon={UnderlineIcon} controller={underline} /> : null}
            {withStrikethrough ? <ToggleMarkToolbarIcon icon={StrikethroughIcon} controller={strikethrough} /> : null}
            {withHighlight ? <ToggleMarkToolbarIcon icon={HighlightIcon} controller={highlight} /> : null}
            {~withCustomHighlights.indexOf('sheet-music') ? (
              <ToggleMarkToolbarIcon icon={SheetMusicIcon} controller={sheetMusic} />
            ) : null}
            {~withCustomHighlights.indexOf('drama') ? (
              <ToggleMarkToolbarIcon icon={DramaIcon} controller={drama} />
            ) : null}
            {~withCustomHighlights.indexOf('dance') ? (
              <ToggleMarkToolbarIcon icon={DanceIcon} controller={dance} />
            ) : null}
            {withLink ? linkTool : null}
            {withLink ? unlinkTool : null}
            {withFootnote ? footnoteTool : null}
          </>
        );
      }

      if (withImage && image.isSelectionInImageCaption(editor)) return null;

      if (withImage && image.isCollapsedOnImage(editor)) {
        return (
          <>
            {withLink ? linkTool : null}
            {withLink ? unlinkTool : null}
            {withFootnote ? footnoteTool : null}
          </>
        );
      }

      if (withBlockquote && blockquote.isSelectionInBlockquote(editor)) {
        return blockquoteTool;
      }

      return (
        <>
          {~withTitles.indexOf('h1') ? <HeadingToolbarIcon icon={Heading1Icon} controller={heading} level={1} /> : null}
          {~withTitles.indexOf('h2') ? <HeadingToolbarIcon icon={Heading2Icon} controller={heading} level={2} /> : null}
          {~withTitles.indexOf('h3') ? <HeadingToolbarIcon icon={Heading3Icon} controller={heading} level={3} /> : null}
          {~withTitles.indexOf('h4') ? <HeadingToolbarIcon icon={Heading4Icon} controller={heading} level={4} /> : null}
          {~withTitles.indexOf('h5') ? <HeadingToolbarIcon icon={Heading5Icon} controller={heading} level={5} /> : null}
          {~withTitles.indexOf('h6') ? <HeadingToolbarIcon icon={Heading6Icon} controller={heading} level={6} /> : null}
          {withAccordion ? accordionTool : null}
          {withCarousel ? carouselTool : null}
          {withBlockquote ? blockquoteTool : null}
          {~withLists.indexOf('ul') ? (
            <ListToolbarIcon icon={UnorderedListIcon} controller={list} listTypeKey="ul" />
          ) : null}
          {~withLists.indexOf('ol') ? (
            <ListToolbarIcon icon={OrderedListIcon} controller={list} listTypeKey="ol" />
          ) : null}
          {withTitles.length || withAccordion || withCarousel || withBlockquote || withLists.length
            ? TOOLBAR_DIVIDER
            : null}
          {withDivider ? <DividerToolbarIcon icon={DividerIcon} controller={divider} /> : null}
          {withImage ? (
            <FileUploaderToolbarIcon
              icon={ImageIcon}
              controller={fileUploader}
              options={getLocalFileUploaderOptions(image)}
            />
          ) : null}
          {~withEmbeds.indexOf('youtube') ? (
            <EmbedToolbarIcon icon={YoutubeIcon} controller={embed} provider="youtube" />
          ) : null}
          {~withEmbeds.indexOf('vimeo') ? (
            <EmbedToolbarIcon icon={VimeoIcon} controller={embed} provider="vimeo" />
          ) : null}
          {~withEmbeds.indexOf('instagram') ? (
            <EmbedToolbarIcon icon={InstagramIcon} controller={embed} provider="instagram" />
          ) : null}
          {~withEmbeds.indexOf('facebook') ? (
            <EmbedToolbarIcon icon={FacebookIcon} controller={embed} provider="facebook" />
          ) : null}
          {~withEmbeds.indexOf('twitter') ? (
            <EmbedToolbarIcon icon={TwitterIcon} controller={embed} provider="twitter" />
          ) : null}
          {~withEmbeds.indexOf('podcastApple') ? (
            <EmbedToolbarIcon icon={PodcastAppleIcon} controller={embed} provider="podcastApple" />
          ) : null}
          {~withEmbeds.indexOf('spotify') ? (
            <EmbedToolbarIcon icon={SpotifyIcon} controller={embed} provider="spotify" />
          ) : null}
          {withReadMore ? <ReadMoreToolbarIcon icon={ReadMoreIcon} controller={readMore} /> : null}
          <ToolbarGroupIcon icon={ParagraphIcon}>
            <HeadingToolbarIcon icon={Heading1Icon} controller={heading} level={1} />
            <HeadingToolbarIcon icon={Heading2Icon} controller={heading} level={2} />
            <HeadingToolbarIcon icon={Heading3Icon} controller={heading} level={3} />
          </ToolbarGroupIcon>
        </>
      );
    },
    [
      link,
      withImage,
      editor,
      withBlockquote,
      withTitles,
      heading,
      withAccordion,
      withCarousel,
      withLists,
      withDivider,
      withEmbeds,
      embed,
      withReadMore,
      withBold,
      withItalic,
      withUnderline,
      withStrikethrough,
      withHighlight,
      withCustomHighlights,
      withLink,
      withFootnote,
    ],
  );

  const [value, setValue] = useState<Descendant[]>([
    {
      type: PARAGRAPH_TYPE,
      children: [{ text: '' }],
    },
  ]);

  useEffect(() => {
    setValue([
      {
        type: PARAGRAPH_TYPE,
        children: [{ text: '' }],
      },
    ]);
  }, [
    withTitles,
    withAccordion,
    withCarousel,
    withBlockquote,
    withLists,
    withDivider,
    withEmbeds,
    withBold,
    withItalic,
    withUnderline,
    withStrikethrough,
    withHighlight,
    withCustomHighlights,
    withFootnote,
    withLink,
    withImage,
  ]);

  const jsxSerializer = useMemo(() => {
    const leafs = [];

    const elements = [createJsxSerializeLineBreak(), createJsxSerializeParagraph()];

    // Leafs
    if (withBold) leafs.push(createJsxSerializeBold());
    if (withItalic) leafs.push(createJsxSerializeItalic());
    if (withUnderline) leafs.push(createJsxSerializeUnderline());
    if (withStrikethrough) leafs.push(createJsxSerializeStrikethrough());
    if (withHighlight) leafs.push(createJsxSerializeHighlight());
    if (~withCustomHighlights.indexOf('sheet-music')) leafs.push(createJsxSerializeHighlight('sheet-music'));
    if (~withCustomHighlights.indexOf('drama')) leafs.push(createJsxSerializeHighlight('drama'));
    if (~withCustomHighlights.indexOf('dance')) leafs.push(createJsxSerializeHighlight('dance'));

    // Elements
    if (withAccordion) elements.push(createJsxSerializeAccordion());
    if (withCarousel) elements.push(createJsxSerializeCarousel());
    if (withBlockquote) elements.push(createJsxSerializeBlockquote());
    if (withTitles.length) elements.push(createJsxSerializeHeading());
    if (withLists.length) elements.push(createJsxSerializeList());
    if (withDivider) elements.push(createJsxSerializeDivider());
    if (withFootnote) elements.push(createJsxSerializeFootnote());
    if (withLink) elements.push(createJsxSerializeLink());
    if (withImage) elements.push(createJsxSerializeImage());
    if (withReadMore) elements.push(createJsxSerializeReadMore());

    if (withEmbeds.length) {
      const embedElements: Record<string, (props: any) => React.JSX.Element> = {};

      if (~withEmbeds.indexOf('youtube')) embedElements.youtube = defaultRenderYoutubeEmbedJsxSerializer;
      if (~withEmbeds.indexOf('vimeo')) embedElements.vimeo = defaultRenderVimeoEmbedJsxSerializer;
      if (~withEmbeds.indexOf('instagram')) embedElements.instagram = defaultRenderInstagramEmbedJsxSerializer;
      if (~withEmbeds.indexOf('facebook')) embedElements.facebook = defaultRenderFacebookEmbedJsxSerializer;
      if (~withEmbeds.indexOf('twitter')) embedElements.twitter = defaultRenderTwitterEmbedJsxSerializer;
      if (~withEmbeds.indexOf('podcastApple')) embedElements.podcastApple = defaultRenderPodcastAppleEmbedJsxSerializer;
      if (~withEmbeds.indexOf('spotify')) embedElements.spotify = defaultRenderSpotifyEmbedJsxSerializer;

      elements.push(
        createJsxSerializeEmbed({
          strategies: embedStrategies,
          renderers: embedElements,
        }),
      );
    }

    return createJsxSerializer({
      leafs,
      elements,
    });
  }, [
    embedStrategies,
    withTitles,
    withAccordion,
    withCarousel,
    withBlockquote,
    withLists,
    withDivider,
    withEmbeds,
    withBold,
    withItalic,
    withUnderline,
    withStrikethrough,
    withHighlight,
    withCustomHighlights,
    withFootnote,
    withLink,
    withImage,
    withReadMore,
  ]);

  return (
    <div>
      <div className="stories__examples__playground__serializer-jsx">
        <div>
          <Quadrats
            editor={editor}
            locale={editorLocale}
            theme={editorTheme}
            value={value}
            key={Math.random()} // Fixed Slate bug on re-create editor
            onChange={(v: Descendant[]) => setValue(v)}
          >
            <Toolbar fixed>{toolbarRenderer}</Toolbar>
            <Toolbar onlyRenderExpanded>{toolbarRenderer}</Toolbar>
            <Editable
              {...handlers}
              className="stories__custom-elements stories__block"
              renderElement={renderElement}
              renderLeaf={renderLeaf}
            />
          </Quadrats>
        </div>
        <ConfigsProvider theme={editorTheme} locale={editorLocale}>
          {({
            theme: {
              props: { style, className },
            },
          }) => (
            <div className={clsx('stories__custom-elements stories__block', className)} style={style}>
              {jsxSerializer.serialize(value)}
            </div>
          )}
        </ConfigsProvider>
      </div>
      <div className="stories__examples__playground__json-block">
        <JSONPretty data={value} />
      </div>
    </div>
  );
}

const meta: Meta<typeof PlaygroundEditor> = {
  title: 'Playground',
  component: PlaygroundEditor,
};

type Story = StoryObj<typeof PlaygroundEditor>;

export const Editor: Story = {
  args: {
    withTitles: ['h1', 'h2', 'h3'],
    withAccordion: true,
    withCarousel: true,
    withBlockquote: false,
    withLists: ['ol', 'ul'],
    withDivider: true,
    locale: 'Chinese',
    theme: 'Default',
    withEmbeds: ['youtube', 'vimeo'],
    withBold: true,
    withItalic: true,
    withUnderline: false,
    withStrikethrough: false,
    withHighlight: true,
    withCustomHighlights: [],
    withFootnote: false,
    withLink: true,
    withImage: true,
    withReadMore: false,
  },
  argTypes: {
    withTitles: {
      name: 'Titles',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      control: { type: 'inline-check' },
    },
    withAccordion: {
      name: 'Accordion',
      control: { type: 'boolean' },
    },
    withCarousel: {
      name: 'Carousel',
      control: { type: 'boolean' },
    },
    withBlockquote: {
      name: 'Blockquote',
      control: { type: 'boolean' },
    },
    withLists: {
      name: 'Item List',
      options: ['ol', 'ul'],
      control: { type: 'inline-check' },
    },
    withDivider: {
      name: 'Divider',
      control: { type: 'boolean' },
    },
    withEmbeds: {
      name: 'Embed',
      options: ['youtube', 'vimeo', 'instagram', 'facebook', 'twitter', 'podcastApple', 'spotify'],
      control: { type: 'inline-check' },
    },
    withBold: {
      name: 'Bold',
      control: { type: 'boolean' },
    },
    withItalic: {
      name: 'Italic',
      control: { type: 'boolean' },
    },
    withUnderline: {
      name: 'Underline',
      control: { type: 'boolean' },
    },
    withStrikethrough: {
      name: 'Strikethrough',
      control: { type: 'boolean' },
    },
    withHighlight: {
      name: 'Highlight',
      control: { type: 'boolean' },
    },
    withCustomHighlights: {
      name: 'Custom Highlight',
      options: ['sheet-music', 'drama', 'dance'],
      control: { type: 'inline-check' },
    },
    withFootnote: {
      name: 'Footnote',
      control: { type: 'boolean' },
    },
    withLink: {
      name: 'Link',
      control: { type: 'boolean' },
    },
    withImage: {
      name: 'Image',
      control: { type: 'boolean' },
    },
    withReadMore: {
      name: 'Read More',
      control: { type: 'boolean' },
    },
    locale: {
      name: 'Language',
      options: ['Chinese', 'English'],
      control: { type: 'inline-radio' },
    },
    theme: {
      name: 'Theme',
      options: ['Default', 'Dark'],
      control: { type: 'inline-radio' },
    },
  },
};

export default meta;
