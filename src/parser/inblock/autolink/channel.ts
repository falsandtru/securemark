import { AutolinkParser } from '../../inblock';
import { sequence, some, verify, subline, focus } from '../../../combinator';
import '../../source/unescapable';
import { account } from './account';
import { hashtag } from './hashtag';
import { html } from 'typed-dom';

export const channel: AutolinkParser.ChannelParser = subline(
  focus(
    sequence([
      verify(account, ([node]) => node instanceof HTMLAnchorElement),
      some(hashtag),
    ]),
    source => [[html('a', { class: 'channel', rel: 'noopener' }, source)], '']));
