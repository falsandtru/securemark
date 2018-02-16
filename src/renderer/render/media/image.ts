import { cache } from '../../../parser/inline/media';
import { html } from 'typed-dom';

export function image(url: string, alt: string): HTMLImageElement {
  return cache.has(url)
    ? cache.get(url)!.cloneNode(true) as HTMLImageElement
    : cache.set(url, html('img', {
        class: 'media',
        src: url,
        alt,
        style: 'max-width: 100%;',
      }).cloneNode(true) as HTMLImageElement);
}
