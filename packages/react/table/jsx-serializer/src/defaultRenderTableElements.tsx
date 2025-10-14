import React from 'react';
import { TableJsxSerializeElements } from './typings';
import { TableJsxSerializeElement } from './components/Table';
import { TableTitleJsxSerializeElement } from './components/TableTitle';
import { TableMainJsxSerializeElement } from './components/TableMain';
import { TableHeaderJsxSerializeElement } from './components/TableHeader';
import { TableBodyJsxSerializeElement } from './components/TableBody';
import { TableRowJsxSerializeElement } from './components/TableRow';
import { TableCellJsxSerializeElement } from './components/TableCell';

export const defaultRenderTableElements: TableJsxSerializeElements = {
  table: (props) => <TableJsxSerializeElement {...props} />,
  table_title: (props) => <TableTitleJsxSerializeElement {...props} />,
  table_main: (props) => <TableMainJsxSerializeElement {...props} />,
  table_header: (props) => <TableHeaderJsxSerializeElement {...props} />,
  table_body: (props) => <TableBodyJsxSerializeElement {...props} />,
  table_row: (props) => <TableRowJsxSerializeElement {...props} />,
  table_cell: (props) => <TableCellJsxSerializeElement {...props} />,
};
