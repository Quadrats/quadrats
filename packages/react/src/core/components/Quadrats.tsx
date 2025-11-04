import React, { Dispatch, SetStateAction } from 'react';
import { Slate } from 'slate-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'; // dnd provider 只能有一個，所以必須放在 root
import { ConfigsProvider, ConfigsProviderProps } from '@quadrats/react/configs';
import { ModalProvider } from '../contexts/modal/ModalProvider';
import { MessageProvider } from '../contexts/message/MessageProvider';
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
      <DndProvider backend={HTML5Backend}>
        <MessageProvider>
          <ModalProvider needConfirmModal={needConfirmModal} setNeedConfirmModal={setNeedConfirmModal}>
            <Slate editor={editor} onChange={onChange} initialValue={value}>
              {children}
            </Slate>
          </ModalProvider>
        </MessageProvider>
      </DndProvider>
    </ConfigsProvider>
  );
}

export default Quadrats;
