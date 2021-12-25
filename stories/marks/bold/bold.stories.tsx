import React, { useMemo, useState } from 'react';
import { THEME_QDR } from '@quadrats/theme';
import { Bold as BoldIcon } from '@quadrats/icons';
import { Descendant, PARAGRAPH_TYPE } from '@quadrats/core';
import {
  Quadrats,
  Editable,
  createReactEditor,
  composeRenderLeafs,
  composeHandlers,
} from '@quadrats/react';
import { BOLD_TYPE } from '@quadrats/common/bold';
import { createReactBold, BOLD_HOTKEY } from '@quadrats/react/bold';
import { ToggleMarkToolbarIcon } from '@quadrats/react/toggle-mark/toolbar';
import { Toolbar } from '@quadrats/react/toolbar';

export default {
  title: 'Marks/Bold',
};

export const Example = ({ type, hotkey }: { type: string, hotkey: string }) => {
  const bold = createReactBold(type);
  const createHandlers = composeHandlers([bold.createHandlers({ hotkey })]);
  const renderLeaf = composeRenderLeafs([bold.createRenderLeaf()]);
  const initialValues: Descendant[] = [
    {
      type: PARAGRAPH_TYPE,
      children: [
        {
          text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        },
        {
          text: 'Officiis cupiditate enim distinctio excepturi',
          [bold.type]: true,
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
        <Toolbar>{(expanded) => (expanded ? <ToggleMarkToolbarIcon controller={bold} icon={BoldIcon} /> : null)}</Toolbar>
        <Editable {...handlers} className="stories__custom-elements stories__editable" renderLeaf={renderLeaf} />
      </Quadrats>
    );
  };

  return <Editor />;
};

Example.args = {
  type: BOLD_TYPE,
  hotkey: BOLD_HOTKEY,
};
