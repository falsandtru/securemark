import { cache } from '../../../parser/inline/media';
import DOM from 'typed-dom';

export function image(url: string, alt: string): HTMLImageElement {
  return cache.has(url)
    ? cache.get(url)!.cloneNode(true) as HTMLImageElement
    : cache.set(url, DOM.img({
        class: 'media',
        src: url,
        alt,
        style: 'max-width: 100%;',
      }).element.cloneNode(true) as HTMLImageElement);
}
