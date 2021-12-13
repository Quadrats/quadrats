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
  useQuadrats,
} from '@quadrats/react';
import { Toolbar } from '@quadrats/react/toolbar';
import { FOOTNOTE_TYPE } from '@quadrats/common/footnote';
import FootnoteToolbarIcon from 'react/footnote/toolbar/src/FootnoteToolbarIcon';
import { createReactFootnote, useFootnotes, useFootnotesFromNodes } from '@quadrats/react/footnote';
import { createRenderParagraphElement } from 'react/paragraph/src/createRenderParagraphElement';

export default {
  title: 'Elements/Footnote',
};

const footnote = createReactFootnote();

const renderElement = composeRenderElements([
  createRenderParagraphElement(),
  footnote.createRenderElement(),
]);

const FootnoteList = () => {
  const editor = useQuadrats();
  const footnotes = useFootnotes(editor);

  return (
    <>
      <p>get footnotes from editor</p>
      <ul>
        {footnotes?.map((footnote) => (
          <li key={footnote.index}>{`[${footnote.index}] ${footnote.wrapperText} : ${footnote.footnote}`}</li>
        ))}
      </ul>
    </>
  );
};

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
    const [rootNodes, setRootNodes] = useState(initialValues);
    const editor = useMemo(() => footnote.with(createReactEditor()), []);

    const footnotes = useFootnotesFromNodes(rootNodes);

    return (
      <>
        <Quadrats editor={editor} theme={THEME_QDR} onChange={setRootNodes} value={rootNodes}>
          <Toolbar>
            {(expanded) => (expanded ? (
              <FootnoteToolbarIcon icon={FnIcon} controller={footnote} />
            ) : null)}
          </Toolbar>
          <Editable className="stories__custom-elements stories__editable" renderElement={renderElement} />
          <FootnoteList />
        </Quadrats>
        <div>
          <p>get footnotes from Nodes</p>
          <ul>
            {footnotes.map((footnote) => (
              <li key={footnote.index}>{`[${footnote.index}] ${footnote.wrapperText} : ${footnote.footnote}`}</li>
            ))}
          </ul>
        </div>
      </>
    );
  };

  return <Editor />;
};
