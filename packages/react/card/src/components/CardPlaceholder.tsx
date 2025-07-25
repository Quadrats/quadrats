import React from 'react';
import { RenderCardPlaceholderElementProps } from '../typings';

export function CardPlaceholder({ attributes }: RenderCardPlaceholderElementProps) {
  return <div {...attributes} className="qdr-card__placeholder" contentEditable={false}></div>;
}

export default CardPlaceholder;
