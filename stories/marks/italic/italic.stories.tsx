import { text } from '@storybook/addon-knobs';

import React, { useMemo, useState } from 'react';
import { THEME_QDR } from '@quadrats/theme';
import { Italic as ItalicIcon } from '@quadrats/icons';
import { Descendant, PARAGRAPH_TYPE } from '@quadrats/core';
import {
  Quadrats,
  Editable,
  createReactEditor,
  composeRenderLeafs,
  composeHandlers,
} from '@quadrats/react';
import { ITALIC_TYPE } from '@quadrats/common/italic';
import { createReactItalic, ITALIC_HOTKEY } from '@quadrats/react/italic';
import { ToggleMarkToolbarIcon } from '@quadrats/react/toggle-mark/toolbar';
import { Toolbar } from '@quadrats/react/toolbar';

export default {
  title: 'Marks/Italic',
};

export const Example = () => {
  const type = text('type', ITALIC_TYPE);
  const hotkey = text('hotkey', ITALIC_HOTKEY);
  const italic = createReactItalic(type);
  const createHandlers = composeHandlers([italic.createHandlers({ hotkey })]);
  const renderLeaf = composeRenderLeafs([italic.createRenderLeaf()]);
  const initialValues: Descendant[] = [
    {
      type: PARAGRAPH_TYPE,
      children: [
        {
          text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        },
        {
          text: 'Officiis cupiditate enim distinctio excepturi',
          [italic.type]: true,
        },
        {
          text:
            ', sapiente ut pariatur repudiandae maxime odit eius accusantium voluptatum nemo facilis eligendi aperiam commodi quibusdam placeat impedit.',
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
        <Toolbar>{(expanded) => (expanded ? <ToggleMarkToolbarIcon controller={italic} icon={ItalicIcon} /> : null)}</Toolbar>
        <Editable {...handlers} className="stories__custom-elements stories__editable" renderLeaf={renderLeaf} />
      </Quadrats>
    );
  };

  return <Editor />;
};
