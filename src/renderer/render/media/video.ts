import { html, define } from 'typed-dom';
import { Collection } from 'spica/collection';
import { ObjectFromEntries } from 'spica/alias';

const extensions = [
  '.webm',
  '.ogv',
];

export function video(target: HTMLImageElement, url: URL, cache?: Collection<string, HTMLElement>): HTMLVideoElement | undefined {
  if (!extensions.includes(url.pathname.split(/(?=\.)/).pop()!)) return;
  if (cache?.has(url.href)) return define(
    cache.get(url.href)!.cloneNode(true) as HTMLVideoElement,
    ObjectFromEntries([...target.attributes]
      .map(attr => [attr.name, attr.value])));
  const el = html('video', {
    src: target.getAttribute('data-src'),
    ...ObjectFromEntries([...target.attributes]
      .map(attr => [attr.name, attr.value])),
    muted: '',
    controls: '',
  });
  cache?.set(url.href, define(el.cloneNode(true), {
    width: null,
    height: null,
    'aspect-ratio': null,
  }));
  return el;
}
