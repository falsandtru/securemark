import { ObjectFromEntries } from 'spica/alias';
import { Collection } from 'spica/collection';
import { define } from 'typed-dom/dom';

export function image(source: HTMLImageElement, url: URL, cache?: Collection<string, HTMLElement>): HTMLImageElement {
  if (cache?.has(url.href)) return define(
    cache.get(url.href)!.cloneNode(true) as HTMLImageElement,
    ObjectFromEntries([...source.attributes]
      .map(attr => [attr.name, attr.value])));
  define(source, {
    'data-type': 'image',
    src: source.getAttribute('data-src'),
    loading: 'lazy',
  });
  cache?.set(url.href, define(
    source.cloneNode(true),
    ObjectFromEntries([...source.attributes]
      .filter(attr => !['class', 'data-type', 'data-src', 'src', 'loading'].includes(attr.name))
      .map(attr => [attr.name, null]))));
  return source;
}
