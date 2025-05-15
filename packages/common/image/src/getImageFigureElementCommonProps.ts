import { ImageFigureElement } from './typings';

export function getImageFigureElementCommonProps(
  element: ImageFigureElement,
): {
    style?: {
      '--qdr-image-align': 'flex-start' | 'center' | 'flex-end',
      '--qdr-image-caption-align': 'left' | 'center' | 'right',
      width: string;
    };
  } {
  const { width, align } = element;

  return {
    style:  {
      width: typeof width === 'number' ? `${width}%` : 'unset',
      '--qdr-image-align': (() => {
        switch (align) {
          case 'start':
            return 'flex-start';

          case 'center':
            return 'center';

          case 'end':
            return 'flex-end';

          default:
            return 'flex-start';
        }
      })(),
      '--qdr-image-caption-align': (() => {
        switch (align) {
          case 'start':
            return 'left';

          case 'center':
            return 'center';

          case 'end':
            return 'right';

          default:
            return 'left';
        }
      })(),
    },
  };
}
