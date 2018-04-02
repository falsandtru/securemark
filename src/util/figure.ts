import { html } from 'typed-dom';

export function figure(source: DocumentFragment | HTMLElement, header: (caption: HTMLElement) => string = el => capitalize(`${el.getAttribute('data-type')}. ${el.getAttribute('data-index')}.`)): void {
  return void [...source.querySelectorAll<HTMLElement>('figure[class^="label:"]')]
    .reduce((map, el) => {
      const label = el.className;
      const caption = el.lastElementChild! as HTMLElement;
      const type = caption.getAttribute('data-type')!;
      const es = map.get(type) || map.set(type, []).get(type)!;
      void es.push(el);
      const idx = index(label, es);
      void el.setAttribute('id', `${label.split('-', 1)[0]}-${idx}`);
      void caption.setAttribute('data-index', `${idx}`);
      if (caption.children.length === 1) {
        void caption.insertBefore(html('span', header(caption.cloneNode())), caption.firstChild);
      }
      else {
        void caption.replaceChild(html('span', header(caption.cloneNode())), caption.firstChild!);
      }
      void source.querySelectorAll(`a.${label.replace(/[:.]/g, '\\$&')}`)
        .forEach(link => {
          void link.setAttribute('href', `#${el.id}`);
          void link.replaceChild(caption.firstChild!.firstChild!.cloneNode(true), link.firstChild!);
        });
      return map;
    }, new Map<string, HTMLElement[]>())

  function index(label: string, es: HTMLElement[]): string {
    switch (true) {
      case isFixed(label):
        return label.split('-').pop()!;
      case isGroup(label):
        return increment(label.split('-').pop()!, es.length > 1 ? es[es.length - 2].lastElementChild!.getAttribute('data-index')! : '');
      default:
        return es.length + '';
    }
  }

  function isFixed(label: string): boolean {
    return label.split(':').pop()!.search(/^[a-z][0-9a-z]*-[0-9]+(?:\.[0-9]+)*$/) === 0;
  }

  function isGroup(label: string): boolean {
    return label.split('-').pop()!.search(/^0(?:\.0)*$/) === 0;
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
}

function capitalize(label: string): string {
  return label[0].toUpperCase() + label.slice(1);
}
