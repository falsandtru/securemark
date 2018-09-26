import { AutolinkParser } from '../inblock';
import { union } from '../../combinator';
import { email } from '../inline';
import { channel } from './autolink/channel';
import { hashtag } from './autolink/hashtag';

export const autolink: AutolinkParser = union([
  email,
  channel,
  hashtag,
]);
