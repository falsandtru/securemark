import { cache } from '../../../parser/inline/media';
import { html } from 'typed-dom';

export function video(url: string, alt: string): HTMLVideoElement {
  return cache.has(url)
    ? cache.get(url)!.cloneNode(true) as HTMLVideoElement
    : cache.set(url, html('video', {
        src: url,
        alt,
        muted: '',
        controls: '',
        style: 'max-width: 100%;',
      }).cloneNode(true));
}
