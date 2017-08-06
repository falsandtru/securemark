import { twitter } from './media/twitter';
import { youtube } from './media/youtube';
import { gist } from './media/gist';
import { slideshare } from './media/slideshare';
import { pdf } from './media/pdf';

export function media(source: HTMLImageElement): void {
  assert(source instanceof HTMLImageElement);
  assert(source.matches('.media'));
  assert(source.hasAttribute('data-src'));
  assert(source.parentElement);
  const url = source.getAttribute('data-src')!;
  switch (source.getAttribute('data-type')) {
    case 'twitter':
      return void replace(source, twitter(url));
    case 'youtube':
      return void replace(source, youtube(url));
    case 'gist':
      return void replace(source, gist(url));
    case 'slideshare':
      return void replace(source, slideshare(url));
    case 'pdf':
      return void replace(source, pdf(url));
    default:
      return;
  }

  function replace(from: HTMLElement, to: HTMLElement): void {
    return void from.parentElement!.replaceChild(to, from);
  }
}
