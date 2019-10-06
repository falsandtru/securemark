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
  opts.video?.(url, alt)
  return opts.twitter?.(url)
      || opts.youtube?.(url)
      || opts.gist?.(url)
      || opts.slideshare?.(url)
      || opts.pdf?.(url)
      || opts.video?.(url, alt)
      || opts.audio?.(url, alt)
      || opts.image?.(url, alt);
}
