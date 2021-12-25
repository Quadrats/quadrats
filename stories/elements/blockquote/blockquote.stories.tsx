import { text, boolean } from '@storybook/addon-knobs';

import React, { useMemo, useState } from 'react';
import { THEME_QDR } from '@quadrats/theme';
import { Blockquote as BlockquoteIcon } from '@quadrats/icons';
import { Descendant, PARAGRAPH_TYPE } from '@quadrats/core';
import {
  Quadrats,
  Editable,
  createReactEditor,
  composeRenderElements,
  composeHandlers,
} from '@quadrats/react';
import { BLOCKQUOTE_TYPE } from '@quadrats/common/blockquote';
import { BLOCKQUOTE_HOTKEY, createReactBlockquote } from '@quadrats/react/blockquote';
import { BlockquoteToolbarIcon } from '@quadrats/react/blockquote/toolbar';
import { Toolbar } from '@quadrats/react/toolbar';
import { customRenderBlockquote } from '../../custom-elements';

export default {
  title: 'Elements/Blockquote',
};

export const Example = () => {
  const type = text('type', BLOCKQUOTE_TYPE);
  const hotkey = text('hotkey', BLOCKQUOTE_HOTKEY);
  const render = boolean('native blockquote', false) ? undefined : customRenderBlockquote;
  const blockquote = createReactBlockquote({ type });
  const createHandlers = composeHandlers([blockquote.createHandlers({ hotkey })]);
  const renderElement = composeRenderElements([blockquote.createRenderElement({ render })]);
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
      type: blockquote.type,
      children: [
        {
          text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        },
      ],
    },
  ];

  const Editor = () => {
    const [value, setValue] = useState(initialValues);
    const editor = useMemo(() => createReactEditor(), []);
    const handlers = useMemo(() => createHandlers(editor), [editor]);

    return (
      <Quadrats editor={editor} theme={THEME_QDR} onChange={setValue} value={value}>
        <Toolbar>{() => <BlockquoteToolbarIcon controller={blockquote} icon={BlockquoteIcon} />}</Toolbar>
        <Editable {...handlers} className="stories__custom-elements stories__editable" renderElement={renderElement} />
      </Quadrats>
    );
  };

  return <Editor />;
};
