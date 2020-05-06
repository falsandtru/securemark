import { AutolinkParser } from '../../inline';
import { sequence, some, validate, fmap } from '../../../combinator';
import { stringify } from '../../util';
import { account } from './account';
import { hashtag } from './hashtag';
import { define } from 'typed-dom';

export const channel: AutolinkParser.ChannelParser = validate('@', fmap(
  sequence([
    account,
    some(hashtag),
  ]),
  es => [define(es[0], { class: 'channel' }, stringify(es))]));
