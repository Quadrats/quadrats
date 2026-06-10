import { createEditor, Editor, PARAGRAPH_TYPE } from '@quadrats/core';
import { createLink } from './createLink';
import { LINK_TYPE } from './constants';

function createEditorWithLink(url: string, link = createLink(), text = 'anchor') {
  const editor = link.with(createEditor());

  editor.children = [
    {
      type: PARAGRAPH_TYPE,
      children: [{ text: '' }, { type: LINK_TYPE, url, children: [{ text }] }, { text: '' }],
    },
  ];

  return editor;
}

function countLinks(editor: Editor) {
  return Array.from(Editor.nodes(editor, { at: [], match: node => (node as any).type === LINK_TYPE })).length;
}

describe('createLink normalizeNode', () => {
  it.each([
    'https://example.com',
    'https://example.com:8443/path',
    'http://localhost:3000',
    '/articles/123',
    './detail',
    '../list',
    '#section',
    '?page=2',
  ])('should keep link with url %s', (url) => {
    const editor = createEditorWithLink(url);

    Editor.normalize(editor, { force: true });

    expect(countLinks(editor)).toBe(1);
  });

  it.each(['not a url', ''])('should unwrap link with invalid url %j', (url) => {
    const editor = createEditorWithLink(url);

    Editor.normalize(editor, { force: true });

    expect(countLinks(editor)).toBe(0);
  });

  it('should unwrap link without content', () => {
    const editor = createEditorWithLink('https://example.com', createLink(), '');

    Editor.normalize(editor, { force: true });

    expect(countLinks(editor)).toBe(0);
  });

  it('should respect custom isValidHref', () => {
    const editor = createEditorWithLink('https://example.com', createLink({ isValidHref: () => false }));

    Editor.normalize(editor, { force: true });

    expect(countLinks(editor)).toBe(0);
  });

  it('should expose isValidHref on the controller', () => {
    const link = createLink();

    expect(link.isValidHref('/relative')).toBe(true);
    expect(link.isValidHref('https://example.com')).toBe(true);
    expect(link.isValidHref('not a url')).toBe(false);
  });
});
