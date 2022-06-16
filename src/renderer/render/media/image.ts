import { Object } from 'spica/global';
import { Dict } from 'spica/dict';
import { define } from 'typed-dom/dom';

export function image(source: HTMLImageElement, url: URL, cache?: Dict<string, HTMLElement>): HTMLImageElement {
  if (cache?.has(url.href)) return define(
    cache.get(url.href)!.cloneNode(true) as HTMLImageElement,
    Object.fromEntries([...source.attributes]
      .map(attr => [attr.name, attr.value])));
  define(source, {
    'data-type': 'image',
    src: source.getAttribute('data-src'),
    loading: 'lazy',
  });
  cache?.set(url.href, define(
    source.cloneNode(true),
    Object.fromEntries([...source.attributes]
      .filter(attr => !['class', 'data-type', 'data-src', 'src', 'loading'].includes(attr.name))
      .map(attr => [attr.name, null]))));
  return source;
}
