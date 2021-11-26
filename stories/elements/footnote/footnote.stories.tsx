import React, { useMemo, useState } from 'react';
import { THEME_QDR } from '@quadrats/theme';
import {
  Fn as FnIcon,
} from '@quadrats/icons';
import { Node, PARAGRAPH_TYPE } from '@quadrats/core';
import {
  Quadrats,
  Editable,
  createReactEditor,
  composeRenderElements,
} from '@quadrats/react';
import { Toolbar } from '@quadrats/react/toolbar';
import { FOOTNOTE_TYPE } from '@quadrats/common/footnote';
import FootnoteToolbarIcon from 'react/footnote/toolbar/src/FootnoteToolbarIcon';
import { createReactFootnote } from '@quadrats/react/footnote';
import { createRenderParagraphElement } from 'react/paragraph/src/createRenderParagraphElement';

export default {
  title: 'Elements/Footnote',
};

const footnote = createReactFootnote();

const renderElement = composeRenderElements([
  createRenderParagraphElement(),
  footnote.createRenderElement(),
]);

export const Example = () => {
  const initialValues: Node[] = [
    {
      type: PARAGRAPH_TYPE,
      children: [
        {
          text: 'Lorem ipsum dolor sit amet ',
        },
        {
          type: FOOTNOTE_TYPE,
          index: 1,
          footnote: 'footnote context',
          children: [
            {
              text: 'text',
            },
          ],
        },
        {
          text: 'consectetur adipisicing elit.',
        },
      ],
    },
    {
      type: PARAGRAPH_TYPE,
      children: [
        {
          text: '',
        },
        {
          type: FOOTNOTE_TYPE,
          index: 2,
          footnote: 'footnote context2',
          children: [
            {
              text: 'footnote2',
            },
          ],
        },
      ],
    },
  ];

  const Editor = () => {
    const [value, setValue] = useState(initialValues);
    const editor = useMemo(() => footnote.with(createReactEditor()), []);

    return (
      <Quadrats editor={editor} theme={THEME_QDR} onChange={setValue} value={value}>
        <Toolbar>
          {(expanded) => (expanded ? (
            <FootnoteToolbarIcon icon={FnIcon} controller={footnote} />
          ) : null)}
        </Toolbar>
        <Editable className="stories__custom-elements stories__editable" renderElement={renderElement} />
      </Quadrats>
    );
  };

  return <Editor />;
};
