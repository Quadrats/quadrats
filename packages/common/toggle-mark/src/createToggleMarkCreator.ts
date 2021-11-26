import { getMark, WithMarkType, marksGroupBy } from '@quadrats/core';
import { ToggleMark } from './typings';

export type CreateToggleMarkCreatorOptions = WithMarkType & {
  parentType?: string;
};

export type CreateToggleMarkOptions = Partial<CreateToggleMarkCreatorOptions> & {
  parentType?: string;
};

export function createToggleMarkCreator(defaults: CreateToggleMarkCreatorOptions) {
  return ({ type = defaults.type, parentType = defaults.parentType }: CreateToggleMarkOptions = {}): ToggleMark => {
    const isToggleMarkActive: ToggleMark['isToggleMarkActive'] = (editor) => {
      const mark = getMark<boolean>(editor, type);
      return mark === true;
    };

    const toggleMark: ToggleMark['toggleMark'] = (editor) => {
      const isActive = isToggleMarkActive(editor);

      if (isActive) {
        editor.removeMark(type);
      } else {
        if (parentType) {
          marksGroupBy(
            editor,
            (_mark) => {
              if (_mark.match(parentType)) {
                editor.removeMark(_mark);

                return true;
              }

              return false;
            },
          );
        }

        editor.addMark(type, true);
      }
    };

    return {
      type,
      isToggleMarkActive,
      toggleMark,
    };
  };
}
