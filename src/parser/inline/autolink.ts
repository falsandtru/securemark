import { AutolinkParser } from '../inline';
import { union } from '../../combinator';
import { uri } from './autolink/uri';
import { email } from './autolink/email';
import { account } from './autolink/account';

export const autolink: AutolinkParser = union([
  uri,
  email,
  account,
]);
