import { getMark, WithMarkType } from '@quadrats/core';
import { ToggleMark } from './typings';

export type CreateToggleMarkCreatorOptions = WithMarkType & {
  variant?: string;
};

export type CreateToggleMarkOptions = Partial<CreateToggleMarkCreatorOptions> & {
  variant?: string;
};

export function createToggleMarkCreator(defaults: CreateToggleMarkCreatorOptions) {
  return ({ type = defaults.type, variant = defaults.variant }: CreateToggleMarkOptions = {}): ToggleMark => {
    const isToggleMarkActive: ToggleMark['isToggleMarkActive'] = (editor) => {
      const mark = getMark<boolean>(editor, type);

      if (mark !== true) return false;

      const nowVariant = getMark<string>(editor, `${type}Variant`) || '';

      if (variant) {
        return nowVariant === variant;
      }

      return !nowVariant;
    };

    const toggleMark: ToggleMark['toggleMark'] = (editor) => {
      const isActive = isToggleMarkActive(editor);

      if (isActive) {
        editor.removeMark(type);

        if (variant) {
          editor.removeMark(`${type}Variant`);
        }
      } else {
        editor.addMark(type, true);

        if (variant) {
          editor.addMark(`${type}Variant`, variant);
        } else {
          editor.removeMark(`${type}Variant`);
        }
      }
    };

    return {
      type,
      isToggleMarkActive,
      toggleMark,
    };
  };
}
