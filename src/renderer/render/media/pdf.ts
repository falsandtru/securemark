import { parse } from '../../../parser';
import { cache } from '../../../parser/inline/media';
import { html } from 'typed-dom';

export function pdf(url: URL): HTMLElement | undefined {
  if (!['.pdf'].includes(url.pathname.split(/(?=\.)/).pop()!)) return;
  if (cache.has(url.href)) return cache.get(url.href)!.cloneNode(true) as HTMLAudioElement;
  return cache.set(
    url.href,
    html('div', { style: 'position: relative;' }, [
      html('div', { style: 'position: relative; resize: vertical; overflow: hidden; padding-bottom: 10px;' }, [
        html('object', {
          type: 'application/pdf',
          data: url.href,
          style: 'width: 100%; height: 100%; min-height: 400px;',
          typemustmatch: '',
        }),
      ]),
      html('div', { style: 'word-wrap: break-word;' },
        parse(`**[]( ${url.href} )**`).firstElementChild!.childNodes),
    ]));
}
