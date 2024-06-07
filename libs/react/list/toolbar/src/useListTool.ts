import { ListRootTypeKey } from '@quadrats/common/list';
import { useQuadrats } from '@quadrats/react';
import { ReactList } from '@quadrats/react/list';

export function useListTool(controller: ReactList, listTypeKey: ListRootTypeKey) {
  const editor = useQuadrats();

  return {
    active: controller.isSelectionInList(editor, listTypeKey),
    onClick: () => controller.toggleList(editor, listTypeKey),
  };
}
