import { EmbedElement } from '@quadrats/common/embed';
import { JsxSerializeElementProps } from '@quadrats/react/jsx-serializer';
import { WithEmbedRenderData } from '@quadrats/react/embed/common';

export interface JsxSerializeEmbedElementProps<EmbedData extends Record<string, unknown>, RenderData>
  extends JsxSerializeElementProps<EmbedElement & EmbedData>,
  WithEmbedRenderData<RenderData> {}
