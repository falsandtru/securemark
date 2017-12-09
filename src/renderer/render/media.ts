import { twitter } from './media/twitter';
import { youtube } from './media/youtube';
import { gist } from './media/gist';
import { slideshare } from './media/slideshare';
import { pdf } from './media/pdf';
import { video } from './media/video';
import { audio } from './media/audio';
import { image } from './media/image';
import { RenderingOptions } from '../../../';

export function media(target: HTMLImageElement, opts: RenderingOptions['media'] = {}): HTMLElement {
  assert(target.matches(':not([src])[data-src]'));
  const url = target.getAttribute('data-src')!;
  return undefined
    || (opts.twitter || twitter)(url)
    || (opts.youtube || youtube)(url)
    || (opts.gist || gist)(url)
    || (opts.slideshare || slideshare)(url)
    || (opts.pdf || pdf)(url)
    || (opts.video || video)(url, target.getAttribute('alt') || '')
    || (opts.audio || audio)(url, target.getAttribute('alt') || '')
    || (opts.image || image)(url, target.getAttribute('alt') || '');
}
