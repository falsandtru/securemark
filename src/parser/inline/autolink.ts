import { combine } from '../../combinator/combine';
import { AutolinkParser } from '../inline';
import { uri } from './autolink/uri';
import { account } from './autolink/account';

export const autolink: AutolinkParser = combine<[
  AutolinkParser.UriParser,
  AutolinkParser.AccountParser
], HTMLAnchorElement | HTMLSpanElement | Text>([
  uri,
  account
]);
