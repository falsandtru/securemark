import { index } from '../parser/inline/extension/label';
import { isGroup } from '../parser/inline';
import { parse } from '../parser/api';
import { define } from 'typed-dom';

export function figure(source: DocumentFragment | HTMLElement | ShadowRoot): void {
  let base = '0';
  const indexes = new Map<string, string>();
  const exclusions = new Set<Element>();
  for (let fig of source.querySelectorAll<HTMLElement>('figure[data-label][data-group], h2[id]')) {
    if (fig.matches('h2')) {
      assert(fig.parentNode === source);
      if (base === '0') continue;
      fig = parse(`[$-${+base.split('.', 1)[0] + 1}.0]\n$$\n$$`).querySelector('figure')!;
    }
    if (fig.matches('.example figure')) continue;
    if (fig.parentElement !== source && fig.parentElement instanceof HTMLQuoteElement) {
      exclusions.has(fig.parentElement)
        ? undefined
        : void exclusions.add(fig.parentElement) ||
          void figure(fig.parentElement);
      continue;
    }
    const label = fig.getAttribute('data-label')!;
    const group = fig.getAttribute('data-group')!;
    let idx = index(label, indexes.get(group) || base);
    if (idx.endsWith('.0')) {
      base = idx = idx.startsWith('0.')
        ? `${(indexes.get(group) || base).split('.', 1)[0]}.${idx.slice(2)}`
        : idx;
      void indexes.clear();
    }
    void indexes.set(group, idx);
    void fig.setAttribute('data-index', idx);
    const figindex = fig.lastElementChild!.previousElementSibling!;
    assert(figindex.matches('.figindex'));
    void define(figindex, group === '$' ? `(${idx})` : `${capitalize(group)}. ${idx}.`);
    if (fig.matches('blockquote *')) continue;
    if (idx.endsWith('.0')) continue;
    void fig.setAttribute('id', `label:${label.split('-', 1)[0]}-${idx}`);
    const query = isGroup(label) ? label.split('-').slice(0, -1).join('-') : label;
    for (const ref of source.querySelectorAll(`a.label[data-label="${query.replace(/[$.]/g, '\\$&')}"]`)) {
      void define(ref, { href: `#${fig.id}` }, figindex.textContent!.replace(/[.]$/, ''));
    }
  }
}

function capitalize(label: string): string {
  return label[0].toUpperCase() + label.slice(1);
}
