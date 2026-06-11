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

## Rendering paragraphs (1.x note)

Unlike most other plugins, the paragraph controller returned by
`createReactParagraph()` does **not** expose a `createRenderElement()`
method. Older examples in the wild that call it throw at runtime:

```ts
const paragraph = createReactParagraph();

paragraph.createRenderElement();
// ✗ TypeError: paragraph.createRenderElement is not a function
```

Use the standalone `createRenderParagraphElement()` exported from
`@quadrats/react/paragraph` instead:

```tsx
import { createReactParagraph, createRenderParagraphElement } from '@quadrats/react/paragraph';

const paragraph = createReactParagraph();

const renderElement = composeRenderElements([
  createRenderParagraphElement(),
  // other plugins keep the controller method form:
  heading.createRenderElement(),
  list.createRenderElement(),
]);
```

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
