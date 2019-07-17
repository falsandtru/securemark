import { AutolinkParser } from '../../inline';
import { sequence, some, subline, fmap } from '../../../combinator';
import { account } from './account';
import { hashtag } from './hashtag';
import { stringify } from '../../util';
import { html } from 'typed-dom';

export const channel: AutolinkParser.ChannelParser = subline(fmap(
  sequence([
    account,
    some(hashtag),
  ]),
  ns => [html('a', { class: 'channel', rel: 'noopener' }, stringify(ns))]));
