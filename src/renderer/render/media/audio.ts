import { html, define } from 'typed-dom';
import { Collection } from 'spica/collection';
import { ObjectFromEntries } from 'spica/alias';

const extensions = [
  '.oga',
  '.ogg',
];

export function audio(target: HTMLImageElement, url: URL, cache?: Collection<string, HTMLElement>): HTMLAudioElement | undefined {
  if (!extensions.includes(url.pathname.split(/(?=\.)/).pop()!)) return;
  if (cache?.has(url.href)) return define(
    cache.get(url.href)!.cloneNode(true) as HTMLAudioElement,
    ObjectFromEntries([...target.attributes]
      .map(attr => [attr.name, attr.value])));
  const el = html('audio', {
    class: target.className,
    src: target.getAttribute('data-src'),
    alt: target.alt,
    controls: '',
  });
  cache?.set(url.href, el.cloneNode(true));
  return el;
}
