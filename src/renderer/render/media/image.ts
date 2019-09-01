import { cache } from '../../../parser/inline/media';
import { html } from 'typed-dom';

export function image(url: URL, alt: string): HTMLImageElement {
  if (cache.has(url.href)) return cache.get(url.href)!.cloneNode(true) as HTMLImageElement;
  return cache.set(
    url.href,
    html('img', {
      class: 'media',
      src: url.href,
      alt,
      style: 'max-width: 100%;',
    }).cloneNode(true));
}
