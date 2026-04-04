import { MarkdownParser } from '../../markdown';
import { Input, Recursion } from './context';
import { Parser, Result, Node } from '../combinator/parser';
import { always, force, recursion } from '../combinator';
import { build } from './parser';
import { parser as segment } from './segment';
import { block } from './block';
import { unwrap, randomID } from './util';
import { figure } from '../processor/figure';
import { note } from '../processor/note';
import { frag, html } from 'typed-dom/dom';

export const document: MarkdownParser = (() => {
  interface Memory {
    readonly interpolation: boolean;
    readonly references: HTMLOListElement;
    doc?: DocumentFragment;
    orphan?: boolean;
  }
  const loop = build(segment, block);
  return always<Parser<DocumentFragment | HTMLElement, Input<Memory>>>([
    (input, output) => {
      input.id =
        input.id === '' ? '' :
        input.local ? randomID() :
        input.id;
      input.memory = {
        interpolation: !input.notes,
        references: input.notes?.references ?? html('ol', { class: 'references' }),
      };
      output.push();
      return output.context;
    },
    recursion(Recursion.document, force(() => loop)),
    (input, output) => {
      assert(input.position === input.source.length);
      const { memory } = input;
      const doc = memory.doc = frag(unwrap(output.pop()));
      output.append(new Node(doc));
      assert(input.id !== '' || !doc.querySelector('[id], .index[href], .label[href], .annotation > a[href], .reference > a[href]'));
      if (input.test && !input.local) return output.context;
      memory.orphan = !memory.references.parentNode;
      memory.orphan && doc.appendChild(memory.references);
      return output.context;
    },
    (input, output) => {
      if (input.test && !input.local) return output.context;
      const { memory } = input;
      return conv(figure(memory.doc!, memory, input));
    },
    (input, output) => {
      if (input.test && !input.local) return output.context;
      const { memory } = input;
      return conv(note(memory.doc!, memory, input));
    },
    (input, output) => {
      const { memory } = input;
      memory.orphan && !memory.interpolation && memory.references.remove();
      return output.context;
    },
  ]);
})();

function conv<T>(iterable: Iterable<T>): Result<never> {
  const iter = iterable[Symbol.iterator]();
  const cont: Result<T> = [
    (_, output) => {
      const { done } = iter.next();
      return done
        ? output.context
        : cont;
    },
  ];
  return cont;
}
