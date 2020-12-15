import React, { useMemo } from 'react';
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough as StrikethroughIcon,
  Highlight as HighlightIcon,
  Link as LinkIcon,
  Unlink as UnlinkIcon,
  Heading1 as Heading1Icon,
  Heading2 as Heading2Icon,
  Heading3 as Heading3Icon,
  Blockquote as BlockquoteIcon,
  UnorderedList as UnorderedListIcon,
  OrderedList as OrderedListIcon,
  Divider as DividerIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  ReadMore as ReadMoreIcon,
} from '@quadrats/icons';
import { Theme } from '@quadrats/theme';
import { LocaleDefinition } from '@quadrats/locales';
import { pipe } from '@quadrats/utils';
import { Node } from '@quadrats/core';
import {
  Quadrats,
  Editable,
  createReactEditor,
  composeRenderElements,
  composeRenderLeafs,
  composeHandlers,
} from '@quadrats/react';
import { createRenderParagraphElement } from '@quadrats/react/paragraph';
import { COMMON_ON_KEY_DOWN_BREAK } from '@quadrats/react/break';
import { createReactBold } from '@quadrats/react/bold';
import { createReactItalic } from '@quadrats/react/italic';
import { createReactUnderline } from '@quadrats/react/underline';
import { createReactStrikethrough } from '@quadrats/react/strikethrough';
import { createReactHighlight } from '@quadrats/react/highlight';
import { createReactBlockquote } from '@quadrats/react/blockquote';
import { createReactDivider } from '@quadrats/react/divider';
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
import { createReactFileUploader } from '@quadrats/react/file-uploader';
import { createReactHeading } from '@quadrats/react/heading';
import { createReactImage } from '@quadrats/react/image';
import { createReactLink } from '@quadrats/react/link';
import { createReactList } from '@quadrats/react/list';
import { createReactReadMore } from '@quadrats/react/read-more';
import { createReactInputBlock } from '@quadrats/react/input-block';

import { Toolbar, TOOLBAR_DIVIDER } from '@quadrats/react/toolbar';
import { ToggleMarkToolbarIcon } from '@quadrats/react/toggle-mark/toolbar';
import { BlockquoteToolbarIcon } from '@quadrats/react/blockquote/toolbar';
import { DividerToolbarIcon } from '@quadrats/react/divider/toolbar';
import { EmbedToolbarIcon } from '@quadrats/react/embed/toolbar';
import { FileUploaderToolbarIcon } from '@quadrats/react/file-uploader/toolbar';
import { HeadingToolbarIcon } from '@quadrats/react/heading/toolbar';
import { LinkToolbarIcon, UnlinkToolbarIcon } from '@quadrats/react/link/toolbar';
import { ListToolbarIcon } from '@quadrats/react/list/toolbar';
import { ReadMoreToolbarIcon } from '@quadrats/react/read-more/toolbar';

import { customRenderBlockquote } from '../custom-elements';

const bold = createReactBold();
const highlight = createReactHighlight();
const italic = createReactItalic();
const strikethrough = createReactStrikethrough();
const underline = createReactUnderline();
const heading = createReactHeading({
  enabledLevels: [1, 2, 3],
});
const blockquote = createReactBlockquote();
const divider = createReactDivider();
const embed = createReactEmbed({
  strategies: {
    youtube: YoutubeEmbedStrategy,
    vimeo: VimeoEmbedStrategy,
    instagram: InstagramEmbedStrategy,
    facebook: FacebookEmbedStrategy,
    twitter: TwitterEmbedStrategy,
  },
});
const fileUploader = createReactFileUploader();
const image = createReactImage({
  sizeSteps: [25, 50, 75],
  hostingResolvers: {
    GCLOUD_STORAGE: (name) => `http://mmagym-static.rytass.com/${name}`,
  },
});
const inputBlock = createReactInputBlock();
const link = createReactLink({
  wrappableVoidTypes: [image.types.image],
});
const list = createReactList();
const readMore = createReactReadMore();

const createPlaygroudEditor = () => pipe(
  createReactEditor(),
  blockquote.with,
  divider.with,
  embed.with,
  fileUploader.with,
  heading.with,
  inputBlock.with,
  link.with,
  /**
     * The plugin order of image should higher then link.
     */
  image.with,
  list.with,
  readMore.with,
);

const createHandlers = composeHandlers([
  bold.createHandlers(),
  highlight.createHandlers(),
  italic.createHandlers(),
  strikethrough.createHandlers(),
  underline.createHandlers(),
  blockquote.createHandlers(),
  heading.createHandlers(),
  list.createHandlers(),
  image.createHandlers(),
  {
    onKeyDown: COMMON_ON_KEY_DOWN_BREAK,
  },
]);
const renderElement = composeRenderElements([
  createRenderParagraphElement(),
  blockquote.createRenderElement({
    render: customRenderBlockquote,
  }),
  divider.createRenderElement(),
  embed.createRenderElement({
    youtube: defaultRenderYoutubeEmbedElement,
    vimeo: defaultRenderVimeoEmbedElement,
    instagram: defaultRenderInstagramEmbedElement,
    facebook: defaultRenderFacebookEmbedElement,
    twitter: defaultRenderTwitterEmbedElement,
  }),
  fileUploader.createRenderElement(),
  heading.createRenderElement(),
  image.createRenderElement(),
  inputBlock.createRenderElement(),
  link.createRenderElement(),
  list.createRenderElement(),
  readMore.createRenderElement(),
]);
const renderLeaf = composeRenderLeafs([
  bold.createRenderLeaf(),
  highlight.createRenderLeaf(),
  italic.createRenderLeaf(),
  strikethrough.createRenderLeaf(),
  underline.createRenderLeaf(),
]);

