import { AccordionElement, createAccordion, CreateAccordionOptions } from '@quadrats/common/accordion';
import { createRenderElements, RenderElementProps } from '@quadrats/react';
import { Editor, getParent, PARAGRAPH_TYPE, Path, QuadratsElement, Transforms } from '@quadrats/core';
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
          if (event.key === 'Backspace' || event.key === 'Delete') {
            const blockEntry = editor.above(
              { match: node => (node as QuadratsElement).type === types.accordion_title },
            );

            if (!blockEntry) return;

            const [, childPath] = blockEntry;

            const parentEntry = getParent(editor, childPath);

            if (!parentEntry) return;

            const [, parentPath] = parentEntry;

            const isFirst = Path.equals(childPath, parentPath.concat(0));

            if (isFirst) {
              event.preventDefault();

              return;
            }

            return;
          }
        }

        if (core.isSelectionInAccordionContent(editor)) {
          const blockEntry = editor.above(
            { match: node => (node as QuadratsElement).type === types.accordion_content },
          );

          if (!blockEntry) return;

          const [, blockPath] = blockEntry;

          const text = Editor.string(editor, blockPath);

          if (event.key === 'Backspace' || event.key === 'Delete') {
            if (!text) {
              event.preventDefault();

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
