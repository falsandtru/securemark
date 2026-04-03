import { MarkdownParser } from '../../markdown';
import { Input, Recursion } from './context';
import { Parser, Node } from '../combinator/parser';
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
    readonly interpolation?: boolean;
    readonly references: HTMLOListElement;
  }
  const loop = build(segment, block);
  return always<Parser<DocumentFragment | HTMLElement, Input<Memory>>>([
    (input, output) => {
      input.id =
        input.id === '' ? '' :
        input.local ? randomID() :
        input.id;
      input.memory = input.notes ?? {
        interpolation: true,
        references: html('ol', { class: 'references' }),
      };
      output.push();
      return output.context;
    },
    recursion(Recursion.scope, force(() => loop)),
    (input, output) => {
      assert(input.position === input.source.length);
      const doc = frag(unwrap(output.pop()));
      output.append(new Node(doc));
      assert(input.id !== '' || !doc.querySelector('[id], .index[href], .label[href], .annotation > a[href], .reference > a[href]'));
      if (input.test && !input.local) return output.context;
      const { memory } = input;
      const orphan = !memory.references.parentNode;
      orphan && doc.appendChild(memory.references);
      for (const _ of figure(doc, memory, input));
      for (const _ of note(doc, memory, input));
      orphan && !memory.interpolation && memory.references.remove();
      return output.context;
    },
  ]);
})();
