# Quadrats

A complete rich text editor.
Currently based on [Slate](https://github.com/ianstormtaylor/slate) framework.

[![npm package](https://img.shields.io/npm/v/@quadrats/react.svg?maxAge=60)](https://www.npmjs.com/package/@quadrats/react)
[![npm downloads](https://img.shields.io/npm/dt/@quadrats/react.svg?maxAge=60)](https://www.npmjs.com/package/@quadrats/react)
[![Licence](https://img.shields.io/github/license/Quadrats/quadrats.svg?maxAge=60)](https://github.com/Quadrats/quadrats/blob/main/LICENSE)

[Try out our plugins](https://demo.quadrats.io/?path=/story/playground--editor).

## Features

### Blocks

- Titles [h1, h2, h3, h4, h5, h6]
- Blockquote
- List [ol, ul]
- Divider
- Embed [youtube, vimeo, instagram, facebook, twitter, podcastApple, spotify]
- Inline Mark [bold, italic, underline, strikethrough, highlight, customHighlight]
- Footnote
- Link
- Image [file-uploader]
- Read More

### Locales

- zh-TW [Traditional Chinese]
- en-US [American English]

### Themes

- Default
- Dark Mode

## Toolbar usage

`<Toolbar>` has two render modes, and a typical editor renders **both**
instances side by side:

```tsx
<Quadrats editor={editor} value={value} onChange={setValue}>
  {/* Main toolbar: always-visible sticky bar above the editable area. */}
  <Toolbar fixed>{renderTools}</Toolbar>
  {/* Selection bubble: floats above the text whenever the selection is
      expanded. Without this second instance, selecting text shows no
      bubble at all — a fixed toolbar never floats. */}
  <Toolbar onlyRenderExpanded>{renderTools}</Toolbar>
  <Editable renderElement={renderElement} renderLeaf={renderLeaf} />
</Quadrats>
```

- `fixed` — render as the main toolbar (sticky, always visible).
- `onlyRenderExpanded` — render only when the selection is expanded, as a
  floating bubble positioned at the selection.
- The `children` render prop receives an `expanded` flag, so the same
  renderer can show different tools in the bar and in the bubble.

## Development scripts

Useful scripts include:

```bash
yarn
```

> Installs package dependencies

```bash
yarn build
```

> Build the local packages.

```bash
yarn storybook:start
```

> Starts storybook dev (after building).

```bash
yarn lint
```

> Lint ts/js files w/ [eslint](https://eslint.org/) and scss files w/ [stylelint](https://stylelint.io/).

```bash
yarn test
```

> Test w/ [jest](https://jestjs.io/).

```bash
yarn release
```

> Using lerna to bump package versions, build and publish to npm via [conventional changelog](https://github.com/conventional-changelog).
