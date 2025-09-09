import React from 'react';
import Table from './components/Table';
import TableTitle from './components/TableTitle';
import TableMain from './components/TableMain';
import TableHeader from './components/TableHeader';
import TableRow from './components/TableRow';
import TableCell from './components/TableCell';
import { TableRenderElements } from './typings';
import TableBody from './components/TableBody';

export const defaultRenderTableElements: TableRenderElements = {
  table: (props) => <Table {...props} />,
  table_title: (props) => <TableTitle {...props} />,
  table_main: (props) => <TableMain {...props} />,
  table_header: (props) => <TableHeader {...props} />,
  table_body: (props) => <TableBody {...props} />,
  table_row: (props) => <TableRow {...props} />,
  table_cell: (props) => <TableCell {...props} />,
};
