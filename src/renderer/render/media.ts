import { twitter } from './media/twitter';
import { youtube } from './media/youtube';
import { gist } from './media/gist';
import { slideshare } from './media/slideshare';
import { pdf } from './media/pdf';
import { image } from './media/image';
import { RenderingOptions } from '../../../';

export function media(source: HTMLImageElement, opts: RenderingOptions['media'] = {}): void {
  assert(source instanceof HTMLImageElement);
  assert(!source.hasAttribute('src'));
  assert(source.hasAttribute('data-src'));
  assert(source.parentElement);
  const url = source.getAttribute('data-src')!;
  const target = source.closest('a') || source;
  void target.parentElement!.replaceChild(
    void 0
    || opts.twitter !== false && twitter(url)
    || opts.youtube !== false && youtube(url)
    || opts.gist !== false && gist(url)
    || opts.slideshare !== false && slideshare(url)
    || opts.pdf !== false && pdf(url)
    || image(source),
    target);
}
