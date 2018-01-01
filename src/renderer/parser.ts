import { loop } from '../combinator';
import { block } from '../parser/block';
import { segment } from '../parser/segment';

export function parse(source: string): DocumentFragment {
  return segment(source)
    .reduce((frag, seg) =>
      parse_(seg)
        .reduce((doc, el) =>
          (void doc.appendChild(el), doc)
        , frag)
    , document.createDocumentFragment());
}

export function parse_(source: string): HTMLElement[] {
  assert.deepStrictEqual([source], segment(source));
  assert.deepStrictEqual(block(source), loop(block)(source));
  return (block(source) || [[]])[0];
}

const symbols = /^[#~:|>`$-+*\s]|^[0-9a-z]+\.|[*`$&()\[\]{}]|\\./gim;

export function escape(source: string): string {
  return source.replace(symbols, str => str[0] === '\\' ? str : `\\${str}`);
}
