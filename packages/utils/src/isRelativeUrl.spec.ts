import { isRelativeUrl } from './isRelativeUrl';

describe('isRelativeUrl', () => {
  it.each(['/', '/articles/123', '/articles?page=2', './detail', '../list', '#section', '?page=2'])(
    'should accept %s',
    (url) => {
      expect(isRelativeUrl(url)).toBe(true);
    },
  );

  it.each(['', 'https://example.com', 'www.example.com', '//example.com', 'foo bar', '/foo bar', 'about'])(
    'should reject %s',
    (url) => {
      expect(isRelativeUrl(url)).toBe(false);
    },
  );
});
