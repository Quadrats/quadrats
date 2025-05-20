import { KeyboardEvent, useLayoutEffect, useRef } from 'react';
import { useLocale, useQuadrats } from '@quadrats/react';
import { RenderInputBlockElementProps } from '../typings';

export function useInputBlock({ confirm, element, remove }: RenderInputBlockElementProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const editor = useQuadrats();
  const locale = useLocale();
  const placeholder = element.getPlaceholder?.(locale) ?? '';
  /**
   * Since keying `Enter` or `Escape` will also cause input blurred
   * Add a `removeable` flag to avoid.
   */

  const removeable = useRef(true);

  const onRemove = () => {
    removeable.current = false;
    remove(editor, element);
  };

  const onConfirm = () => {
    const value = inputRef.current?.value;

    if (value) {
      removeable.current = false;
      confirm(editor, element, value);
    }
  };

  const removeIfRemovable = () => {
    if (removeable.current) {
      onRemove();
    }
  };

  useLayoutEffect(() => {
    /**
     * To avoid from selection of quadrats broken, delay autoFocus.
     */
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }, [inputRef]);

  return {
    inputRef,
    onRemove,
    onConfirm,
    onBlur: removeIfRemovable,
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();

        onConfirm();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        removeIfRemovable();
      }
    },
    placeholder,
  };
}
