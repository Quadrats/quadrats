import React, { useState, useMemo } from 'react';
import { THEME_QDR } from '@quadrats/theme';
import { Descendant, PARAGRAPH_TYPE } from '@quadrats/core';
import { Quadrats, Editable, createReactEditor } from '@quadrats/react';
import { Toolbar, TOOLBAR_DIVIDER } from '@quadrats/react/toolbar';

export default {
  title: 'Widgets/Toolbar',
};

export const Example = ({ expandedText, collapsedText }: { expandedText: string; collapsedText: string }) => {
  const Editor = () => {
    const editor = useMemo(() => createReactEditor(), []);
    const [value, setValue] = useState<Descendant[]>([
      {
        type: PARAGRAPH_TYPE,
        children: [{ text: '' }],
      },
    ]);

    return (
      <Quadrats editor={editor} onChange={setValue} theme={THEME_QDR} value={value}>
        <Toolbar>
          {(expanded) => (
            <>
              {expanded ? expandedText : collapsedText}
              {TOOLBAR_DIVIDER}
              toobar
            </>
          )}
        </Toolbar>
        <Editable className="stories__editable" />
      </Quadrats>
    );
  };

  return <Editor />;
};

Example.args = {
  expandedText: 'expanded',
  collapsedText: 'collapsed',
};
