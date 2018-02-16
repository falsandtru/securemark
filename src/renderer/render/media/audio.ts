import { cache } from '../../../parser/inline/media';
import { html } from 'typed-dom';

export function audio(url: string, alt: string): HTMLAudioElement {
  return cache.has(url)
    ? cache.get(url)!.cloneNode(true) as HTMLAudioElement
    : cache.set(url, html('audio',{
        class: 'media',
        src: url,
        alt,
        controls: '',
        style: 'width: 100%;',
      }).cloneNode(true) as HTMLAudioElement);
}
