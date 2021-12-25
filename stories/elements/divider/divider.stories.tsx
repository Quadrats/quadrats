import { text } from '@storybook/addon-knobs';

import React, { useMemo, useState } from 'react';
import { THEME_QDR } from '@quadrats/theme';
import { Divider as DividerIcon } from '@quadrats/icons';
import { Descendant, PARAGRAPH_TYPE } from '@quadrats/core';
import {
  Quadrats,
  Editable,
  createReactEditor,
  composeRenderElements,
} from '@quadrats/react';
import { DIVIDER_TYPE } from '@quadrats/common/divider';
import { createReactDivider } from '@quadrats/react/divider';
import { DividerToolbarIcon } from '@quadrats/react/divider/toolbar';
import { Toolbar } from '@quadrats/react/toolbar';

export default {
  title: 'Elements/Divider',
};

export const Example = () => {
  const type = text('type', DIVIDER_TYPE);
  const divider = createReactDivider({ type });
  const renderElement = composeRenderElements([divider.createRenderElement()]);
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
      type: divider.type,
      children: [{ text: '' }],
    },
    {
      type: PARAGRAPH_TYPE,
      children: [
        {
          text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        },
      ],
    },
  ];

  const Editor = () => {
    const [value, setValue] = useState(initialValues);
    const editor = useMemo(() => divider.with(createReactEditor()), []);

    return (
      <Quadrats editor={editor} theme={THEME_QDR} onChange={setValue} value={value}>
        <Toolbar>{() => <DividerToolbarIcon controller={divider} icon={DividerIcon} />}</Toolbar>
        <Editable className="stories__custom-elements stories__editable" renderElement={renderElement} />
      </Quadrats>
    );
  };

  return <Editor />;
};
