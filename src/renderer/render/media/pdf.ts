import { parse } from '../../../parser';
import { html, define } from 'typed-dom';
import { Collection } from 'spica/collection';

const extensions = [
  '.pdf',
];

export function pdf(target: HTMLImageElement, url: URL, cache?: Collection<string, HTMLElement>): HTMLElement | undefined {
  if (!extensions.includes(url.pathname.split(/(?=\.)/).pop()!)) return;
  if (cache?.has(url.href)) return define(
    cache.get(url.href)!.cloneNode(true) as HTMLElement,
    { class: target.className });
  const el = html('div', { class: target.className }, [
    html('div', { style: 'position: relative; resize: vertical; overflow: hidden; padding-bottom: 10px;' }, [
      html('object', {
        type: 'application/pdf',
        data: target.getAttribute('data-src'),
        style: 'width: 100%; height: 100%; min-height: 400px;',
        loading: 'lazy',
      }),
    ]),
    html('div', { style: 'word-wrap: break-word;' },
      parse(`**{ ${target.getAttribute('data-src')} }**`).firstElementChild!.childNodes),
  ]);
  cache?.set(url.href, el.cloneNode(true));
  return el;
}
