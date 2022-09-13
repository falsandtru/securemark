import { Info } from '../..';
import { scope } from './scope';

export function info(source: DocumentFragment | HTMLElement | ShadowRoot): Info {
  const match = scope(source, '.invalid');
  return {
    url: find('a.link, a.url'),
    tel: find('a.tel'),
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
    for (let es = source.querySelectorAll<T>(selector),
             len = es.length, i = 0; i < len; ++i) {
      const el = es[i];
      match(el) && acc.push(el);
    }
    return acc;
  }
}
