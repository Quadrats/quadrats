import { useCallback } from 'react';
import { ReactTable } from '@quadrats/react/table';
import { useQuadrats } from '@quadrats/react';

export function useTableTool(table: ReactTable) {
  const editor = useQuadrats();

  const insert = useCallback(() => {
    // Insert a 3x3 table
    table.insertTable(editor, 3, 3);
  }, [editor, table]);

  return { insert };
}
