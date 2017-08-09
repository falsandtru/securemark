import { twitter } from './media/twitter';
import { youtube } from './media/youtube';
import { gist } from './media/gist';
import { slideshare } from './media/slideshare';
import { pdf } from './media/pdf';
import { RenderingOptions } from '../../../';

export function media(source: HTMLImageElement, opts: RenderingOptions['media'] = {}): void {
  assert(source instanceof HTMLImageElement);
  assert(source.matches('.media'));
  assert(source.hasAttribute('data-src'));
  assert(source.parentElement);
  const url = source.getAttribute('data-src')!;
  switch (source.getAttribute('data-type')) {
    case opts.twitter !== false
      && 'twitter':
      return void replace(source, twitter(url));
    case opts.youtube !== false
      && 'youtube':
      return void replace(source, youtube(url));
    case opts.gist !== false
      && 'gist':
      return void replace(source, gist(url));
    case opts.slideshare !== false
      && 'slideshare':
      return void replace(source, slideshare(url));
    case opts.pdf !== false
      && 'pdf':
      return void replace(source, pdf(url));
    default:
      return;
  }

  function replace(from: HTMLElement, to: HTMLElement): void {
    return void from.parentElement!.replaceChild(to, from);
  }
}
