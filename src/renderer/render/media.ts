import { twitter } from './media/twitter';
import { youtube } from './media/youtube';
import { gist } from './media/gist';
import { slideshare } from './media/slideshare';
import { pdf } from './media/pdf';
import { image } from './media/image';
import { RenderingOptions } from '../../../';

export function media(source: HTMLImageElement, opts: RenderingOptions['media'] = {}): void {
  assert(!source.hasAttribute('src'));
  assert(source.hasAttribute('data-src'));
  const url = source.getAttribute('data-src')!;
  const target = source.parentElement && source.parentElement.matches('a')
    ? source.parentElement!
    : source;
  const media = void 0
    || (opts.twitter || twitter)(url)
    || (opts.youtube || youtube)(url)
    || (opts.gist || gist)(url)
    || (opts.slideshare || slideshare)(url)
    || (opts.pdf || pdf)(url)
    || (opts.image || image)(source);
  void target.parentElement!.replaceChild(media, target);
}
