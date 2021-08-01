import { Info } from '../..';
import { context } from './context';

export function info(source: DocumentFragment | HTMLElement | ShadowRoot): Info {
  const match = context(source, 'section, article, aside, blockquote, .quote, pre, .math, .media');
  return {
    hashtag: find('a.hashtag[href]'),
    hashref: find('a.hashref[href]'),
    channel: find('a.channel[href]'),
    account: find('a.account[href]'),
    mention: find('.cite > a.anchor[href]'),
    url: find<HTMLAnchorElement>('a[href]:not(.hashtag):not(.hashref):not(.channel):not(.account):not(.anchor)')
      .filter(el => ['http:', 'https:'].includes(el.protocol)),
    tel: find<HTMLAnchorElement>('a[href]:not(.hashtag):not(.hashref):not(.channel):not(.account):not(.anchor)')
      .filter(el => el.protocol === 'tel:'),
    email: find('a.email[href]'),
    media: find('.media[data-src]'),
  };

  function find<T extends HTMLElement>(selector: string): T[] {
    const acc: T[] = [];
    for (let es = source.querySelectorAll<T>(selector), i = 0, len = es.length; i < len; ++i) {
      const el = es[i];
      if (!match(el)) continue;
      acc.push(el);
    }
    return acc;
  }
}
