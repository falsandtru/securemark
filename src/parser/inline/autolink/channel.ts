import { AutolinkParser } from '../../inline';
import { sequence, some, subline, verify, fmap } from '../../../combinator';
import { account } from './account';
import { hashtag_ } from './hashtag';
import { stringify } from '../../util';
import { html } from 'typed-dom';

export const channel: AutolinkParser.ChannelParser = subline(fmap(verify(
  sequence([
    verify(account, ([node]) => node instanceof HTMLAnchorElement),
    some(verify(hashtag_, ([node]) => node instanceof HTMLAnchorElement)),
  ]),
  (_, rest) => !rest.startsWith('#')),
  ns => [html('a', { class: 'channel', rel: 'noopener' }, stringify(ns))]));
