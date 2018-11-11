import { AutolinkParser } from '../inblock';
import { union, build } from '../../combinator';
import { email } from '../inline';
import { channel } from './autolink/channel';
import { hashtag } from './autolink/hashtag';

export const autolink: AutolinkParser = build(() => union([
  email,
  channel,
  hashtag,
]));
