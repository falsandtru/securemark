import { AutolinkParser } from '../inblock';
import { union } from '../../combinator';
import { channel } from './autolink/channel';
import { account } from './autolink/account';
import { hashtag } from './autolink/hashtag';

export const autolink: AutolinkParser = union([
  channel,
  account,
  hashtag,
]);
