import { AutolinkParser } from '../inline';
import { SubParsers, combine } from '../../combinator';
import { url } from './autolink/url';
import { account } from './autolink/account';

export const autolink: AutolinkParser = combine<SubParsers<AutolinkParser>>([
  url,
  account,
]);
