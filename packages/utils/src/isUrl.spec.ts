import { isUrl } from './isUrl';

describe('isUrl', () => {
  it.each([
    'https://example.com',
    'http://example.com/path?q=1',
    'https://example.com/path#fragment',
    'www.example.com',
    'mailto:foo@example.com',
  ])('should accept %s', (url) => {
    expect(isUrl(url)).toBe(true);
  });

  it.each([
    'https://example.com:8443/path',
    'http://localhost:3000',
    'http://localhost:3000/articles?page=2',
    'www.example.com:8080',
  ])('should accept url with port: %s', (url) => {
    expect(isUrl(url)).toBe(true);
  });

  it.each(['not a url', '', '/relative/path', './relative', '#section'])('should reject %s', (url) => {
    expect(isUrl(url)).toBe(false);
  });
});
