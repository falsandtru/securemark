import { combine } from '../../combinator/combine';
import { AutolinkParser } from '../inline';
import { url } from './autolink/url';
import { account } from './autolink/account';

export const autolink: AutolinkParser = combine<[
  AutolinkParser.UrlParser,
  AutolinkParser.AccountParser
], HTMLAnchorElement | HTMLImageElement | HTMLSpanElement | Text>([
  url,
  account
]);
