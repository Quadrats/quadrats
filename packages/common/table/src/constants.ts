import { TableTypes } from './typings';

export const TABLE_TYPE = 'table';
export const TABLE_TITLE_TYPE = 'table_title';
export const TABLE_MAIN_TYPE = 'table_main';
export const TABLE_HEADER_TYPE = 'table_header';
export const TABLE_BODY_TYPE = 'table_body';
export const TABLE_ROW_TYPE = 'table_row';
export const TABLE_CELL_TYPE = 'table_cell';

export const TABLE_TYPES: TableTypes = {
  table: TABLE_TYPE,
  table_title: TABLE_TITLE_TYPE,
  table_main: TABLE_MAIN_TYPE,
  table_header: TABLE_HEADER_TYPE,
  table_body: TABLE_BODY_TYPE,
  table_row: TABLE_ROW_TYPE,
  table_cell: TABLE_CELL_TYPE,
};

// Table limits
export const TABLE_MAX_COLUMNS = 6;
export const TABLE_MAX_ROWS = 9;
