import { twitter } from './media/twitter';
import { youtube } from './media/youtube';
import { gist } from './media/gist';
import { slideshare } from './media/slideshare';
import { pdf } from './media/pdf';
import { image } from './media/image';

export function media(source: HTMLImageElement): void {
  assert(source.parentElement);
  assert(source.hasAttribute('data-src'));
  const target = source.closest('a') || source;
  const el = void 0
    || twitter(source)
    || youtube(source)
    || gist(source)
    || slideshare(source)
    || pdf(source)
    || image(source);
  void target.parentElement!.replaceChild(el, target);
}
