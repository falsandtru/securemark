import { AutolinkParser } from '../../inline';
import { sequence, some, validate, bind } from '../../../combinator';
import { account } from './account';
import { hashtag } from './hashtag';
import { stringify } from '../../util';
import { define } from 'typed-dom';

// https://example/@user?ch=a+b must be a user channel page or a redirect page going there.

export const channel: AutolinkParser.ChannelParser = validate('@', bind(
  sequence([
    account,
    some(hashtag),
  ]),
  (es, rest) => {
    const source = stringify(es);
    if (source.indexOf('/', source.indexOf('#')) > -1) return;
    const el = es[0];
    const url = `${el.getAttribute('href')}?ch=${source.slice(source.indexOf('#') + 1).replace(/#/g, '+')}`;
    return [[define(el, { class: 'channel', href: url }, source)], rest];
  }));
