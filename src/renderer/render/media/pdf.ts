import { parse } from '../../../parser';
import { html, define } from 'typed-dom/dom';

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
    html('div', [
      define(parse(`{ ${source.getAttribute('data-src')} }`).querySelector('a')!, {
        class: null,
        target: '_blank',
      }),
    ]),
  ]);
}
