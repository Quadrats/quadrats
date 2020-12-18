import React, {
  useRef,
  useLayoutEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import clsx from 'clsx';
import {
  getSelectionText,
  isNodesTypeIn,
  Range as QuadratsRange,
  Transforms,
} from '@quadrats/core';
import { ReactEditor, ThemeContext, useQuadrats } from '@quadrats/react';
import { Portal } from '@quadrats/react/components';
import { StartToolInput, ToolInputConfig } from '../typings';
import { StartToolInputContext } from '../contexts/StartToolInputContext';
import ToolbarInput from './ToolbarInput';
import './toolbar.scss';

function roundNumber(value: number, min: number, max: number) {
  if (value < min) {
    return min;
  } if (value > max) {
    return max;
  }

  return value;
}

/**
 * @todo
 * Also round top.
 */
function setPosition(el: HTMLElement, range: Range) {
  const rect = range.getBoundingClientRect();
  const top = rect.top + window.pageYOffset - el.offsetHeight;
  const left = roundNumber(
    rect.left + window.pageXOffset - (el.offsetWidth - rect.width) / 2,
    0,
    window.innerWidth - el.offsetWidth,
  );

  el.style.top = `${top}px`;
  el.style.left = `${left}px`;
}

export interface ToolbarProps {
  /**
   * If there are any nodes which type match it, toolbar will hide.
   */
  disabledElementTypes?: string[];
  /**
   * A render props which provide a flag `expanded` which useful for rendering different things between collapsed and expanded.
   */
  children: (expanded: boolean) => JSX.Element | null | undefined;
}

function Toolbar(props: ToolbarProps) {
  const { children, disabledElementTypes } = props;
  const { props: themeProps } = useContext(ThemeContext);
  const editor = useQuadrats();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const lastNativeRangeRef = useRef<Range>();
  const focused = ReactEditor.isFocused(editor);
  const { selection } = editor;
  const [toolInput, setToolInput] = useState<ToolInputConfig>();
  const startToolInput: StartToolInput = useCallback(
    (inputConfig) => setToolInput({
      ...inputConfig,
      currentSelection: selection,
    }),
    [selection],
  );
  let renderExpandedStatus: boolean | undefined;

  if (toolInput) {
    const { currentSelection } = toolInput;

    if (currentSelection) {
      if (QuadratsRange.isExpanded(currentSelection)) {
        renderExpandedStatus = true;
      } else {
        renderExpandedStatus = false;
      }
    }
  } else if (focused) {
    if (selection && QuadratsRange.isCollapsed(selection)) {
      renderExpandedStatus = false;
    } else if (getSelectionText(editor) !== '') {
      renderExpandedStatus = true;
    }
  }

  const shouldRender = typeof renderExpandedStatus === 'boolean';

  useLayoutEffect(() => {
    /**
     * The native selection is not yet synchronized while effect invoked.
     * Thus invoke handler on next frame to avoid from this issue.
     */
    window.requestAnimationFrame(() => {
      /**
       * Editor will be blurred after getting into input process.
       * Thus cache the last range of selection to recalculate position of toolbar.
       */
      if (!toolInput) {
        const nativeSelection = window.getSelection();

        if (nativeSelection && nativeSelection.rangeCount > 0) {
          lastNativeRangeRef.current = nativeSelection.getRangeAt(0);
        }
      }

      const el = toolbarRef.current;
      const range = lastNativeRangeRef.current;

      if (shouldRender && el && range) {
        setPosition(el, range);
      }
    });
  });

  if (!shouldRender || (disabledElementTypes && isNodesTypeIn(editor, disabledElementTypes, { mode: 'all' }))) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const tools = children(renderExpandedStatus!);

  if (!tools) {
    return null;
  }

  return (
    <Portal>
      <div
        ref={toolbarRef}
        className={clsx(
          'qdr-toolbar__wrapper',
          { 'qdr-toolbar__wrapper--inputting': toolInput },
          themeProps.className,
        )}
        style={themeProps.style}
      >
        <div className="qdr-toolbar__arrow" />
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
    </Portal>
  );
}

export default Toolbar;
