import { createList, CreateListOptions, ListTypeKey } from '@quadrats/common/list';
import { Element, Node } from '@quadrats/core';
import { createRenderElements } from '@quadrats/react';
import { defaultRenderListElements } from './defaultRenderListElements';
import { ReactList } from './typings';

export type CreateReactListOptions = CreateListOptions;

export function createReactList(options: CreateReactListOptions = {}): ReactList {
  const core = createList(options);

  return {
    ...core,
    createRenderElement: (options = {}) => createRenderElements(
      (['ol', 'ul', 'li'] as ListTypeKey[]).map(key => ({
        type: core.types[key],
        render: options[key] || defaultRenderListElements[key],
      })),
    ),
    createHandlers: () => ({
      onKeyDown: (event, editor, next) => {
        if (event.key === 'Tab') {
          const entries = core.getAboveListAndItem(editor);

          if (entries) {
            event.preventDefault();

            const [, path] = entries.listItem;

            const depth = path.filter((_, i) => {
              const ancestorPath = path.slice(0, i + 1);
              const ancestor = Node.get(editor, ancestorPath);

              return Element.isElement(ancestor) && (ancestor.type === 'ol' || ancestor.type === 'ul');
            }).length;

            if (depth >= 4) {
              return;
            }

            (event.shiftKey ? core.decreaseListItemDepth : core.increaseListItemDepth)(editor, entries);

            return;
          }
        }

        next();
      },
    }),
  };
}
