import React, { ReactNode } from 'react';
import { Path, Transforms } from '@quadrats/core';
import { EmbedElement } from '@quadrats/common/embed';
import { AlignLeft, AlignCenter, AlignRight, Edit, Trash } from '@quadrats/icons';
import { QuadratsReactEditor, ReactEditor, useSlateStatic, useModal } from '@quadrats/react';
import { InlineToolbar } from '@quadrats/react/toolbar';

export interface BaseEmbedElementWithoutToolbarProps {
  element: EmbedElement;
  children: ReactNode;
}

export interface BaseEmbedElementProps {
  element: EmbedElement;
  haveAlignConfig?: boolean;
  type?: 'input' | 'textarea';
  placeholder?: string;
  hint?: string;
  confirmText?: string;
  onConfirm?: (editor: QuadratsReactEditor, path: Path, value: string) => void;
  children: (toolbarElement: ReactNode) => ReactNode;
}

export const BaseEmbedElementWithoutToolbar = ({ children }: BaseEmbedElementWithoutToolbarProps) => {
  return <div className="qdr-embed">{children}</div>;
};

const BaseEmbedElement = ({
  element,
  haveAlignConfig = true,
  type = 'input',
  placeholder,
  hint,
  confirmText,
  onConfirm,
  children,
}: BaseEmbedElementProps) => {
  const { setEmbedModalConfig } = useModal();
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);

  return (
    <div className="qdr-embed">
      {children(
        <InlineToolbar
          className="qdr-embed__inline-toolbar"
          iconGroups={[
            haveAlignConfig
              ? {
                  enabledBgColor: true,
                  icons: [
                    {
                      icon: AlignLeft,
                      onClick: () => {
                        Transforms.setNodes(editor, { align: 'left' } as EmbedElement, { at: path });
                      },
                      active: element.align === 'left' || !element.align,
                    },
                    {
                      icon: AlignCenter,
                      onClick: () => {
                        Transforms.setNodes(editor, { align: 'center' } as EmbedElement, { at: path });
                      },
                      active: element.align === 'center',
                    },
                    {
                      icon: AlignRight,
                      onClick: () => {
                        Transforms.setNodes(editor, { align: 'right' } as EmbedElement, { at: path });
                      },
                      active: element.align === 'right',
                    },
                  ],
                }
              : { icons: [] },
            {
              icons: [
                {
                  icon: Edit,
                  onClick: () => {
                    setEmbedModalConfig({
                      placeholder: placeholder || '',
                      confirmText: confirmText || '',
                      hint: hint || '',
                      type,
                      onConfirm: (value) => {
                        onConfirm?.(editor, path, value);
                      },
                    });
                  },
                },
                {
                  icon: Trash,
                  onClick: () => {
                    Transforms.removeNodes(editor, { at: path });
                  },
                },
              ],
            },
          ]}
        />,
      )}
    </div>
  );
};

export default BaseEmbedElement;
