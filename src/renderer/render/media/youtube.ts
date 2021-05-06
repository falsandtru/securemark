import { html } from 'typed-dom';
import { Collection } from 'spica/collection';

export function youtube(url: URL, cache?: Collection<string, HTMLElement>): HTMLElement | undefined {
  let id: string;
  switch (url.origin) {
    case 'https://www.youtube.com':
      if (!url.pathname.match(/^\/watch$/)) return;
      id = url.href.replace(/.+?=/, '').replace('&', '?');
      break;
    case 'https://youtu.be':
      if (!url.pathname.match(/^\/[\w-]+$/)) return;
      id = url.href.slice(url.href.indexOf('/', 9) + 1);
      break;
    default:
      return;
  }
  if (url.pathname.split('/').pop()!.indexOf('.') !== -1) return;
  if (cache?.has(url.href)) return cache.get(url.href)!.cloneNode(true) as HTMLElement;
  const el = html('div', { class: 'media' }, [
    html('div', { style: 'position: relative; padding-top: 56.25%;' }, [
      html('iframe', {
        src: `https://www.youtube.com/embed/${id}`,
        allowfullscreen: '',
        frameborder: '0',
        style: 'display: block; aspect-ratio: 16/9; position: absolute; top: 0; right: 0; width: 100%; height: 100%;',
        loading: 'lazy',
      }),
    ]),
  ]);
  cache?.set(url.href, el.cloneNode(true));
  return el;
}
