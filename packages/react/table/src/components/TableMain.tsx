import React from 'react';
import clsx from 'clsx';
import { ReactEditor, RenderElementProps, useModal, useSlateStatic } from '@quadrats/react';
import { Icon } from '@quadrats/react/components';
import { Plus, Trash } from '@quadrats/icons';
import { useTable } from '../hooks/useTable';
import { InlineToolbar } from '@quadrats/react/toolbar';
import { Transforms } from 'slate';
import { TableElement } from '@quadrats/common/table';

function TableMain(props: RenderElementProps<TableElement>) {
  const { attributes, children } = props;

  const { setConfirmModalConfig } = useModal();
  const editor = useSlateStatic();
  const {
    addColumn,
    addRow,
    addColumnAndRow,
    isReachMaximumColumns,
    isReachMaximumRows,
    tableSelectedOn,
    tableElement,
  } = useTable();

  const tablePath = ReactEditor.findPath(editor, tableElement);

  return (
    <div
      className={clsx('qdr-table__mainWrapper', {
        'qdr-table__mainWrapper--selected': tableSelectedOn?.region === 'table',
      })}
    >
      <InlineToolbar
        className="qdr-table__inline-table-toolbar"
        iconGroups={[
          {
            icons: [
              {
                icon: Trash,
                className: 'qdr-table__delete',
                onClick: () => {
                  setConfirmModalConfig({
                    title: '刪除表格',
                    content: '是否確認刪除此表格？刪除後將立即移除，且此操作無法復原。',
                    confirmText: '刪除表格',
                    onConfirm: () => {
                      Transforms.removeNodes(editor, { at: tablePath });
                    },
                  });
                },
              },
            ],
          },
        ]}
      />
      <div className="qdr-table__scrollContainer">
        <table {...attributes} className="qdr-table__main">
          {children}
        </table>
      </div>
      {isReachMaximumColumns ? null : (
        <button type="button" onClick={() => addColumn()} title="Add Column" className="qdr-table__add-column">
          <Icon icon={Plus} width={20} height={20} className="qdr-table__btn-icon" />
        </button>
      )}
      {isReachMaximumRows ? null : (
        <button type="button" onClick={() => addRow()} title="Add Row" className="qdr-table__add-row">
          <Icon icon={Plus} width={20} height={20} className="qdr-table__btn-icon" />
        </button>
      )}
      {isReachMaximumColumns || isReachMaximumRows ? null : (
        <button type="button" onClick={addColumnAndRow} title="Add Column and Row" className="qdr-table__add-both">
          <Icon icon={Plus} width={20} height={20} className="qdr-table__btn-icon" />
        </button>
      )}
    </div>
  );
}

export default TableMain;
