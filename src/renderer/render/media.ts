import { RenderingOptions } from '../../../';
import { twitter } from './media/twitter';
import { youtube } from './media/youtube';
import { gist } from './media/gist';
import { slideshare } from './media/slideshare';
import { pdf } from './media/pdf';
import { video } from './media/video';
import { audio } from './media/audio';
import { image } from './media/image';

export function media(target: HTMLImageElement, opts: NonNullable<RenderingOptions['media']>): HTMLElement | undefined {
  assert(target.matches(':not([src])[data-src]'));
  opts = { twitter, youtube, gist, slideshare, pdf, video, audio, image, ...opts };
  const url = new URL(target.getAttribute('data-src')!, window.location.href);
  const alt = target.getAttribute('alt') || '';
  const el = (() => {
    switch (`${url.protocol}//${url.host}`) {
      case 'https://twitter.com':
        return opts.twitter
          ? opts.twitter(url.href)
          : undefined;
      case 'https://www.youtube.com':
      case 'https://youtu.be':
        return opts.youtube
          ? opts.youtube(url.href)
          : undefined;
      case 'https://gist.github.com':
        return opts.gist
          ? opts.gist(url.href)
          : undefined;
      case 'https://www.slideshare.net':
        return opts.slideshare
          ? opts.slideshare(url.href)
          : undefined;
    }
    switch (url.pathname.split(/(?=\.)/).pop()!) {
      case '.pdf':
        return opts.pdf
          ? opts.pdf(url.href)
          : undefined;
      case '.webm':
      case '.ogv':
        return opts.video
          ? opts.video(url.href, alt)
          : undefined;
      case '.oga':
      case '.ogg':
        return opts.audio
          ? opts.audio(url.href, alt)
          : undefined;
    }
    return opts.image
      ? opts.image(url.href, alt)
      : undefined;
  })();
  if (!el) return;
  void el.classList.add('media');
  return el;
}
