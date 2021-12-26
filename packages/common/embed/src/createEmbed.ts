import {
  Element,
  normalizeVoidElementChildren,
  PARAGRAPH_TYPE,
  QuadratsElement,
  Transforms,
} from '@quadrats/core';
import {
  Embed,
  EmbedElement,
  EmbedStrategies,
} from './typings';
import { EMBED_TYPE } from './constants';
import { serializeEmbedCode } from './serializeEmbedCode';

export interface CreateEmbedOptions<P extends string> {
  type?: string;
  strategies: EmbedStrategies<P>;
}

export function createEmbed<P extends string>(options: CreateEmbedOptions<P>): Embed<P> {
  const { type = EMBED_TYPE, strategies } = options;
  const insertEmbed: Embed<P>['insertEmbed'] = (editor, providers, embedCode, defaultNode = PARAGRAPH_TYPE) => {
    const result = serializeEmbedCode(embedCode, strategies, providers);

    if (result) {
      const [provider, data] = result;
      const embedElement: EmbedElement = {
        ...data, type, provider, children: [{ text: '' }],
      };

      Transforms.insertNodes(editor, [
        embedElement,
        typeof defaultNode === 'string'
          ? { type: defaultNode, children: [{ text: '' }] } as QuadratsElement : defaultNode,
      ]);

      Transforms.move(editor);
    }
  };

  return {
    type,
    strategies,
    insertEmbed,
    with(editor) {
      const { isVoid, normalizeNode } = editor;

      editor.isVoid = element => (element as QuadratsElement).type === type || isVoid(element);
      editor.normalizeNode = (entry) => {
        const [node, path] = entry;

        if (Element.isElement(node) && (node as QuadratsElement).type === type) {
          const strategy = (node as EmbedElement).provider
            ? strategies[(node as EmbedElement).provider as P] : undefined;

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
