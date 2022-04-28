import { ObjectFromEntries } from 'spica/alias';
import { html } from 'typed-dom/dom';

const extensions = [
  '.webm',
  '.ogv',
];

export function video(source: HTMLImageElement, url: URL): HTMLVideoElement | undefined {
  if (!extensions.includes(url.pathname.split(/(?=\.)/).pop()!)) return;
  return html('video', {
    src: source.getAttribute('data-src'),
    'data-type': 'video',
    ...ObjectFromEntries([...source.attributes]
      .map(attr => [attr.name, attr.value])),
    muted: '',
    controls: '',
  });
}
