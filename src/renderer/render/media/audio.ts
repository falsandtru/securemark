import { html } from 'typed-dom/dom';

const extensions = [
  '.oga',
  '.ogg',
];

export function audio(source: HTMLImageElement, url: URL): HTMLAudioElement | undefined {
  if (!extensions.includes(url.pathname.split(/(?=\.)/).pop()!)) return;
  return html('audio', {
    class: source.className,
    'data-type': 'audio',
    src: source.getAttribute('data-src'),
    alt: source.alt,
    controls: '',
  });
}
