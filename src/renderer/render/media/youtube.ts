import { html } from 'typed-dom';

export function youtube(target: HTMLImageElement, url: URL): HTMLElement | undefined {
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
  if (url.pathname.split('/').pop()!.includes('.')) return;
  const el = html('div', { class: target.className }, [
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
  return el;
}
