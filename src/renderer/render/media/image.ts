import DOM from 'typed-dom';
import { cache } from '../../../parser/inline/media';

export function image(source: HTMLImageElement): HTMLElement {
  assert(source.hasAttribute('data-src'));
  assert(source.getAttribute('data-src') !== '');
  const url = source.getAttribute('data-src')!;
  void source.removeAttribute('data-src');
  source = DOM.img({
    class: 'media',
    src: url,
    style: 'max-width: 100%;',
  }, () => source).element;
  void cache.set(url, <HTMLImageElement>source.cloneNode(true));
  return <HTMLElement>source.closest('a') || source;
}
