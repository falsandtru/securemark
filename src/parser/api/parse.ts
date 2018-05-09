import { some } from '../../combinator';
import { block } from '../block';
import { segment } from './segment';

export function parse(source: string): DocumentFragment {
  return segment(source)
    .reduce((parent, seg) => (
      void parse_(seg)
        .forEach(el =>
          void parent.appendChild(el)),
      parent
    ), document.createDocumentFragment());
}

export function parse_(source: string): HTMLElement[] {
  assert.deepStrictEqual([source], segment(source));
  assert.deepStrictEqual(block(source), some(block)(source));
  return (block(source) || [[]])[0];
}
