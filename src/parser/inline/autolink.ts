import { AutolinkParser } from '../inline';
import { union } from '../../combinator';
import { uri } from './autolink/uri';
import { email } from './autolink/email';
import { channel } from './autolink/channel';
import { account } from './autolink/account';
import { hashtag } from './autolink/hashtag';

export const autolink: AutolinkParser = union([
  uri,
  email,
  channel,
  account,
  hashtag,
]);
