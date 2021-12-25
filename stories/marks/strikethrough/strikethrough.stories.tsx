import { text } from '@storybook/addon-knobs';

import React, { useMemo, useState } from 'react';
import { THEME_QDR } from '@quadrats/theme';
import { Strikethrough as StrikethroughIcon } from '@quadrats/icons';
import { Descendant, PARAGRAPH_TYPE } from '@quadrats/core';
import {
  Quadrats,
  Editable,
  createReactEditor,
  composeRenderLeafs,
  composeHandlers,
} from '@quadrats/react';
import { STRIKETHROUGH_TYPE } from '@quadrats/common/strikethrough';
import { createReactStrikethrough, STRIKETHROUGH_HOTKEY } from '@quadrats/react/strikethrough';
import { ToggleMarkToolbarIcon } from '@quadrats/react/toggle-mark/toolbar';
import { Toolbar } from '@quadrats/react/toolbar';

export default {
  title: 'Marks/Strikethrough',
};

export const Example = () => {
  const type = text('type', STRIKETHROUGH_TYPE);
  const hotkey = text('hotkey', STRIKETHROUGH_HOTKEY);
  const strikethrough = createReactStrikethrough(type);
  const createHandlers = composeHandlers([strikethrough.createHandlers({ hotkey })]);
  const renderLeaf = composeRenderLeafs([strikethrough.createRenderLeaf()]);
  const initialValues: Descendant[] = [
    {
      type: PARAGRAPH_TYPE,
      children: [
        {
          text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        },
        {
          text: 'Officiis cupiditate enim distinctio excepturi',
          [strikethrough.type]: true,
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
        <Toolbar>{(expanded) => (expanded ? <ToggleMarkToolbarIcon controller={strikethrough} icon={StrikethroughIcon} /> : null)}</Toolbar>
        <Editable {...handlers} className="stories__custom-elements stories__editable" renderLeaf={renderLeaf} />
      </Quadrats>
    );
  };

  return <Editor />;
};
