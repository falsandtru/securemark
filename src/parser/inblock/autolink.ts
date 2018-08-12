import { AutolinkParser } from '../inblock';
import { union, verify } from '../../combinator';
import { account } from './autolink/account';
import { hashtag } from './autolink/hashtag';

export const autolink: AutolinkParser = union([
  account,
  verify(hashtag, (_, rest) => rest[0] !== '#'),
]);
