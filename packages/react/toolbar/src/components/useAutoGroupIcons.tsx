import React, { useLayoutEffect, useMemo, useState, ReactElement } from 'react';

export function useAutoGroupIcons(tools: JSX.Element | null | undefined) {
  const fakeTools = useMemo(() => (
    <div
      id="fake-tools-wrapper"
      className="qdr-toolbar"
      style={{ position: 'absolute', top: 0, left: 0, visibility: 'hidden', pointerEvents: 'none' }}
    >
      {tools}
    </div>
  ), [tools]);

  const [takeCount, setTakeCount] = useState<number>(0);

  const toolsElements = useMemo(() => (tools?.props.children as ReactElement[]).filter(c => !!c).map((c, index) => ({
    ...c,
    id: index,
  })), [tools]);

  useLayoutEffect(() => {
    function handler() {
      const fakeToolsWrapper = document.getElementById('fake-tools-wrapper');

      if (fakeToolsWrapper) {
        const toolbarRect = fakeToolsWrapper.getBoundingClientRect();

        if (toolbarRect.right - window.innerWidth > 0) {
          const iconWrappers = fakeToolsWrapper!.getElementsByClassName('qdr-toolbar__icon__wrapper');

          const targetIndex = Array.from(iconWrappers).findIndex((wrapper) => {
            const rect = wrapper.getBoundingClientRect();

            return rect.right > window.innerWidth;
          });

          const groupIcons = (Array.from(iconWrappers).slice(targetIndex - 1, iconWrappers.length) as HTMLElement[]);

          setTakeCount(groupIcons.length);
        } else {
          setTakeCount(0);
        }
      }
    }

    handler();

    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);

  const takeIndex = useMemo(() => toolsElements.findIndex(
    el => el.id === toolsElements.filter(e => e.type !== 'span').slice(-takeCount)[0].id,
  ), [toolsElements, takeCount]);

  const shownElements = useMemo(() => toolsElements.slice(0, takeIndex), [toolsElements, takeIndex]);
  const groupElements = useMemo(() => toolsElements.slice(takeIndex).filter(g => g.type !== 'span').map((g) => {
    if (((g.props as any)?.children as ReactElement[])?.length > 0) {
      return (g.props as any).children;
    }

    return g;
  }).reduce((acc, val) => {
    return acc.concat(val);
  }, []), [toolsElements, takeIndex]);

  return {
    fakeTools,
    takeCount,
    shownElements,
    groupElements,
  };
}