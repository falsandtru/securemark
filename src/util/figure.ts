import { index, isGroup } from '../parser/inline/extension/label';
import { html, define } from 'typed-dom';

const headers = new WeakMap<HTMLElement, HTMLSpanElement>();

export function figure(source: DocumentFragment | HTMLElement): void {
  const figures = new Map<string, HTMLElement[]>();
  const exclusion = new Set(source.querySelectorAll('.example'));
  return void source.querySelectorAll<HTMLElement>('figure[class^="label:"]')
    .forEach(figure => {
      if (exclusion.has(figure.closest('.example')!)) return;
      const label = figure.className;
      const group = figure.getAttribute('data-group')!;
      const acc = figures.get(group) || figures.set(group, []).get(group)!;
      void acc.push(figure);
      const idx = index(label, acc);
      void figure.setAttribute('data-index', `${idx}`);
      void figure.setAttribute('id', `${label.split('-', 1)[0]}-${idx}`);
      const caption = figure.lastElementChild! as HTMLElement;
      assert(caption.matches('figcaption'));
      const header = headers.has(figure)
        ? headers.get(figure)!
        : html('span', group === '$' ? `(${idx})` : `${capitalize(group)}. ${idx}.`);
      void headers.set(figure, header);
      void caption.insertBefore(header, caption.firstChild);
      const query = isGroup(label) ? label.split('-').slice(0, -1).join('-') : label;
      void source.querySelectorAll(`a.${query.replace(/[:$.]/g, '\\$&')}`)
        .forEach(ref =>
          void define(ref, { href: `#${figure.id}` }, header.textContent!.replace(/[.]$/, '')));
    });
}

function capitalize(label: string): string {
  return label[0].toUpperCase() + label.slice(1);
}
