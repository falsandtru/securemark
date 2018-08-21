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
  assert(target.matches('img:not([src])[data-src]'));
  opts = { twitter, youtube, gist, slideshare, pdf, video, audio, image, ...opts };
  const url = new URL(target.getAttribute('data-src')!, window.location.href);
  const alt = target.getAttribute('alt') || '';
  const el = undefined
    || opts.twitter && opts.twitter(url)
    || opts.youtube && opts.youtube(url)
    || opts.gist && opts.gist(url)
    || opts.slideshare && opts.slideshare(url)
    || opts.pdf && opts.pdf(url)
    || opts.video && opts.video(url, alt)
    || opts.audio && opts.audio(url, alt)
    || opts.image && opts.image(url, alt);
  if (!el) return;
  void el.classList.add('media');
  return el;
}
