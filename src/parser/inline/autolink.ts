import { AutolinkParser } from '../inline';
import { union } from '../../combinator';
import { uri } from './autolink/uri';
import { account } from './autolink/account';

export const autolink: AutolinkParser = union([
  uri,
  account,
]);
