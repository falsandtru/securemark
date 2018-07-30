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

function index(label: string, figs: HTMLElement[]): string {
  assert(figs.length > 0);
  return isFixed(label)
    ? label.split('-').pop()!
    : increment(
        figs.length === 1 ? '0' : figs[figs.length - 2].getAttribute('data-index')!,
        isGroup(label) ? label.split('-').pop()!.split('.').length : 1);
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
  const idx: number[] = [];
  for (let i = 0; i < position; ++i) {
    void idx.push(
      i < ns.length
        ? i + 1 < position
          ? +ns[i]
          : +ns[i] + 1
        : i + 1 < position
          ? 0
          : 1);
  }
  return idx.join('.');
}

function capitalize(label: string): string {
  return label[0].toUpperCase() + label.slice(1);
}
