import { html } from 'typed-dom';
import { Cache } from 'spica/cache';

const extensions = [
  '.webm',
  '.ogv',
];

export function video(url: URL, alt: string, cache?: Cache<string, HTMLElement>): HTMLVideoElement | undefined {
  if (!extensions.includes(url.pathname.split(/(?=\.)/).pop()!)) return;
  if (cache?.has(url.href)) return cache.get(url.href)!.cloneNode(true) as HTMLVideoElement;
  const el = html('video', {
    class: 'media',
    src: url.href,
    alt,
    muted: '',
    controls: '',
    style: 'max-width: 100%;',
  });
  cache?.set(url.href, el.cloneNode(true));
  return el;
}
