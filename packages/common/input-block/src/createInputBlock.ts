import { Editor, Path, QuadratsElement, Transforms } from '@quadrats/core';
import { InputBlock, InputBlockElement } from './typings';
import { INPUT_BLOCK_TYPE } from './constants';

export interface CreateInputBlockOptions {
  type?: string;
}

export function createInputBlock(options: CreateInputBlockOptions = {}): InputBlock {
  const { type = INPUT_BLOCK_TYPE } = options;
  const start: InputBlock['start'] = (editor, inputConfig) => {
    const inputBlock: InputBlockElement = { ...inputConfig, type, children: [{ text: '' }] };

    Editor.insertNode(editor, inputBlock);
  };
  /**
   * Set selection to end of previous path.
   */

  const remove: InputBlock['remove'] = (editor, [, path], focus) => {
    const previousPath = Path.previous(path);
    const previousEndPath = Editor.end(editor, previousPath);

    Transforms.select(editor, previousEndPath);
    focus();
    Transforms.removeNodes(editor, { at: path });
  };

  const confirm: InputBlock['confirm'] = (element, value, remove) => {
    remove();
    element.confirm(value);
  };

  return {
    type,
    start,
    remove,
    confirm,
    with(editor) {
      const { isVoid } = editor;

      editor.isVoid = (element) => {
        // invalidate unfinished input_block from storage
        if ((element as QuadratsElement).type === type
          && typeof (element as InputBlockElement).getPlaceholder !== 'function') return false;

        return (element as QuadratsElement).type === type || isVoid(element);
      };

      return editor;
    },
  };
}
