import React, { useMemo, useState } from 'react';
import { THEME_QDR } from '@quadrats/theme';
import { ReadMore as ReadMoreIcon } from '@quadrats/icons';
import { Descendant, PARAGRAPH_TYPE } from '@quadrats/core';
import {
  Quadrats,
  Editable,
  createReactEditor,
  composeRenderElements,
} from '@quadrats/react';
import { READ_MORE_TYPE } from '@quadrats/common/read-more';
import { createReactReadMore } from '@quadrats/react/read-more';
import { ReadMoreToolbarIcon } from '@quadrats/react/read-more/toolbar';
import { Toolbar } from '@quadrats/react/toolbar';

export default {
  title: 'Elements/ReadMore',
};

export const Example = ({ type }: { type: string }) => {
  const readMore = createReactReadMore({ type });
  const renderElement = composeRenderElements([readMore.createRenderElement()]);
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
      type: readMore.type,
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
    const editor = useMemo(() => readMore.with(createReactEditor()), []);

    return (
      <Quadrats editor={editor} theme={THEME_QDR} onChange={setValue} value={value}>
        <Toolbar>{() => <ReadMoreToolbarIcon controller={readMore} icon={ReadMoreIcon} />}</Toolbar>
        <Editable className="stories__custom-elements stories__editable" renderElement={renderElement} />
      </Quadrats>
    );
  };

  return <Editor />;
};

Example.args = {
  type: READ_MORE_TYPE,
};
