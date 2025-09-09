import React from 'react';
import { RenderElementProps } from '@quadrats/react';
import { Icon } from '@quadrats/react/components';
import { Plus } from '@quadrats/icons';
import { useTable } from '../hooks/useTable';

function TableMain(props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) {
  const { attributes, children } = props;

  const { addColumn, addRow, addColumnAndRow, isReachMaximumColumns, isReachMaximumRows } = useTable();

  return (
    <div className="qdr-table__mainWrapper">
      <table {...attributes} className="qdr-table__main">
        {children}
      </table>
      {isReachMaximumColumns ? null : (
        <button type="button" onClick={addColumn} title="Add Column" className="qdr-table__add-column">
          <Icon icon={Plus} width={20} height={20} className="qdr-table__btn-icon" />
        </button>
      )}
      {isReachMaximumRows ? null : (
        <button type="button" onClick={addRow} title="Add Row" className="qdr-table__add-row">
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
