import { define } from 'typed-dom';
import { Collection } from 'spica/collection';
import { ObjectFromEntries } from 'spica/alias';

export function image(target: HTMLImageElement, url: URL, cache?: Collection<string, HTMLElement>): HTMLImageElement {
  if (cache?.has(url.href)) return define(
    cache.get(url.href)!.cloneNode(true) as HTMLImageElement,
    ObjectFromEntries([...target.attributes]
      .map(attr => [attr.name, attr.value])));
  define(target, {
    src: target.getAttribute('data-src'),
    loading: 'lazy',
  });
  cache?.set(url.href, define(target.cloneNode(true), {
    width: null,
    height: null,
    'aspect-ratio': null,
  }));
  return target;
}
