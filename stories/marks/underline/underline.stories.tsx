import React, { useMemo, useState } from 'react';
import { THEME_QDR } from '@quadrats/theme';
import { Underline as UnderlineIcon } from '@quadrats/icons';
import { Descendant, PARAGRAPH_TYPE } from '@quadrats/core';
import {
  Quadrats,
  Editable,
  createReactEditor,
  composeRenderLeafs,
  composeHandlers,
} from '@quadrats/react';
import { UNDERLINE_TYPE } from '@quadrats/common/underline';
import { createReactUnderline, UNDERLINE_HOTKEY } from '@quadrats/react/underline';
import { ToggleMarkToolbarIcon } from '@quadrats/react/toggle-mark/toolbar';
import { Toolbar } from '@quadrats/react/toolbar';

export default {
  title: 'Marks/Underline',
};

export const Example = ({ type, hotkey }: { type: string; hotkey: string }) => {
  const underline = createReactUnderline(type);
  const createHandlers = composeHandlers([underline.createHandlers({ hotkey })]);
  const renderLeaf = composeRenderLeafs([underline.createRenderLeaf()]);
  const initialValues: Descendant[] = [
    {
      type: PARAGRAPH_TYPE,
      children: [
        {
          text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        },
        {
          text: 'Officiis cupiditate enim distinctio excepturi',
          [underline.type]: true,
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
        <Toolbar>{(expanded) => (expanded ? <ToggleMarkToolbarIcon controller={underline} icon={UnderlineIcon} /> : null)}</Toolbar>
        <Editable {...handlers} className="stories__custom-elements stories__editable" renderLeaf={renderLeaf} />
      </Quadrats>
    );
  };

  return <Editor />;
};

Example.args = {
  type: UNDERLINE_TYPE,
  hotkey: UNDERLINE_HOTKEY,
};