export interface PlaygroudEditorProps {
  theme: Theme;
  locale: LocaleDefinition;
  value: Node[];
  setValue: (nodes: Node[]) => void;
}

function PlaygroudEditor(props: PlaygroudEditorProps) {
  const {
    theme, locale, value, setValue,
  } = props;
  const editor = useMemo(() => createPlaygroudEditor(), []);
  const handlers = useMemo(() => createHandlers(editor), [editor]);

  return (
    <Quadrats editor={editor} locale={locale} onChange={setValue} theme={theme} value={value}>
      <Toolbar>
        {(expanded) => {
          const linkTool = <LinkToolbarIcon icon={LinkIcon} controller={link} />;
          const unlinkTool = <UnlinkToolbarIcon icon={UnlinkIcon} controller={link} />;
          const blockquoteTool = <BlockquoteToolbarIcon icon={BlockquoteIcon} controller={blockquote} />;

          if (expanded) {
            return (
              <>
                <ToggleMarkToolbarIcon icon={BoldIcon} controller={bold} />
                <ToggleMarkToolbarIcon icon={ItalicIcon} controller={italic} />
                <ToggleMarkToolbarIcon icon={UnderlineIcon} controller={underline} />
                <ToggleMarkToolbarIcon icon={StrikethroughIcon} controller={strikethrough} />
                <ToggleMarkToolbarIcon icon={HighlightIcon} controller={highlight} />
                {linkTool}
                {unlinkTool}
              </>
            );
          } if (image.isSelectionInImageCaption(editor)) {
            return null;
          } if (image.isCollapsedOnImage(editor)) {
            return (
              <>
                {linkTool}
                {unlinkTool}
              </>
            );
          } if (blockquote.isSelectionInBlockquote(editor)) {
            return blockquoteTool;
          }

          return (
            <>
              <HeadingToolbarIcon icon={Heading1Icon} controller={heading} level={1} />
              <HeadingToolbarIcon icon={Heading2Icon} controller={heading} level={2} />
              <HeadingToolbarIcon icon={Heading3Icon} controller={heading} level={3} />
              {blockquoteTool}
              <ListToolbarIcon icon={UnorderedListIcon} controller={list} listTypeKey="ul" />
              <ListToolbarIcon icon={OrderedListIcon} controller={list} listTypeKey="ol" />
              {TOOLBAR_DIVIDER}
              <DividerToolbarIcon icon={DividerIcon} controller={divider} />
              <FileUploaderToolbarIcon
                icon={ImageIcon}
                controller={fileUploader}
                options={{
                  accept: ['image/*'],
                  createElement: {
                    image: {
                      dataURL: (dataURL) => image.createImageElement(dataURL),
                      response: (response) => image.createImageElement(JSON.parse(response).filename, 'GCLOUD_STORAGE'),
                    },
                  },
                  getBody: (file) => file,
                  getHeaders: (file) => ({
                    Authorization: 'Bearer <Your OAuth2 Token>',
                    'Content-Type': file.type,
                  }),
                  getUrl: (file) => `https://storage.googleapis.com/upload/storage/v1/b/<Your Bucket Name>/o?uploadType=media&name=${file.name}`,
                }}
              />
              <EmbedToolbarIcon
                icon={VideoIcon}
                controller={embed}
                providers={['youtube', 'vimeo']}
                getPlaceholder={(locale) => locale.editor.video.inputPlaceholder}
                startToolInput={inputBlock.start}
              />
              <EmbedToolbarIcon
                icon={InstagramIcon}
                controller={embed}
                providers={['instagram']}
                getPlaceholder={(locale) => locale.editor.instagram.inputPlaceholder}
                startToolInput={inputBlock.start}
              />
              <EmbedToolbarIcon
                icon={FacebookIcon}
                controller={embed}
                providers={['facebook']}
                getPlaceholder={(locale) => locale.editor.facebook.inputPlaceholder}
                startToolInput={inputBlock.start}
              />
              <EmbedToolbarIcon
                icon={TwitterIcon}
                controller={embed}
                providers={['twitter']}
                getPlaceholder={(locale) => locale.editor.twitter.tweet.inputPlaceholder}
                startToolInput={inputBlock.start}
              />
              <ReadMoreToolbarIcon icon={ReadMoreIcon} controller={readMore} />
            </>
          );
        }}
      </Toolbar>
      <Editable
        {...handlers}
        className="stories__custom-elements stories__editable"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
      />
    </Quadrats>
  );
}

export default PlaygroudEditor;
