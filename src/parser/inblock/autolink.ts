import { AutolinkParser } from '../inblock';
import { union, lazy } from '../../combinator';
import { email } from '../inline';
import { channel } from './autolink/channel';
import { hashtag } from './autolink/hashtag';

export const autolink: AutolinkParser = lazy(() => union([
  email,
  channel,
  hashtag,
]));
