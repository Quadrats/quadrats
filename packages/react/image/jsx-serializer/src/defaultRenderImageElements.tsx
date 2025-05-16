import React from 'react';
import { ImageJsxSerializeElements } from './typings';

export const defaultRenderImageElements: ImageJsxSerializeElements = {
  figure: ({ children, style }) => (
    <figure className="qdr-image__figure" style={style}>
      {children}
    </figure>
  ),
  image: ({ caption, src }) => (
    <div className="qdr-image">
      <img src={src} alt={caption} />
    </div>
  ),
  caption: ({ children, isEmpty }) =>
    isEmpty ? (
      <span className="qdr-image__caption-placeholder" />
    ) : (
      <figcaption className="qdr-image__caption">{children}</figcaption>
    ),
};
