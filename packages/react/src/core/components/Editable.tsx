import React, { CompositionEvent, useCallback, useState } from 'react';
import { Editable as SlateEditable, useSlate } from 'slate-react';
import { EditableProps as SlateEditableProps } from 'slate-react/dist/components/editable';
import clsx from 'clsx';
import { Editor, isAncestorEmpty } from '@quadrats/core';
import { useLocale, useTheme } from '@quadrats/react/configs';
import DefaultLeaf from './DefaultLeaf';

const PLACEHOLDER_KEY = '__quadrats-placeholder__';

export type EditableProps = SlateEditableProps;

function Editable(props: EditableProps) {
  const locale = useLocale();
  const {
    className,
    decorate: decorateProp,
    onCompositionEnd: onCompositionEndProp,
    onCompositionStart: onCompositionStartProp,
    placeholder = locale.editor.placeholder,
    renderLeaf: renderLeafProp,
    style,
    ...slateEditableProps
  } = props;
  const { props: themeProps } = useTheme();
  const editor = useSlate();
  const isEditorEmpty = isAncestorEmpty(editor);
  const [placeholderShowable, setPlaceholderShowable] = useState(isEditorEmpty);
  const decorate: NonNullable<EditableProps['decorate']> = useCallback(
    (entry) => {
      const result = decorateProp ? decorateProp(entry) : [];
      const [node] = entry;

      if (isEditorEmpty && Editor.isEditor(node)) {
        const start = Editor.start(node, []);

        result.push({
          [PLACEHOLDER_KEY]: true,
          anchor: start,
          focus: start,
        });
      }

      return result;
    },
    [decorateProp, isEditorEmpty],
  );
  const onCompositionEnd = useCallback(
    (event: CompositionEvent<HTMLDivElement>) => {
      onCompositionEndProp?.(event);
      setPlaceholderShowable(true);
    },
    [onCompositionEndProp],
  );
  const onCompositionStart = useCallback(
    (event: CompositionEvent<HTMLDivElement>) => {
      onCompositionStartProp?.(event);

      if (isEditorEmpty) {
        setPlaceholderShowable(false);
      }
    },
    [onCompositionStartProp, isEditorEmpty],
  );
  const renderLeaf = useCallback(
    (props) => {
      const children = renderLeafProp ? renderLeafProp(props) : <DefaultLeaf {...props} />;

      if (placeholderShowable && props.leaf[PLACEHOLDER_KEY]) {
        return (
          <>
            <span className="qdr-editable__placeholder" contentEditable={false}>
              {placeholder}
            </span>
            {children}
          </>
        );
      }

      return children;
    },
    [renderLeafProp, placeholder, placeholderShowable],
  );

  return (
    <SlateEditable
      {...slateEditableProps}
      className={clsx('qdr-editable', themeProps.className, className)}
      decorate={decorate}
      onCompositionStart={onCompositionStart}
      onCompositionEnd={onCompositionEnd}
      renderLeaf={renderLeaf}
      style={{ ...themeProps.style, ...style }}
    />
  );
}

export default Editable;
