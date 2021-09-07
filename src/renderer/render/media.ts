import { RenderingOptions } from '../../../';
import { twitter } from './media/twitter';
import { youtube } from './media/youtube';
import { pdf } from './media/pdf';
import { video } from './media/video';
import { audio } from './media/audio';
import { image } from './media/image';
import { Collection } from 'spica/collection';
import { ReadonlyURL } from 'spica/url';
import { reduce } from 'spica/memoize';

type MediaOptions = NonNullable<RenderingOptions['media']>;

const extend = reduce((opts: MediaOptions): MediaOptions =>
  ({ twitter, youtube, pdf, video, audio, image, ...opts }));

export function media(base: string, target: HTMLImageElement, opts: MediaOptions, cache?: Collection<string, HTMLElement>): HTMLElement | undefined {
  assert(target.matches('img:not([src])[data-src]'));
  opts = extend(opts);
  const url = new ReadonlyURL(target.getAttribute('data-src')!, base);
  return opts.twitter?.(target, url)
      || opts.youtube?.(target, url)
      || opts.pdf?.(target, url)
      || opts.video?.(target, url)
      || opts.audio?.(target, url)
      || opts.image?.(target, url, cache);
}
