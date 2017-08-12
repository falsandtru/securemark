import { twitter } from './media/twitter';
import { youtube } from './media/youtube';
import { gist } from './media/gist';
import { slideshare } from './media/slideshare';
import { pdf } from './media/pdf';
import { image } from './media/image';
import { RenderingOptions } from '../../../';

export function media(target: HTMLImageElement, opts: RenderingOptions['media'] = {}): HTMLElement {
  assert(target.matches(':not([src])[data-src]'));
  const url = target.getAttribute('data-src')!;
  return void 0
    || (opts.twitter || twitter)(url)
    || (opts.youtube || youtube)(url)
    || (opts.gist || gist)(url)
    || (opts.slideshare || slideshare)(url)
    || (opts.pdf || pdf)(url)
    || (opts.image || image)(url, target.getAttribute('alt') || '');
}
