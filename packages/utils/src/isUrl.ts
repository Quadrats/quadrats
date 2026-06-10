export function isUrl(arg: string): boolean {
  //  eslint-disable-next-line max-len,no-useless-escape
  return /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+(?::\d{1,5})?|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+(?::\d{1,5})?)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)$/.test(
    arg,
  );
}
