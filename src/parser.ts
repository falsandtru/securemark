import { loop } from './combinator/loop';
import { block } from './parser/block';
import { segment } from './parser/segment';

export interface Parser<R, P extends Parser<any, any>[]> {
  (source: string): Result<R, P>;
}
export type Result<R, _ extends Parser<any, any>[]> = [R[], string] | [R[], string, _] | undefined;

export function parse(source: string): DocumentFragment {
  return segment(source)
    .reduce((doc, source) =>
      parse_(source)
        .reduce((doc, el) => (
          void doc.appendChild(el),
          doc)
        , doc)
    , document.createDocumentFragment());

  function parse_(source: string): HTMLElement[] {
    return (loop(block)(source) || [[]])[0];
  }
}
