import { loop } from '../combinator/loop';
import { block } from '../parser/block';
import { segment } from '../parser/segment';

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

const symbols = /[`#&*|\\()\[\]{}]/g;

export function escape(source: string): string {
  return source.replace(symbols, '\\$&');
}
