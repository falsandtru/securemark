import { loop } from './combinator/loop';
import { block } from './parser/block';

export interface Parser<R, P extends Parser<any, any>[]> {
  (source: string): Result<R, P>;
}
export type Result<R, _ extends Parser<any, any>[]> = [R[], string] | [R[], string, _] | undefined;

export function parse(source: string): DocumentFragment {
  return Array.from((loop(block)(source) || [[]])[0])
    .reduce((doc, el) => (void doc.appendChild(el), doc), document.createDocumentFragment());
}
