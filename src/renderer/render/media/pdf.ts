import { parse } from '../../../parser';
import { html } from 'typed-dom';
import { Cache } from 'spica/cache';

const extensions = new Set([
  '.pdf',
]);

export function pdf(url: URL, cache?: Cache<string, HTMLElement>): HTMLElement | undefined {
  if (!extensions.has(url.pathname.split(/(?=\.)/).pop()!)) return;
  if (cache?.has(url.href)) return cache.get(url.href)!.cloneNode(true) as HTMLAudioElement;
  const el = html('div', { class: 'media', style: 'position: relative;' }, [
    html('div', { style: 'position: relative; resize: vertical; overflow: hidden; padding-bottom: 10px;' }, [
      html('object', {
        type: 'application/pdf',
        data: url.href,
        style: 'width: 100%; height: 100%; min-height: 400px;',
      }),
    ]),
    html('div', { style: 'word-wrap: break-word;' },
      parse(`**{ ${url.href} }**`).firstElementChild!.childNodes),
  ]);
  cache?.set(url.href, el.cloneNode(true));
  return el;
}
