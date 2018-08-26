﻿import { AutolinkParser } from '../../inblock';
import { sequence, some, verify, subline, rewrite } from '../../../combinator';
import '../../source/unescapable';
import { account } from './account';
import { hashtag_ } from './hashtag';
import { html } from 'typed-dom';

export const channel: AutolinkParser.ChannelParser = subline(
  rewrite(
    sequence<AutolinkParser.ChannelParser>([
      verify(account, ([node]) => node instanceof HTMLAnchorElement),
      some(hashtag_),
    ]),
    source => [[html('a', { class: 'channel', rel: 'noopener' }, source)], '']));
