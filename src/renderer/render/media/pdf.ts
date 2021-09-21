import { parse } from '../../../parser';
import { html } from 'typed-dom';

const extensions = [
  '.pdf',
];

export function pdf(source: HTMLImageElement, url: URL): HTMLElement | undefined {
  if (!extensions.includes(url.pathname.split(/(?=\.)/).pop()!)) return;
  return html('div', { class: source.className, 'data-type': 'pdf' }, [
    html('object', {
      type: 'application/pdf',
      data: source.getAttribute('data-src'),
    }),
    html('div',
      parse(`**{ ${source.getAttribute('data-src')} }**`).firstElementChild!.childNodes),
  ]);
}
