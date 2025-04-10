import React, {
  useRef,
  useState,
  useContext,
  useCallback,
} from 'react';
import clsx from 'clsx';
import {
  Transforms,
} from '@quadrats/core';
import { ReactEditor, ThemeContext, useQuadrats } from '@quadrats/react';
import { StartToolInput, ToolInputConfig } from '../typings';
import { StartToolInputContext } from '../contexts/StartToolInputContext';
import ToolbarInput from './ToolbarInput';

export interface FixedToolbarProps {
  /**
   * A render props which provide a flag `expanded` which useful for rendering different things between collapsed and expanded.
   */
  children: () => JSX.Element | null | undefined;
}

function FixedToolbar(props: FixedToolbarProps) {
  const { children } = props;
  const { props: themeProps } = useContext(ThemeContext);
  const editor = useQuadrats();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { selection } = editor;
  const [toolInput, setToolInput] = useState<ToolInputConfig>();
  const startToolInput: StartToolInput = useCallback(
    inputConfig => setToolInput({
      ...inputConfig,
      currentSelection: selection,
    }),
    [selection],
  );

  const tools = children();

  if (!tools) {
    return null;
  }

  return (
    <div
      ref={toolbarRef}
      className={clsx(
        'qdr-toolbar__wrapper',
        'qdr-toolbar__wrapper--fixed',
        { 'qdr-toolbar__wrapper--inputting': toolInput },
        themeProps.className,
      )}
      style={themeProps.style}
    >
      <div className="qdr-toolbar">
        <StartToolInputContext.Provider value={startToolInput}>{tools}</StartToolInputContext.Provider>
        {toolInput && (
          <ToolbarInput
            exit={() => {
              const { currentSelection } = toolInput;

              if (currentSelection) {
                Transforms.select(editor, currentSelection);
              }

              ReactEditor.focus(editor);
              setToolInput(undefined);
            }}
            toolInput={toolInput}
          />
        )}
      </div>
    </div>
  );
}

export default FixedToolbar;
