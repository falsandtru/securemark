import { html } from 'typed-dom';
import { Cache } from 'spica/cache';

export function image(url: URL, alt: string, cache?: Cache<string, HTMLElement>): HTMLImageElement {
  if (cache?.has(url.href)) return cache.get(url.href)!.cloneNode(true) as HTMLImageElement;
  const el = html('img', {
    class: 'media',
    src: url.href,
    alt,
    style: 'max-width: 100%;',
  });
  cache?.set(url.href, el.cloneNode(true));
  return el;
}
