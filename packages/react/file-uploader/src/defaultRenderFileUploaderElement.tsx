import React from 'react';
import FileUploader from './components/FileUploader';
import FileUploaderPlaceholder from './components/FileUploaderPlaceholder';
import { RenderFileUploaderElement, RenderFileUploaderPlaceholderElement } from './typings';

export const defaultRenderFileUploaderElement: RenderFileUploaderElement = props => <FileUploader {...props} />;
export const defaultRenderFileUploaderPlaceholderElement: RenderFileUploaderPlaceholderElement =
props => <FileUploaderPlaceholder {...props} />;