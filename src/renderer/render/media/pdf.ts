import { parse } from '../../../parser';
import { html } from 'typed-dom';
import { Collection } from 'spica/collection';

const extensions = [
  '.pdf',
];

export function pdf(url: URL, cache?: Collection<string, HTMLElement>): HTMLElement | undefined {
  if (!extensions.includes(url.pathname.split(/(?=\.)/).pop()!)) return;
  if (cache?.has(url.href)) return cache.get(url.href)!.cloneNode(true) as HTMLAudioElement;
  const el = html('div', { class: 'media' }, [
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
