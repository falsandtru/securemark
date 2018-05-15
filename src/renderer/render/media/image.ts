import { cache } from '../../../parser/inline/media';
import { html } from 'typed-dom';

export function image(url: URL, alt: string): HTMLImageElement {
  return cache.has(url.href)
    ? cache.get(url.href)!.cloneNode(true) as HTMLImageElement
    : cache.set(url.href, html('img', {
        src: url.href,
        alt,
        style: 'max-width: 100%;',
      }).cloneNode(true));
}
