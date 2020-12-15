import { ListTypeKey, LIST_TYPES } from '@quadrats/common/list';
import { createJsxSerializeElements, CreateJsxSerializeElementOptions } from '@quadrats/react/jsx-serializer';
import { defaultRenderListElements } from './defaultRenderListElements';
import { JsxSerializeListElementProps } from './typings';

export type CreateJsxSerializeListOptions = {
  [key in ListTypeKey]?: CreateJsxSerializeElementOptions<JsxSerializeListElementProps>;
};

export function createJsxSerializeList(options: CreateJsxSerializeListOptions = {}) {
  return createJsxSerializeElements<JsxSerializeListElementProps>(
    (['ol', 'ul', 'li'] as ListTypeKey[]).map((key) => {
      const { type = LIST_TYPES[key], render = defaultRenderListElements[key] } = options[key] || {};

      return {
        type,
        render,
      };
    }),
  );
}
