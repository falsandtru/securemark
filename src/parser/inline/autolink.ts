import { AutolinkParser } from '../inline';
import { combine } from '../../combinator';
import { url } from './autolink/url';
import { account } from './autolink/account';

export const autolink: AutolinkParser = combine<HTMLAnchorElement | HTMLImageElement | HTMLSpanElement | Text, [
  AutolinkParser.UrlParser,
  AutolinkParser.AccountParser
]>([
  url,
  account,
]);
