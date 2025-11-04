import {
  Editor,
  Element,
  normalizeVoidElementChildren,
  PARAGRAPH_TYPE,
  QuadratsElement,
  Transforms,
  isAboveBlockEmpty,
  Path,
} from '@quadrats/core';
import { Embed, EmbedElement, EmbedPlaceholderElement, EmbedStrategies } from './typings';
import { EMBED_TYPE, EMBED_PLACEHOLDER_TYPE } from './constants';
import { serializeEmbedCode } from './serializeEmbedCode';

export interface CreateEmbedOptions<P extends string> {
  type?: string;
  strategies: EmbedStrategies<P>;
}

export function createEmbed<P extends string>(options: CreateEmbedOptions<P>): Embed<P> {
  const { type = EMBED_TYPE, strategies } = options;
  const insertEmbed: Embed<P>['insertEmbed'] = (editor, provider, embedCode, defaultNode = PARAGRAPH_TYPE) => {
    const result = serializeEmbedCode(embedCode, strategies, provider);

    if (result) {
      const [provider, data] = result;
      const embedElement: EmbedElement = {
        ...data,
        type,
        provider,
        children: [{ text: '' }],
      };

      const [currentBlockEntry] = Editor.nodes(editor, {
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
      });

      if (currentBlockEntry) {
        const [, currentPath] = currentBlockEntry;

        // 在目前 block 後面插入
        const insertPath = Path.next(currentPath);

        Editor.withoutNormalizing(editor, () => {
          Transforms.insertNodes(
            editor,
            [
              embedElement,
              typeof defaultNode === 'string'
                ? ({ type: defaultNode, children: [{ text: '' }] } as QuadratsElement)
                : defaultNode,
            ],
            {
              at: insertPath,
            },
          );
        });
      } else {
        // 沒找到 block（例如空編輯器）
        Editor.withoutNormalizing(editor, () => {
          Transforms.insertNodes(editor, [
            embedElement,
            typeof defaultNode === 'string'
              ? ({ type: defaultNode, children: [{ text: '' }] } as QuadratsElement)
              : defaultNode,
          ]);
        });
      }

      if (isAboveBlockEmpty(editor)) {
        Transforms.removeNodes(editor, {
          at: editor.selection?.anchor,
        });
      }

      Transforms.move(editor);
    }
  };

  const insertEmbedPlaceholder: Embed<P>['insertEmbedPlaceholder'] = (editor, provider) => {
    const embedPlaceholderElement: EmbedPlaceholderElement = {
      type: EMBED_PLACEHOLDER_TYPE,
      provider,
      children: [{ text: '' }],
    };

    Editor.withoutNormalizing(editor, () => {
      Transforms.insertNodes(editor, embedPlaceholderElement);
    });
  };

  const removeEmbedPlaceholder: Embed<P>['removeEmbedPlaceholder'] = (editor) => {
    const matches = Array.from(
      Editor.nodes(editor, {
        at: [],
        match: (node) => Element.isElement(node) && (node as QuadratsElement).type === EMBED_PLACEHOLDER_TYPE,
      }),
    );

    if (matches.length) {
      matches
        .map(([, path]) => path)

        .forEach((path) => {
          Transforms.removeNodes(editor, { at: path });
        });
    }
  };

  return {
    type,
    strategies,
    insertEmbed,
    insertEmbedPlaceholder,
    removeEmbedPlaceholder,
    with(editor) {
      const { isVoid, normalizeNode } = editor;

      editor.isVoid = (element) => (element as QuadratsElement).type === type || isVoid(element);
      editor.normalizeNode = (entry) => {
        const [node, path] = entry;

        if (Element.isElement(node) && (node as QuadratsElement).type === type) {
          const strategy = (node as EmbedElement).provider
            ? strategies[(node as EmbedElement).provider as P]
            : undefined;

          if (!strategy || !strategy.isElementDataValid(node as QuadratsElement as Record<string, unknown>)) {
            Transforms.removeNodes(editor, { at: path });

            return;
          }

          if (normalizeVoidElementChildren(editor, [node as QuadratsElement, path])) {
            return;
          }
        }

        normalizeNode(entry);
      };

      return editor;
    },
  };
}
