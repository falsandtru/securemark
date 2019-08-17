import { index } from '../parser/inline/extension/label';
import { isGroup, isFixed } from '../parser/inline';
import { parse } from '../parser/api';
import { MultiMap } from 'spica/multimap';
import { define } from 'typed-dom';

export function figure(source: DocumentFragment | HTMLElement | ShadowRoot): void {
  const bound = 'blockquote, aside';
  const context = source instanceof Element && source.closest(bound) || null;
  const contextual = new WeakMap<Node, boolean>();
  const memory = new Map<string, string>();
  const refs = new MultiMap<string, Element>([...source.querySelectorAll('a.label')].filter(validate).map(el => [el.getAttribute('data-label')!, el]));
  let base = '0';
  for (let def of source.children) {
    if (def.matches('h2')) {
      assert(def.parentNode === source);
      if (base === '0') continue;
      def = parse(`[$-${+base.split('.', 1)[0] + 1}.0]\n$$\n$$`).firstChild as HTMLElement;
    }
    if (!def.matches('figure')) continue;
    const label = def.getAttribute('data-label')!;
    const group = def.getAttribute('data-group')!;
    assert(label && group);
    let number = index(label, memory.get(group) || base);
    if (number.endsWith('.0')) {
      assert(isFixed(label));
      assert(def.matches('[style]'));
      base = number = number.startsWith('0.')
        ? base.split('.')
            .reduce((idx, _, i, base) => {
              i === idx.length
                ? base.length = i
                : idx[i] = +idx[i] > +base[i]
                  ? idx[i]
                  : +idx[i] === 0
                    ? base[i]
                    : `${+base[i] + 1}`;
              return idx;
            }, number.split('.'))
            .join('.')
        : number;
      void memory.clear();
      void def.setAttribute('data-index', number);
      continue;
    }
    void memory.set(group, number);
    void def.setAttribute('data-index', number);
    const figid = isGroup(label) ? label.slice(0, label.lastIndexOf('-')) : label;
    void def.setAttribute('id', `label:${figid}`);
    const figindex = group === '$' ? `(${number})` : `${capitalize(group)}. ${number}`;
    void define([...def.children].find(el => el.matches('.figindex'))!, group === '$' ? figindex : `${figindex}. `);
    for (const ref of refs.ref(figid)) {
      void define(ref, { href: `#${def.id}` }, figindex);
    }
  }
  return;

  function validate(el: Element): boolean {
    const node = el.parentNode && el.parentNode.parentNode || el.parentNode;
    return !node
      ? true
      : contextual.has(node)
        ? contextual.get(node)!
        : contextual.set(node, el.closest(bound) === context).get(node)!;
  }
}

function capitalize(label: string): string {
  return label[0].toUpperCase() + label.slice(1);
}
