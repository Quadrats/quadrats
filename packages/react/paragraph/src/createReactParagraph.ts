import { createParagraph, Paragraph } from '@quadrats/common/paragraph';

export function createReactParagraph(): Paragraph {
  const core = createParagraph();

  return {
    ...core,
  };
}
