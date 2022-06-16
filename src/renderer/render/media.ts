import { RenderingOptions } from '../../../';
import { twitter } from './media/twitter';
import { youtube } from './media/youtube';
import { pdf } from './media/pdf';
import { video } from './media/video';
import { audio } from './media/audio';
import { image } from './media/image';
import { Dict } from 'spica/dict';
import { ReadonlyURL } from 'spica/url';
import { reduce } from 'spica/memoize';

type MediaOptions = NonNullable<RenderingOptions['media']>;

const extend = reduce((opts: MediaOptions): MediaOptions =>
  ({ twitter, youtube, pdf, video, audio, image, ...opts }));

export function media(base: string, source: HTMLImageElement, opts: MediaOptions, cache?: Dict<string, HTMLElement>): HTMLElement | undefined {
  assert(source.matches('img:not([src])[data-src]'));
  opts = extend(opts);
  const url = new ReadonlyURL(source.getAttribute('data-src')!, base);
  return opts.twitter?.(source, url)
      || opts.youtube?.(source, url)
      || opts.pdf?.(source, url)
      || opts.video?.(source, url)
      || opts.audio?.(source, url)
      || opts.image?.(source, url, cache);
}
