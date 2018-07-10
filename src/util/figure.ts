import { html } from 'typed-dom';

export function figure(
  source: DocumentFragment | HTMLElement,
  header: (caption: HTMLElement) => string
    = caption => caption.getAttribute('data-type') === '$'
        ? `(${caption.getAttribute('data-index')})`
        : capitalize(`${caption.getAttribute('data-type')}. ${caption.getAttribute('data-index')}.`)
): void {
  return void [...source.querySelectorAll<HTMLElement>('figure[class^="label:"]')]
    .reduce((map, el) => {
      const label = el.className;
      const caption = el.lastElementChild! as HTMLElement;
      assert(caption.matches('figcaption[data-type]:not(:empty)'));
      const type = caption.getAttribute('data-type')!;
      const es = map.get(type) || map.set(type, []).get(type)!;
      void es.push(el);
      const idx = index(label, es);
      void el.setAttribute('id', `${label.split('-', 1)[0]}-${idx}`);
      void caption.setAttribute('data-index', `${idx}`);
      assert(caption.matches('figcaption[data-type][data-index]:not(:empty)'));
      if (caption.children.length === 1) {
        void caption.insertBefore(html('span', header(caption.cloneNode())), caption.firstChild);
      }
      else {
        void caption.replaceChild(html('span', header(caption.cloneNode())), caption.firstChild!);
      }
      const query = isGroup(label) ? label.split('-').slice(0, -1).join('-') : label;
      void source.querySelectorAll(`a.${query.replace(/[:$.]/g, '\\$&')}`)
        .forEach(link => {
          assert(link.childNodes.length === 1);
          void link.setAttribute('href', `#${el.id}`);
          void link.replaceChild(caption.firstChild!.firstChild!.cloneNode(true), link.firstChild!);
        });
      return map;
    }, new Map<string, HTMLElement[]>())
}

function index(label: string, es: HTMLElement[]): string {
  switch (true) {
    case isFixed(label):
      return label.split('-').pop()!;
    case isGroup(label):
      return increment(
        label.split('-').pop()!,
        es.length > 1 ? es[es.length - 2].querySelector('figcaption')!.getAttribute('data-index')! : '');
    default:
      return increment(
        label.split('-').pop()!.split('.')[0],
        es.length > 1 ? es[es.length - 2].querySelector('figcaption')!.getAttribute('data-index')!.split('.')[0] : '');
  }
}

function isFixed(label: string): boolean {
  return label.split(':').pop()!.search(/^[a-z][0-9a-z]*-[0-9]+(?:\.[0-9]+)*$/) === 0;
}

function isGroup(label: string): boolean {
  return label.split('-').pop()!.search(/^0(?:\.0)*$/) === 0
      && !isFixed(label);
}

function increment(order: string, prev: string): string {
  if (!prev) return '1';
  const ps = prev.split('.');
  const os = order.split('.');
  return Array(Math.max(ps.length, os.length)).fill(0)
    .map((_, i) => +ps[i])
    .map((p, i) =>
      isFinite(p)
        ? i + 1 < os.length
          ? p
          : i + 1 === os.length
            ? p + 1
            : NaN
        : i + 1 < os.length
          ? 0
          : 1)
    .filter(isFinite)
    .join('.');
}

function capitalize(label: string): string {
  return label[0].toUpperCase() + label.slice(1);
}
