import React, { useMemo, useState } from 'react';
import { THEME_QDR } from '@quadrats/theme';
import { Descendant, PARAGRAPH_TYPE } from '@quadrats/core';
import {
  Quadrats,
  Editable,
  createReactEditor,
  composeRenderElements,
} from '@quadrats/react';
import { createRenderParagraphElement } from '@quadrats/react/paragraph';

export default {
  title: 'Elements/Paragraph',
};

export const Example = ({ enable }: { enable: boolean }) => {
  const renderElement = enable ? composeRenderElements([createRenderParagraphElement()]) : undefined;
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
    const editor = useMemo(() => createReactEditor(), []);

    return (
      <Quadrats editor={editor} theme={THEME_QDR} onChange={setValue} value={value}>
        <Editable className="stories__custom-elements stories__editable" renderElement={renderElement} />
      </Quadrats>
    );
  };

  return <Editor />;
};

Example.args = {
  enable: true,
};
