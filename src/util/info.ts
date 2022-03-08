import { Info } from '../..';
import { scope } from './scope';

export function info(source: DocumentFragment | HTMLElement | ShadowRoot): Info {
  const match = scope(source, 'section, article, aside, blockquote, .quote, pre, .math, .media');
  return {
    url: find<HTMLAnchorElement>('a:not(.email):not(.account):not(.channel):not(.hashtag):not(.hashnum):not(.anchor)')
      .filter(el => ['http:', 'https:'].includes(el.protocol)),
    tel: find<HTMLAnchorElement>('a:not(.email):not(.account):not(.channel):not(.hashtag):not(.hashnum):not(.anchor)')
      .filter(el => ['tel:'].includes(el.protocol)),
    email: find('a.email'),
    account: find('a.account'),
    channel: find('a.channel'),
    hashtag: find('a.hashtag'),
    hashnum: find('a.hashnum'),
    reply: find('.cite > a.anchor'),
    anchor: find(':not(.cite) > a.anchor'),
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
