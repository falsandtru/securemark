import { html } from 'typed-dom';
import { Cache } from 'spica/cache';

const extensions = new Set([
  '.oga',
  '.ogg',
]);

export function audio(url: URL, alt: string, cache?: Cache<string, HTMLElement>): HTMLAudioElement | undefined {
  if (!extensions.has(url.pathname.split(/(?=\.)/).pop()!)) return;
  if (cache?.has(url.href)) return cache.get(url.href)!.cloneNode(true) as HTMLAudioElement;
  const el = html('audio', {
    class: 'media',
    src: url.href,
    alt,
    controls: '',
    style: 'width: 100%;',
  });
  cache?.set(url.href, el.cloneNode(true));
  return el;
}
