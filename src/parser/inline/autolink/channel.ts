import { AutolinkParser } from '../../inline';
import { sequence, some, constraint, validate, bind } from '../../../combinator';
import { account } from './account';
import { hashtag } from './hashtag';
import { State } from '../../context';
import { stringify } from '../../util';
import { define } from 'typed-dom/dom';

// https://example/@user?ch=a+b must be a user channel page or a redirect page going there.

export const channel: AutolinkParser.ChannelParser = validate('@',
  constraint(State.autolink, false, bind(
  sequence([
    account,
    some(hashtag),
  ]),
  (es, rest) => {
    const source = stringify(es);
    const el = es[0];
    if (typeof el === 'string') return [es, rest];
    const url = `${el.getAttribute('href')}?ch=${source.slice(source.indexOf('#') + 1).replace(/#/g, '+')}`;
    return [[define(el, { class: 'channel', href: url }, source)], rest];
  })));
