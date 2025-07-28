import React from 'react';
import clsx from 'clsx';
import { Transforms } from '@quadrats/core';
import { RenderElementProps, useSlateStatic, ReactEditor, useModal } from '@quadrats/react';
import { InlineToolbar } from '@quadrats/react/toolbar';
import { BlockLeft, BlockRight, Edit, Trash } from '@quadrats/icons';
import { RenderCardElementProps } from '../typings';

export function Card({
  attributes,
  children,
  element,
  controller,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCardElementProps['element'];
  controller: RenderCardElementProps['controller'];
}) {
  const { setCardModalConfig, setConfirmModalConfig } = useModal();
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);

  return (
    <div {...attributes} contentEditable={false} className={clsx('qdr-card', `qdr-card--${element.alignment}`)}>
      <InlineToolbar
        className="qdr-card__inline-toolbar"
        leftIcons={
          element.alignment === 'noImage'
            ? []
            : [
                {
                  icon: BlockLeft,
                  onClick: () => {
                    controller.updateCardAlignment({
                      editor,
                      alignment: 'leftImageRightText',
                      path,
                    });
                  },
                  active: element.alignment === 'leftImageRightText',
                },
                {
                  icon: BlockRight,
                  onClick: () => {
                    controller.updateCardAlignment({
                      editor,
                      alignment: 'rightImageLeftText',
                      path,
                    });
                  },
                  active: element.alignment === 'rightImageLeftText',
                },
              ]
        }
        rightIcons={[
          {
            icon: Edit,
            onClick: () => {
              setCardModalConfig({
                controller,
                initialValue: {
                  values: {
                    alignment: element.alignment,
                    title: element.title,
                    description: element.description,
                    remark: element.remark,
                    linkText: element.linkText,
                    linkUrl: element.linkUrl,
                  },
                  imageItem: element.imageItem,
                  haveLink: element.haveLink,
                },
                onConfirm: ({ values, imageItem, haveLink }) => {
                  controller.updateCardElement({
                    editor,
                    cardValues: {
                      alignment: values.alignment,
                      imageItem,
                      title: values.title,
                      description: values.description,
                      remark: values.remark,
                      haveLink,
                      linkText: values.linkText,
                      linkUrl: values.linkUrl,
                    },
                    path,
                  });
                },
              });
            },
          },
          {
            icon: Trash,
            onClick: () => {
              if (controller.confirmModal) {
                // TODO: i18n
                setConfirmModalConfig({
                  title: '刪除卡片',
                  content: '是否確認刪除此卡片？刪除後將立即移除，且此操作無法復原。',
                  confirmText: '刪除卡片',
                  onConfirm: () => {
                    Transforms.removeNodes(editor, { at: path });
                  },
                });
              } else {
                Transforms.removeNodes(editor, { at: path });
              }
            },
          },
        ]}
      />
      {children}
    </div>
  );
}

export function CardWithoutToolbar({
  attributes,
  children,
  element,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCardElementProps['element'];
}) {
  return (
    <div {...attributes} contentEditable={false} className={clsx('qdr-card', `qdr-card--${element.alignment}`)}>
      {children}
    </div>
  );
}

export default Card;
