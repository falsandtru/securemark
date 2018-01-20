import { cache } from '../../../parser/inline/media';
import DOM from 'typed-dom';

export function audio(url: string, alt: string): HTMLAudioElement {
  return cache.has(url)
    ? cache.get(url)!.cloneNode(true) as HTMLAudioElement
    : cache.set(url, DOM.audio({
        class: 'media',
        src: url,
        alt,
        controls: '',
        style: 'width: 100%;',
      }).element.cloneNode(true) as HTMLAudioElement);
}
