import { text } from '@storybook/addon-knobs';

import React, { useMemo, useState } from 'react';
import { THEME_QDR } from '@quadrats/theme';
import {
  Heading1 as Heading1Icon,
  Heading2 as Heading2Icon,
  Heading3 as Heading3Icon,
} from '@quadrats/icons';
import {
  Quadrats,
  Editable,
  createReactEditor,
  composeRenderElements,
  composeHandlers,
} from '@quadrats/react';
import { Descendant, PARAGRAPH_TYPE, QuadratsElement } from '@quadrats/core';
import { HEADING_TYPE } from '@quadrats/common/heading';
import { HEADING_HOTKEY, createReactHeading } from '@quadrats/react/heading';
import { HeadingToolbarIcon } from '@quadrats/react/heading/toolbar';
import { Toolbar } from '@quadrats/react/toolbar';

export default {
  title: 'Elements/Heading',
};

export const Example = () => {
  const type = text('type', HEADING_TYPE);
  const hotkey = text('hotkey', HEADING_HOTKEY);
  const heading = createReactHeading({ type, enabledLevels: [1, 2, 3] });
  const createHandlers = composeHandlers([heading.createHandlers({ hotkey })]);
  const renderElement = composeRenderElements([heading.createRenderElement()]);
  const initialValues: Descendant[] = [
    {
      type: heading.type,
      level: 1,
      children: [
        {
          text: 'Heading 1',
        },
      ],
    } as QuadratsElement,
    {
      type: heading.type,
      level: 2,
      children: [
        {
          text: 'Heading 2',
        },
      ],
    } as QuadratsElement,
    {
      type: heading.type,
      level: 3,
      children: [
        {
          text: 'Heading 3',
        },
      ],
    } as QuadratsElement,
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
    const editor = useMemo(() => heading.with(createReactEditor()), []);
    const handlers = useMemo(() => createHandlers(editor), [editor]);

    return (
      <Quadrats editor={editor} theme={THEME_QDR} onChange={setValue} value={value}>
        <Toolbar>
          {() => (
            <>
              <HeadingToolbarIcon icon={Heading1Icon} controller={heading} level={1} />
              <HeadingToolbarIcon icon={Heading2Icon} controller={heading} level={2} />
              <HeadingToolbarIcon icon={Heading3Icon} controller={heading} level={3} />
            </>
          )}
        </Toolbar>
        <Editable {...handlers} className="stories__custom-elements stories__editable" renderElement={renderElement} />
      </Quadrats>
    );
  };

  return <Editor />;
};
