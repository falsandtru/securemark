import { html } from 'typed-dom';
import { ObjectFromEntries } from 'spica/alias';

const extensions = [
  '.webm',
  '.ogv',
];

export function video(target: HTMLImageElement, url: URL): HTMLVideoElement | undefined {
  if (!extensions.includes(url.pathname.split(/(?=\.)/).pop()!)) return;
  const el = html('video', {
    src: target.getAttribute('data-src'),
    ...ObjectFromEntries([...target.attributes]
      .map(attr => [attr.name, attr.value])),
    muted: '',
    controls: '',
  });
  return el;
}
