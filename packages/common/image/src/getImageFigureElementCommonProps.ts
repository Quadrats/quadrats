import { ImageFigureElement } from './typings';

export function getImageFigureElementCommonProps(
  element: ImageFigureElement,
): {
    style?: {
      '--qdr-image-align': 'flex-start' | 'center' | 'flex-end',
      width: string;
    };
  } {
  const { width, align } = element;

  return {
    style:  { width: typeof width === 'number' ? `${width}%` : 'unset', '--qdr-image-align': align ?? 'flex-start' },
  };
}
