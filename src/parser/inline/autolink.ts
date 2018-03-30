import { AutolinkParser } from '../inline';
import { union } from '../../combinator';
import { url } from './autolink/url';
import { account } from './autolink/account';

export const autolink: AutolinkParser = union<AutolinkParser>([
  url,
  account,
]);
