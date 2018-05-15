import { cache } from '../../../parser/inline/media';
import { html } from 'typed-dom';

export function video(url: URL, alt: string): HTMLVideoElement | undefined {
  if (!['.webm', '.ogv'].includes(url.pathname.split(/(?=\.)/).pop()!)) return;
  return cache.has(url.href)
    ? cache.get(url.href)!.cloneNode(true) as HTMLVideoElement
    : cache.set(url.href, html('video', {
        src: url.href,
        alt,
        muted: '',
        controls: '',
        style: 'max-width: 100%;',
      }).cloneNode(true));
}
