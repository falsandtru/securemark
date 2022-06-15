import { Info } from '../..';
import { scope } from './scope';
import { push } from 'spica/array';

export function info(source: DocumentFragment | HTMLElement | ShadowRoot): Info {
  const match = scope(source, '.invalid');
  return {
    url: find<HTMLAnchorElement>('a:not(:is(.email, .account, .channel, .hashtag, .hashnum, .anchor))')
      .filter(el => ['http:', 'https:'].includes(el.protocol)),
    tel: find<HTMLAnchorElement>('a:not(:is(.email, .account, .channel, .hashtag, .hashnum, .anchor))')
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
    return push([], source.querySelectorAll<T>(selector))
      .filter(match);
  }
}
