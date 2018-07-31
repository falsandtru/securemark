import { index, isGroup } from '../parser/inline/extension/label';
import { html, define } from 'typed-dom';

const headers = new WeakSet<HTMLElement>();

export function figure(
  source: DocumentFragment | HTMLElement,
  header: (type: string, index: string) => string
    = (type, index) => type === '$' ? `(${index})` : `${capitalize(type)}. ${index}.`
): void {
  const figures = new Map<string, HTMLElement[]>();
  return void source.querySelectorAll<HTMLElement>('figure[class^="label:"]')
    .forEach(figure => {
      const label = figure.className;
      const type = figure.getAttribute('data-type')!;
      const acc = figures.get(type) || figures.set(type, []).get(type)!;
      void acc.push(figure);
      const idx = index(label, acc);
      void figure.setAttribute('data-index', `${idx}`);
      void figure.setAttribute('id', `${label.split('-', 1)[0]}-${idx}`);
      const caption = figure.lastElementChild! as HTMLElement;
      assert(caption.matches('figcaption'));
      !headers.has(figure)
        ? void caption.insertBefore(html('span', header(type, idx)), caption.firstChild)
        : void caption.replaceChild(html('span', header(type, idx)), caption.firstChild!);
      void headers.add(figure);
      const query = isGroup(label) ? label.split('-').slice(0, -1).join('-') : label;
      void source.querySelectorAll(`a.${query.replace(/[:$.]/g, '\\$&')}`)
        .forEach(ref =>
          void define(ref, { href: `#${figure.id}` }, caption.firstChild!.cloneNode(true).childNodes));
    });
}

function capitalize(label: string): string {
  return label[0].toUpperCase() + label.slice(1);
}
