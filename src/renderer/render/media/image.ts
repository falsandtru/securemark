import DOM from 'typed-dom';
import { cache } from '../../../parser/inline/media';

export function image(source: HTMLImageElement): HTMLImageElement | HTMLAnchorElement {
  assert(source.hasAttribute('data-src'));
  assert(source.hasAttribute('alt'));
  const url = source.getAttribute('data-src')!;
  const el = cache.has(url)
    ? cache.get(url)!.cloneNode(true) as HTMLImageElement
    : cache.set(url, DOM.img({
        class: 'media',
        src: url,
        alt: source.getAttribute('alt')!,
        style: 'max-width: 100%;',
      }).element.cloneNode(true) as HTMLImageElement);
  return source.parentElement
      && source.parentElement.matches('a')
      && source.parentElement.replaceChild(el, source)
    ? el.parentElement! as HTMLImageElement
    : el;
}
