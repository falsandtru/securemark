import { eval } from '../../combinator';
import { block } from '../block';
import { segment } from './segment';
import { normalize } from './normalization';

export function parse(source: string): DocumentFragment {
  return segment(normalize(source))
    .reduce((parent, seg) => (
      void eval(block(seg))
        .forEach(el =>
          void parent.appendChild(el)),
      parent
    ), document.createDocumentFragment());
}
