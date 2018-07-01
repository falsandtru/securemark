import { eval } from '../../combinator';
import { block } from '../block';
import { segment } from './segment';

export function parse(source: string): DocumentFragment {
  return segment(source)
    .reduce((parent, seg) => (
      void eval(block(seg))
        .forEach(el =>
          void parent.appendChild(el)),
      parent
    ), document.createDocumentFragment());
}
