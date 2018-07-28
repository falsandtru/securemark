import { html } from 'typed-dom';

export function figure(
  source: DocumentFragment | HTMLElement,
  header: (caption: HTMLElement) => string
    = caption => caption.getAttribute('data-type') === '$'
        ? `(${caption.getAttribute('data-index')})`
        : capitalize(`${caption.getAttribute('data-type')}. ${caption.getAttribute('data-index')}.`)
): void {
  const figures = new Map<string, HTMLElement[]>();
  return void source.querySelectorAll<HTMLElement>('figure[class^="label:"]')
    .forEach(figure => {
      const label = figure.className;
      const caption = figure.lastElementChild! as HTMLElement;
      assert(caption.matches('figcaption[data-type]:not(:empty)'));
      const type = caption.getAttribute('data-type')!;
      const acc = figures.get(type) || figures.set(type, []).get(type)!;
      void acc.push(figure);
      const idx = index(label, acc);
      void figure.setAttribute('id', `${label.split('-', 1)[0]}-${idx}`);
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
        .forEach(ref => {
          assert(ref.childNodes.length === 1);
          void ref.setAttribute('href', `#${figure.id}`);
          void ref.replaceChild(caption.firstChild!.firstChild!.cloneNode(true), ref.firstChild!);
        });
    });
}

function index(label: string, figs: HTMLElement[]): string {
  assert(figs.length > 0);
  switch (true) {
    case isFixed(label):
      return label.split('-').pop()!;
    case isGroup(label):
      return increment(
        figs.length === 1 ? '0' : figs[figs.length - 2].querySelector('figcaption')!.getAttribute('data-index')!,
        label.split('-').pop()!.split('.').length);
    default:
      return increment(
        figs.length === 1 ? '0' : figs[figs.length - 2].querySelector('figcaption')!.getAttribute('data-index')!,
        1);
  }
}

function isFixed(label: string): boolean {
  return label.split(':').pop()!.search(/^[a-z][0-9a-z]*-[0-9]+(?:\.[0-9]+)*$/) === 0;
}

function isGroup(label: string): boolean {
  return label.split('-').pop()!.search(/^0(?:\.0)*$/) === 0
      && !isFixed(label);
}

function increment(index: string, position: number): string {
  assert(index.match(/^\d+(?:\.\d+)*$/));
  assert(position > 0);
  if (index === '0' && position > 1) return increment(index, 1);
  const ns = index.split('.');
  return Array(Math.max(ns.length, position)).fill(0)
    .map((_, i) => +ns[i])
    .map((n, i) =>
      isFinite(n)
        ? i + 1 < position
          ? n
          : i + 1 === position
            ? n + 1
            : NaN
        : i + 1 < position
          ? 0
          : 1)
    .filter(isFinite)
    .join('.');
}

function capitalize(label: string): string {
  return label[0].toUpperCase() + label.slice(1);
}
