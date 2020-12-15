import React from 'react';
import { Slate } from 'slate-react';
import { ConfigsProvider, ConfigsProviderProps } from '@quadrats/react/configs';

export type QuadratsProps = Pick<Parameters<typeof Slate>[0], 'children' | 'editor' | 'onChange' | 'value'> &
Omit<ConfigsProviderProps, 'children'>;

/**
 * Provide configs of quadrats and control the value.
 */
function Quadrats(props: QuadratsProps) {
  const {
    children, editor, locale, onChange, theme, value,
  } = props;

  return (
    <ConfigsProvider theme={theme} locale={locale}>
      <Slate editor={editor} onChange={onChange} value={value}>
        {children}
      </Slate>
    </ConfigsProvider>
  );
}

export default Quadrats;
