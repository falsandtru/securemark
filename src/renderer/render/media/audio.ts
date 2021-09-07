import { html } from 'typed-dom';

const extensions = [
  '.oga',
  '.ogg',
];

export function audio(target: HTMLImageElement, url: URL): HTMLAudioElement | undefined {
  if (!extensions.includes(url.pathname.split(/(?=\.)/).pop()!)) return;
  const el = html('audio', {
    class: target.className,
    src: target.getAttribute('data-src'),
    alt: target.alt,
    controls: '',
  });
  return el;
}
