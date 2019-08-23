import { Info } from '../..';
import { context } from './context';

export function info(source: DocumentFragment | HTMLElement | ShadowRoot): Info {
  const filter = context(source, 'blockquote, aside, .media, pre.notranslate, .math');
  return {
    hashtag: find('a.hashtag[href]'),
    hashref: find('a.hashref[href]'),
    channel: find('a.channel[href]'),
    account: find('a.account[href]'),
    mention: find('a.address[href]'),
    url: find<HTMLAnchorElement>('a[href]')
      .filter(el => ['http:', 'https:'].includes(el.protocol))
      .filter(el => !el.matches('.hashtag, .hashref, .channel, .account, .address')),
    tel: find<HTMLAnchorElement>('a[href]')
      .filter(el => el.protocol === 'tel:'),
    email: find('a.email[href]'),
    media: find('.media[data-src]'),
  };

  function find<T extends HTMLElement>(selector: string): T[] {
    return [...source.querySelectorAll<T>(selector)].filter(filter);
  }
}
