import React from 'react';
import { Slate } from 'slate-react';
import { ConfigsProvider, ConfigsProviderProps } from '@quadrats/react/configs';
import { ModalProvider } from '../contexts/modal/ModalProvider';
import { Descendant } from '..';

export type QuadratsProps = Pick<Parameters<typeof Slate>[0], 'children' | 'editor'> &
  Omit<ConfigsProviderProps, 'children'> & {
    onChange: (value: Descendant[]) => void;
    value: Descendant[];
  };

/**
 * Provide configs of quadrats and control the value.
 */
function Quadrats(props: QuadratsProps) {
  const { children, editor, locale, onChange, theme, value } = props;

  return (
    <ConfigsProvider theme={theme} locale={locale}>
      <Slate editor={editor} onChange={onChange} initialValue={value}>
        <ModalProvider>{children}</ModalProvider>
      </Slate>
    </ConfigsProvider>
  );
}

export default Quadrats;
