import { parse } from '../../../parser';
import { html } from 'typed-dom';

const extensions = [
  '.pdf',
];

export function pdf(target: HTMLImageElement, url: URL): HTMLElement | undefined {
  if (!extensions.includes(url.pathname.split(/(?=\.)/).pop()!)) return;
  const el = html('div', { class: target.className }, [
    html('div', [
      html('object', {
        type: 'application/pdf',
        data: target.getAttribute('data-src'),
      }),
    ]),
    html('div', { style: 'word-wrap: break-word;' },
      parse(`**{ ${target.getAttribute('data-src')} }**`).firstElementChild!.childNodes),
  ]);
  return el;
}
