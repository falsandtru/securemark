import { AutolinkParser } from '../inline';
import { union } from '../../combinator';
import { uri } from './autolink/uri';

export const autolink: AutolinkParser = union([
  uri,
]);
