import { text } from '@storybook/addon-knobs';

import React, { useMemo, useState } from 'react';
import { THEME_QDR } from '@quadrats/theme';
import { UnorderedList as UnorderedListIcon, OrderedList as OrderedListIcon } from '@quadrats/icons';
import { Node, PARAGRAPH_TYPE } from '@quadrats/core';
import {
  Quadrats,
  Editable,
  createReactEditor,
  composeRenderElements,
  composeHandlers,
} from '@quadrats/react';
import { LIST_TYPES } from '@quadrats/common/list';
import { createReactList } from '@quadrats/react/list';
import { ListToolbarIcon } from '@quadrats/react/list/toolbar';
import { Toolbar } from '@quadrats/react/toolbar';

export default {
  title: 'Elements/List',
};

export const Example = () => {
  const types = (['ul', 'ol', 'li'] as const).reduce(
    (acc, key) => {
      const type = text(key, LIST_TYPES[key], 'types');
      acc[key] = type;
      return acc;
    },
    { ...LIST_TYPES },
  );
  const list = createReactList({ types });
  const createHandlers = composeHandlers([list.createHandlers()]);
  const renderElement = composeRenderElements([list.createRenderElement()]);
  const initialValues: Node[] = [
    {
      type: PARAGRAPH_TYPE,
      children: [
        {
          text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        },
      ],
    },
    {
      type: list.types.ul,
      children: [
        {
          type: list.types.li,
          children: [
            {
              type: PARAGRAPH_TYPE,
              children: [
                {
                  text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
                },
              ],
            },
            {
              type: list.types.ul,
              children: [
                {
                  type: list.types.li,
                  children: [
                    {
                      type: PARAGRAPH_TYPE,
                      children: [
                        {
                          text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: list.types.ol,
      children: [
        {
          type: list.types.li,
          children: [
            {
              type: PARAGRAPH_TYPE,
              children: [
                {
                  text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
                },
              ],
            },
            {
              type: list.types.ol,
              children: [
                {
                  type: list.types.li,
                  children: [
                    {
                      type: PARAGRAPH_TYPE,
                      children: [
                        {
                          text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
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
    const editor = useMemo(() => list.with(createReactEditor()), []);
    const handlers = useMemo(() => createHandlers(editor), [editor]);

    return (
      <Quadrats editor={editor} theme={THEME_QDR} onChange={setValue} value={value}>
        <Toolbar>
          {() => (
            <>
              <ListToolbarIcon icon={UnorderedListIcon} controller={list} listTypeKey="ul" />
              <ListToolbarIcon icon={OrderedListIcon} controller={list} listTypeKey="ol" />
            </>
          )}
        </Toolbar>
        <Editable {...handlers} className="stories__custom-elements stories__editable" renderElement={renderElement} />
      </Quadrats>
    );
  };

  return <Editor />;
};
