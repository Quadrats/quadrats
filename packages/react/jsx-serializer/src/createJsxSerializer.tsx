import React, { JSX, cloneElement, CSSProperties, ReactElement } from 'react';
import { Descendant, QuadratsElement } from '@quadrats/core';
import { isText, WithElementParent } from '@quadrats/core/serializers';
import { composeRenderElementsBase, composeRenderLeafsBase } from '@quadrats/react/_internal';
import { JsxSerializeElementProps, JsxSerializeLeafProps } from './typings';

let key = 0;

function addKey(element: ReactElement) {
  key += 1;

  return cloneElement(element, { key });
}

export interface CreateJsxSerializerOptioons {
  /**
   * Invoked while no any `elements` matching.
   */
  defaultElement?: (props: JsxSerializeElementProps) => JSX.Element;
  /**
   * Invoked while no any `leafs` matching.
   */
  defaultLeaf?: (props: JsxSerializeLeafProps) => JSX.Element;
  elements?: ((props: JsxSerializeElementProps) => JSX.Element | null | undefined)[];
  leafs?: ((props: JsxSerializeLeafProps) => JSX.Element)[];
}

export function createJsxSerializer(options: CreateJsxSerializerOptioons) {
  const {
    defaultElement: defaultSerializeElement = ({ children }) => <div>{children}</div>,
    defaultLeaf: defaultSerializeLeaf = ({ children }) => <span>{children}</span>,
    elements: serializeElements = [],
    leafs: serializeLeafs = [],
  } = options;

  const serializeElement = composeRenderElementsBase(defaultSerializeElement, serializeElements);
  const serializeLeaf = composeRenderLeafsBase(defaultSerializeLeaf, serializeLeafs);
  const leafStyle: CSSProperties = {
    whiteSpace: 'pre-wrap',
  };

  function serializeNode(node: Descendant & WithElementParent): JSX.Element {
    const { parent } = node;
    let result: JSX.Element;

    if (!isText(node)) {
      result = serializeElement({
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        children: serializeNodes(
          node.children as Descendant[],
          node as ((QuadratsElement & WithElementParent) | undefined),
        ),
        element: {
          ...(node as unknown as QuadratsElement),
          parent,
        },
      });
    } else if (node.text) {
      result = serializeLeaf({
        leaf: node,
        children: (
          <span style={leafStyle}>
            {node.text
              .split('\n')
              .map(t => t || ' ')
              .join('\n')}
          </span>
        ),
      });
    } else {
      result = <span>&#65279;</span>;
    }

    return addKey(result);
  }

  function serializeNodes(nodes: Descendant[], parent: (QuadratsElement & WithElementParent) | undefined): JSX.Element {
    return <>{nodes.map(node => serializeNode({ ...node, parent }))}</>;
  }

  return {
    serialize: (nodes: Descendant[]) => serializeNodes(nodes, undefined),
  };
}
