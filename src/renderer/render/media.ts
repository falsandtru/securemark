import { twitter } from './media/twitter';
import { youtube } from './media/youtube';
import { gist } from './media/gist';
import { slideshare } from './media/slideshare';
import { pdf } from './media/pdf';
import { image } from './media/image';

export function media(source: HTMLImageElement): void {
  assert(source instanceof HTMLImageElement);
  assert(source.matches('.media'));
  assert(source.hasAttribute('data-src'));
  assert(source.parentElement);
  const url = source.getAttribute('data-src')!;
  const target = source.closest('a') || source;
  const el = void 0
    || twitter(url)
    || youtube(url)
    || gist(url)
    || slideshare(url)
    || pdf(url)
    || image(source);
  void target.parentElement!.replaceChild(el, target);
}
