import { AutolinkParser } from '../inblock';
import { union, verify } from '../../combinator';
import { channel } from './autolink/channel';
import { account } from './autolink/account';
import { hashtag } from './autolink/hashtag';

export const autolink: AutolinkParser = union([
  channel,
  account,
  verify(hashtag, (_, rest) => rest[0] !== '#'),
]);
