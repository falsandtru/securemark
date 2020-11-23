import { location } from 'spica/global';
import { RenderingOptions } from '../../../';
import { twitter } from './media/twitter';
import { youtube } from './media/youtube';
import { gist } from './media/gist';
import { pdf } from './media/pdf';
import { video } from './media/video';
import { audio } from './media/audio';
import { image } from './media/image';
import { Cache } from 'spica/cache';
import { ReadonlyURL } from 'spica/url';

const { origin } = location;

export function media(target: HTMLImageElement, opts: NonNullable<RenderingOptions['media']>, cache?: Cache<string, HTMLElement>): HTMLElement | undefined {
  assert(target.matches('img:not([src])[data-src]'));
  opts = { twitter, youtube, gist, pdf, video, audio, image, ...opts };
  const url = new ReadonlyURL(target.getAttribute('data-src')!, origin);
  const alt = target.getAttribute('alt') || '';
  return opts.twitter?.(url)
      || opts.youtube?.(url, cache)
      || opts.gist?.(url, cache)
      || opts.pdf?.(url, cache)
      || opts.video?.(url, alt, cache)
      || opts.audio?.(url, alt, cache)
      || opts.image?.(url, alt, cache);
}
