import React, { Dispatch, SetStateAction } from 'react';
import { Slate } from 'slate-react';
import { ConfigsProvider, ConfigsProviderProps } from '@quadrats/react/configs';
import { ModalProvider } from '../contexts/modal/ModalProvider';
import { ConfirmModalConfig } from '../contexts/modal/modal';
import { Descendant } from '..';

export type QuadratsProps = Pick<Parameters<typeof Slate>[0], 'children' | 'editor'> &
  Omit<ConfigsProviderProps, 'children'> & {
    onChange: (value: Descendant[]) => void;
    value: Descendant[];
    needConfirmModal?: ConfirmModalConfig | null;
    setNeedConfirmModal?: Dispatch<SetStateAction<ConfirmModalConfig | null>>;
  };

/**
 * Provide configs of quadrats and control the value.
 */
function Quadrats(props: QuadratsProps) {
  const { children, editor, locale, onChange, theme, value, needConfirmModal, setNeedConfirmModal } = props;

  return (
    <ConfigsProvider theme={theme} locale={locale}>
      <Slate editor={editor} onChange={onChange} initialValue={value}>
        <ModalProvider needConfirmModal={needConfirmModal} setNeedConfirmModal={setNeedConfirmModal}>
          {children}
        </ModalProvider>
      </Slate>
    </ConfigsProvider>
  );
}

export default Quadrats;
