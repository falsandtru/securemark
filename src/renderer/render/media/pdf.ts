import { parse } from '../../../parser';
import { html } from 'typed-dom';

const extensions = [
  '.pdf',
];

export function pdf(source: HTMLImageElement, url: URL): HTMLElement | undefined {
  if (!extensions.includes(url.pathname.split(/(?=\.)/).pop()!)) return;
  const el = html('div', { class: source.className }, [
    html('div', [
      html('object', {
        type: 'application/pdf',
        data: source.getAttribute('data-src'),
      }),
    ]),
    html('div', { style: 'word-wrap: break-word;' },
      parse(`**{ ${source.getAttribute('data-src')} }**`).firstElementChild!.childNodes),
  ]);
  return el;
}
