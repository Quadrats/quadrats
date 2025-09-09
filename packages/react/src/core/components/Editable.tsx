import React, { JSX, CompositionEvent, useCallback, useState } from 'react';
import { Editable as SlateEditable, useSlate } from 'slate-react';
import { Element } from 'slate';
import { EditableProps as SlateEditableProps } from 'slate-react/dist/components/editable';
import clsx from 'clsx';
import { BaseRange, Editor, isAncestorEmpty, Path } from '@quadrats/core';
import { useLocale, useTheme } from '@quadrats/react/configs';
import DefaultLeaf from './DefaultLeaf';
import { RenderElementProps, RenderLeafProps } from '../typings/renderer';
import { CompositionProvider } from '../contexts/composition/CompositionProvider';
import { PLACEHOLDER_KEY } from '../constants';

export type EditableProps = Omit<SlateEditableProps, 'renderLeaf' | 'renderElement'> & {
  renderLeaf?: (props: RenderLeafProps) => JSX.Element;
  renderElement?: (props: RenderElementProps) => JSX.Element;
};

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
  const [compositionType, setCompositionType] = useState<string>('');
  const [compositionPath, setCompositionPath] = useState<Path>([]);

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
        } as BaseRange);
      }

      return result;
    },
    [decorateProp, isEditorEmpty],
  );

  const onCompositionEnd = useCallback(
    (event: CompositionEvent<HTMLDivElement>) => {
      setCompositionType('');
      setCompositionPath([]);
      onCompositionEndProp?.(event);
      setPlaceholderShowable(true);
    },
    [onCompositionEndProp],
  );

  const onCompositionStart = useCallback(
    (event: CompositionEvent<HTMLDivElement>) => {
      if (editor.selection) {
        const [, path] = Editor.node(editor, editor.selection);

        const match = Editor.above(editor, {
          at: path,
          match: (n) => Element.isElement(n),
          mode: 'lowest',
        });

        if (match) {
          setCompositionPath(match[1]);
          setCompositionType(match[0].type);
        }
      }

      onCompositionStartProp?.(event);

      if (isEditorEmpty) {
        setPlaceholderShowable(false);
      }
    },
    [editor, onCompositionStartProp, isEditorEmpty],
  );

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => {
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
    <CompositionProvider compositionType={compositionType} compositionPath={compositionPath}>
      <SlateEditable
        {...slateEditableProps}
        className={clsx('qdr-editable', themeProps.className, className)}
        decorate={decorate}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        renderLeaf={renderLeaf}
        style={{ ...themeProps.style, ...style }}
      />
    </CompositionProvider>
  );
}

export default Editable;
