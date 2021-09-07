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
    style: 'max-width: 100%;',
    loading: 'lazy',
  });
  cache?.set(url.href, el.cloneNode(true));
  return el;
}
