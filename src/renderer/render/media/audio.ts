import { cache } from '../../../parser/inline/media';
import { html } from 'typed-dom';

const extensions = new Set([
  '.oga',
  '.ogg',
]);

export function audio(url: URL, alt: string): HTMLAudioElement | undefined {
  if (!extensions.has(url.pathname.split(/(?=\.)/).pop()!)) return;
  if (cache.has(url.href)) return cache.get(url.href)!.cloneNode(true) as HTMLAudioElement;
  return cache.set(
    url.href,
    html('audio', {
      class: 'media',
      src: url.href,
      alt,
      controls: '',
      style: 'width: 100%;',
    }).cloneNode(true));
}
