import { EmbedElement } from '@quadrats/common/embed';
import { WithEmbedRenderData } from '@quadrats/react/embed';
import { JsxSerializeElementProps } from '@quadrats/react/jsx-serializer';

export interface JsxSerializeEmbedElementProps<EmbedData extends Record<string, unknown>, RenderData>
  extends JsxSerializeElementProps<EmbedElement & EmbedData>,
  WithEmbedRenderData<RenderData> {}
