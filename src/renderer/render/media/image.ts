import { html } from 'typed-dom';
import { Collection } from 'spica/collection';

export function image(url: URL, alt: string, cache?: Collection<string, HTMLElement>): HTMLImageElement {
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
