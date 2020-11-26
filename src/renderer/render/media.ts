import { RenderingOptions } from '../../../';
import { twitter } from './media/twitter';
import { youtube } from './media/youtube';
import { gist } from './media/gist';
import { pdf } from './media/pdf';
import { video } from './media/video';
import { audio } from './media/audio';
import { image } from './media/image';
import { Collection } from 'spica/collection';
import { ReadonlyURL } from 'spica/url';

export function media(base: string, target: HTMLImageElement, opts: NonNullable<RenderingOptions['media']>, cache?: Collection<string, HTMLElement>): HTMLElement | undefined {
  assert(target.matches('img:not([src])[data-src]'));
  opts = { twitter, youtube, gist, pdf, video, audio, image, ...opts };
  const url = new ReadonlyURL(target.getAttribute('data-src')!, base);
  const alt = target.getAttribute('alt') || '';
  return opts.twitter?.(url)
      || opts.youtube?.(url, cache)
      || opts.gist?.(url, cache)
      || opts.pdf?.(url, cache)
      || opts.video?.(url, alt, cache)
      || opts.audio?.(url, alt, cache)
      || opts.image?.(url, alt, cache);
}
