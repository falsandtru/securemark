import { AutolinkParser } from '../../inline';
import { sequence, some, validate, fmap } from '../../../combinator';
import { stringify } from '../../util';
import { account } from './account';
import { hashtag } from './hashtag';
import { define } from 'typed-dom';

// https://example.com/@user?ch=a+b must be a user channel page or a redirect page going there.

export const channel: AutolinkParser.ChannelParser = validate('@', fmap(
  sequence([
    account,
    some(hashtag),
  ]),
  es => {
    const source = stringify(es);
    const el = es[0];
    const url = `${el.getAttribute('href')}?ch=${source.slice(source.indexOf('#') + 1).replace(/#/g, '+')}`;
    return [define(el, { class: 'channel', href: url }, source)];
  }));
