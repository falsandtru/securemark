import { cache } from '../../../parser/inline/media';
import DOM from 'typed-dom';

export function video(url: string, alt: string): HTMLVideoElement {
  return cache.has(url)
    ? cache.get(url)!.cloneNode(true) as HTMLVideoElement
    : cache.set(url, DOM.video({
        class: 'media',
        src: url,
        alt,
        muted: '',
        controls: '',
        style: 'max-width: 100%;',
      }).element.cloneNode(true) as HTMLVideoElement);
}
