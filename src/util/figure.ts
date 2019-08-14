import { index } from '../parser/inline/extension/label';
import { isGroup, isFixed } from '../parser/inline';
import { parse } from '../parser/api';
import { define } from 'typed-dom';

export function figure(source: DocumentFragment | HTMLElement | ShadowRoot): void {
  let base = '0';
  const indexes = new Map<string, string>();
  const exclusions = new Set<Element>();
  for (let fig of source.querySelectorAll<HTMLElement>('figure[data-label][data-group], h2[id]')) {
    if (fig.matches('h2')) {
      assert(fig.parentNode === source);
      if (fig.parentNode !== source) continue;
      if (base === '0') continue;
      fig = parse(`[$-${+base.split('.', 1)[0] + 1}.0]\n$$\n$$`).querySelector('figure')!;
    }
    assert(fig.matches('figure'));
    if (fig.parentElement && exclusions.has(fig.parentElement)) continue;
    if (fig.closest('aside')) continue;
    if (fig.parentElement && fig.parentElement !== source && fig.parentElement.matches('blockquote')) {
      void exclusions.add(fig.parentElement);
      void figure(fig.parentElement);
      continue;
    }
    const label = fig.getAttribute('data-label')!;
    const group = fig.getAttribute('data-group')!;
    assert(label && group);
    let idx = index(label, indexes.get(group) || base);
    if (idx.endsWith('.0')) {
      assert(isFixed(label));
      assert(fig.style.display === 'none');
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
    if (fig.closest('blockquote')) continue;
    void fig.setAttribute('id', `label:${label.split(/-0(?![0-9])/, 1)[0]}`);
    const query = isGroup(label) ? label.split('-').slice(0, -1).join('-') : label;
    for (const ref of source.querySelectorAll(`a.label[data-label="${query.replace(/[$.]/g, '\\$&')}"]`)) {
      void define(ref, { href: `#${fig.id}` }, figindex.textContent!.replace(/[.]$/, ''));
    }
  }
}

function capitalize(label: string): string {
  return label[0].toUpperCase() + label.slice(1);
}
