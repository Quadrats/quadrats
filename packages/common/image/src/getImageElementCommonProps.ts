import { ImageElement, ImageHostingResolvers } from './typings';
import { isHostingNotRequired } from './isHostingNotRequired';

export function getImageElementCommonProps(
  element: ImageElement,
  hostingResolvers?: ImageHostingResolvers<any>,
): {
    src: string;
  } {
  const { src, hosting } = element;
  const resolver = !isHostingNotRequired(src) && hosting && hostingResolvers ? hostingResolvers[hosting] : undefined;

  return {
    src: resolver ? resolver(src) : src,
  };
}
