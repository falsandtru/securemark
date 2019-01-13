import { index } from '../parser/inline/extension/label';
import { isGroup } from '../parser/inline';
import { parse } from '../parser/api';
import { define } from 'typed-dom';

const log = new WeakSet<Element>();

export function figure(source: DocumentFragment | HTMLElement): void {
  let skip = true;
  for (const el of source.children) {
    if (log.has(el)) continue;
    void log.add(el);
    if (!el.matches('figure') && !el.querySelector('figure, .label')) continue;
    skip = false;
  }
  if (skip) return;
  let base = '0';
  const indexes = new Map<string, string>();
  const exclusions = new Set<Element>();
  return void source.querySelectorAll<HTMLElement>('figure[data-label][data-group], h2[id]')
    .forEach(fig => {
      if (fig.matches('h2')) {
        assert(fig.parentNode === source);
        if (base === '0') return;
        fig = parse(`[:$-${+base.split('.')[0] + 1}.0]\n$$\n$$`).querySelector('figure')!;
      }
      if (fig.matches('.example figure')) return;
      if (fig.parentElement !== source && fig.parentElement instanceof HTMLQuoteElement) {
        return exclusions.has(fig.parentElement)
          ? undefined
          : void exclusions.add(fig.parentElement) ||
            void figure(fig.parentElement);
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
      if (fig.matches('blockquote *')) return;
      if (idx.endsWith('.0')) return;
      void fig.setAttribute('id', `label:${label.split('-', 1)[0]}-${idx}`);
      const query = isGroup(label) ? label.split('-').slice(0, -1).join('-') : label;
      void source.querySelectorAll(`a.label[data-label="${query.replace(/[:$.]/g, '\\$&')}"]`)
        .forEach(ref =>
          void define(ref, { href: `#${fig.id}` }, figindex.textContent!.replace(/[.]$/, '')));
    });
}

function capitalize(label: string): string {
  return label[0].toUpperCase() + label.slice(1);
}
