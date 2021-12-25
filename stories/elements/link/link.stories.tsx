import React, { useMemo, useState } from 'react';
import { THEME_QDR } from '@quadrats/theme';
import { Link as LinkIcon, Unlink as UnlinkIcon } from '@quadrats/icons';
import { Descendant, PARAGRAPH_TYPE, QuadratsElement } from '@quadrats/core';
import {
  Quadrats,
  Editable,
  createReactEditor,
  composeRenderElements,
} from '@quadrats/react';
import { LINK_TYPE } from '@quadrats/common/link';
import { createReactLink } from '@quadrats/react/link';
import { LinkToolbarIcon, UnlinkToolbarIcon } from '@quadrats/react/link/toolbar';
import { Toolbar } from '@quadrats/react/toolbar';

export default {
  title: 'Elements/Link',
};

export const Example = ({ type }: { type: string }) => {
  const link = createReactLink({ type });
  const renderElement = composeRenderElements([link.createRenderElement()]);
  const initialValues: Descendant[] = [
    {
      type: PARAGRAPH_TYPE,
      children: [
        {
          text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
        },
        {
          type: link.type,
          url: 'https://github.com/Quadrats/quadrats',
          children: [
            {
              text: 'Quadrats',
            },
          ],
        } as QuadratsElement,
        {
          text: ' Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        },
      ],
    },
  ];

  const Editor = () => {
    const [value, setValue] = useState(initialValues);
    const editor = useMemo(() => link.with(createReactEditor()), []);

    return (
      <Quadrats editor={editor} theme={THEME_QDR} onChange={setValue} value={value}>
        <Toolbar>
          {() => (
            <>
              <LinkToolbarIcon controller={link} icon={LinkIcon} />
              <UnlinkToolbarIcon controller={link} icon={UnlinkIcon} />
            </>
          )}
        </Toolbar>
        <Editable className="stories__custom-elements stories__editable" renderElement={renderElement} />
      </Quadrats>
    );
  };

  return <Editor />;
};

Example.args = {
  type: LINK_TYPE,
};
