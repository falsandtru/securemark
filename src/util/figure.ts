import { index } from '../parser/inline/extension/label';
import { isGroup, isFixed } from '../parser/inline';
import { parse } from '../parser/api';
import { MultiMap } from 'spica/multimap';
import { define } from 'typed-dom';

export function figure(source: DocumentFragment | HTMLElement | ShadowRoot): void {
  const bound = 'blockquote, aside';
  const boundary = source instanceof Element && source.closest(bound) || null;
  const memory = new WeakMap<Node, boolean>();
  const indexes = new Map<string, string>();
  const refs = new MultiMap<string, Element>([...source.querySelectorAll('a.label')].filter(validate).map(el => [el.getAttribute('data-label')!, el]));
  let base = '0';
  for (let fig of source.children) {
    if (fig.matches('h2')) {
      assert(fig.parentNode === source);
      if (base === '0') continue;
      fig = parse(`[$-${+base.split('.', 1)[0] + 1}.0]\n$$\n$$`).firstChild as HTMLElement;
    }
    if (!fig.matches('figure')) continue;
    const label = fig.getAttribute('data-label')!;
    const group = fig.getAttribute('data-group')!;
    assert(label && group);
    let idx = index(label, indexes.get(group) || base);
    if (idx.endsWith('.0')) {
      assert(isFixed(label));
      assert(fig.matches('[style]'));
      base = idx = idx.startsWith('0.')
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
            }, idx.split('.'))
            .join('.')
        : idx;
      void indexes.clear();
      void fig.setAttribute('data-index', idx);
      continue;
    }
    void indexes.set(group, idx);
    void fig.setAttribute('data-index', idx);
    const figindex = fig.lastElementChild!.previousElementSibling!;
    assert(figindex.matches('.figindex'));
    void define(figindex, group === '$' ? `(${idx})` : `${capitalize(group)}. ${idx}.`);
    const id = isGroup(label) ? label.slice(0, label.lastIndexOf('-')) : label;
    void fig.setAttribute('id', `label:${id}`);
    for (const ref of refs.ref(id)) {
      void define(ref, { href: `#${fig.id}` }, figindex.textContent!.replace(/[.]$/, ''));
    }
  }
  return;

  function validate(el: Element): boolean {
    const node = el.parentNode && el.parentNode.parentNode || el.parentNode;
    return !node
      ? true
      : memory.has(node)
        ? memory.get(node)!
        : memory.set(node, el.closest(bound) === boundary).get(node)!;
  }
}

function capitalize(label: string): string {
  return label[0].toUpperCase() + label.slice(1);
}
