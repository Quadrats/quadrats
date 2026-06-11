/**
 * Whether the given string looks like a relative url, e.g. `/articles/123`,
 * `./detail`, `../list`, `#section` or `?page=2`.
 *
 * Protocol-relative urls (`//example.com`) are excluded on purpose since they
 * are absolute urls in disguise and should be validated by `isUrl` instead.
 */
export function isRelativeUrl(arg: string): boolean {
  return /^(\/(?!\/)|\.\.?\/|#|\?)\S*$/.test(arg);
}
