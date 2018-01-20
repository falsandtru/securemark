import { RenderingOptions } from '../../../';
import { twitter } from './media/twitter';
import { youtube } from './media/youtube';
import { gist } from './media/gist';
import { slideshare } from './media/slideshare';
import { pdf } from './media/pdf';
import { video } from './media/video';
import { audio } from './media/audio';
import { image } from './media/image';

export function media(target: HTMLImageElement, opts: RenderingOptions['media'] = {}): HTMLElement {
  assert(target.matches(':not([src])[data-src]'));
  const url = target.getAttribute('data-src')!;
  const alt = target.getAttribute('alt') || '';
  switch(true) {
    case url.startsWith('https://twitter.com/'):
      return (opts.twitter || twitter)(url);
    case url.startsWith('https://www.youtube.com/') || url.startsWith('https://youtu.be/'):
      return (opts.youtube || youtube)(url);
    case url.startsWith('https://gist.github.com/'):
      return (opts.gist || gist)(url);
    case url.startsWith('https://www.slideshare.net/'):
      return (opts.slideshare || slideshare)(url);
    case url.split('/').length > 3 && ['.pdf'].some(ext => url.split(/[?#]/, 1)[0].toLowerCase().endsWith(ext)):
      return (opts.pdf || pdf)(url);
    case url.split('/').length > 3 && ['.webm', '.ogv'].some(ext => url.split(/[?#]/, 1)[0].toLowerCase().endsWith(ext)):
      return (opts.video || video)(url, alt);
    case url.split('/').length > 3 && ['.oga', '.ogg'].some(ext => url.split(/[?#]/, 1)[0].toLowerCase().endsWith(ext)):
      return (opts.audio || audio)(url, alt);
    default:
      return (opts.image || image)(url, alt);
  }
}
