import { AccordionElement, createAccordion, CreateAccordionOptions } from '@quadrats/common/accordion';
import { createRenderElements, RenderElementProps } from '@quadrats/react';
import { Editor, getParent, PARAGRAPH_TYPE, Path, QuadratsElement, Transforms, Element } from '@quadrats/core';
import { defaultRenderAccordionElements } from './defaultRenderAccordionElements';
import { ReactAccordion } from './typings';

export type CreateReactAccordionOptions = CreateAccordionOptions;

export function createReactAccordion(options: CreateReactAccordionOptions = {}): ReactAccordion {
  const core = createAccordion(options);
  const { types } = core;

  return {
    ...core,
    createHandlers: () => ({
      onKeyDown(event, editor, next) {
        if (core.isSelectionInAccordionTitle(editor)) {
          const blockEntry = editor.above(
            { match: node => (node as QuadratsElement).type === types.accordion_title },
          );

          if (!blockEntry) return;

          const [, currentPath] = blockEntry;

          const parentEntry = getParent(editor, currentPath);

          if (!parentEntry) return;

          const [, parentPath] = parentEntry;

          const isFirst = Path.equals(currentPath, parentPath.concat(0));

          if (isFirst) {
            if (event.key === 'Backspace' || event.key === 'Delete') {
              const text = Editor.string(editor, currentPath);

              if (!text) {
                event.preventDefault();

                return;
              }
            }

            if (editor.selection && event.key === 'Enter') {
              event.preventDefault();

              Transforms.select(editor, Editor.end(editor, Path.next(currentPath)));

              return;
            }
          }

          return;
        }

        if (core.isSelectionInAccordionContent(editor)) {
          const blockEntry = editor.above(
            { match: node => (node as QuadratsElement).type === types.accordion_content },
          );

          if (!blockEntry) return;

          const [, blockPath] = blockEntry;

          const text = Editor.string(editor, blockPath);

          if (event.key === 'Backspace' || event.key === 'Delete') {
            const prePath = Path.previous(blockPath);
            const [preNode] = Editor.node(editor, prePath);

            if (Element.isElement(preNode)) {
              const preType = preNode.type as string;

              if (preType === types.accordion_title && !text) {
                event.preventDefault();

                Transforms.select(editor, Editor.end(editor, prePath));

                return;
              }

              return;
            }

            return;
          }

          if (!text && editor.selection && event.key === 'Enter') {
            const parentEntry = getParent(editor, blockPath);

            if (!parentEntry) return;

            const [, parentPath] = parentEntry;

            event.preventDefault();
            const moveto = parentPath.slice();

            Transforms.insertNodes(
              editor,
              { type: PARAGRAPH_TYPE, children: [{ text: '' }] },
              {
                at: editor.selection,
                select: true,
              },
            );

            moveto[(parentPath.length - 1)] += 1;
            Transforms.moveNodes(editor, {
              at: editor.selection,
              to: moveto,
            });

            return;
          }
        }

        next();
      },
    }),
    createRenderElement: (options = {}) => {
      const renderAccordion = options.accordion || defaultRenderAccordionElements.accordion;
      const renderAccordionTitle = options.accordion_title || defaultRenderAccordionElements.accordion_title;
      const renderAccordionContent = options.accordion_content
        || defaultRenderAccordionElements.accordion_content;

      return createRenderElements([
        {
          type: types.accordion,
          render: (props) => {
            const { attributes, children, element } = props as RenderElementProps<AccordionElement>;

            return renderAccordion({
              attributes,
              element,
              children,
            });
          },
        },
        {
          type: types.accordion_title,
          render: (props) => {
            const { attributes, children, element } = props as RenderElementProps;

            return renderAccordionTitle({
              attributes,
              element,
              children,
            });
          },
        },
        {
          type: types.accordion_content,
          render: (props) => {
            const { attributes, children, element } = props as RenderElementProps;

            return renderAccordionContent({
              attributes,
              element,
              children,
            });
          },
        },
      ]);
    },
  };
}
