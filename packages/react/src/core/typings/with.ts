import { QuadratsReactEditor } from '..';

export interface ReactWithable<R = undefined> {
  with: <T extends QuadratsReactEditor>(editor: T) => R extends undefined ? T : T & R;
}
