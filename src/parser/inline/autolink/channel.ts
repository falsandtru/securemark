import { AutolinkParser } from '../../inline';
import { sequence, some, subline, verify, fmap } from '../../../combinator';
import '../../source/unescapable';
import { account } from './account';
import { hashtag_ } from './hashtag';
import { stringify } from '../../util';
import { html } from 'typed-dom';

export const channel: AutolinkParser.ChannelParser = subline(fmap(
  sequence([
    verify(account, ([node]) => node instanceof HTMLAnchorElement),
    some(verify(hashtag_, ([node]) => node instanceof HTMLAnchorElement)),
  ]),
  ns => [html('a', { class: 'channel', rel: 'noopener' }, stringify(ns))]));
