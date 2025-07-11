import React, { useState } from 'react';
import { Transforms } from '@quadrats/core';
import { RenderElementProps, useSlateStatic, ReactEditor, useModal } from '@quadrats/react';
import { InlineToolbar } from '@quadrats/react/toolbar';
import { Edit, Trash } from '@quadrats/icons';
import { CarouselContext } from '../contexts/CarouselContext';
import { RenderCarouselElementProps } from '../typings';

export function Carousel({
  attributes,
  children,
  element,
  controller,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCarouselElementProps['element'];
  controller: RenderCarouselElementProps['controller'];
}) {
  const { setCarouselModalConfig } = useModal();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);

  return (
    <CarouselContext.Provider
      value={{
        activeIndex,
        setActiveIndex,
      }}
    >
      <div {...attributes} contentEditable={false} className="qdr-carousel">
        <InlineToolbar
          className="qdr-carousel__inline-toolbar"
          leftIcons={[]}
          rightIcons={[
            {
              icon: Edit,
              onClick: () => {
                setCarouselModalConfig({
                  controller,
                  initialValue: element.items,
                  onConfirm: (items) => {
                    controller.updateCarouselElement({ editor, items, path });
                  },
                });
              },
            },
            {
              icon: Trash,
              onClick: () => {
                Transforms.removeNodes(editor, { at: path });
              },
            },
          ]}
        />
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselWithoutToolbar({
  attributes,
  children,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCarouselElementProps['element'];
}) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <CarouselContext.Provider
      value={{
        activeIndex,
        setActiveIndex,
      }}
    >
      <div {...attributes} contentEditable={false} className="qdr-carousel">
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export default Carousel;
