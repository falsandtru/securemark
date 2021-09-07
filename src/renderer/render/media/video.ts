import { html } from 'typed-dom';
import { ObjectFromEntries } from 'spica/alias';

const extensions = [
  '.webm',
  '.ogv',
];

export function video(source: HTMLImageElement, url: URL): HTMLVideoElement | undefined {
  if (!extensions.includes(url.pathname.split(/(?=\.)/).pop()!)) return;
  const el = html('video', {
    src: source.getAttribute('data-src'),
    ...ObjectFromEntries([...source.attributes]
      .map(attr => [attr.name, attr.value])),
    muted: '',
    controls: '',
  });
  return el;
}
