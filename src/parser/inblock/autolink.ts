import { AutolinkParser } from '../inblock';
import { union } from '../../combinator';
import { hashtag } from './autolink/hashtag';

export const autolink: AutolinkParser = union([
  hashtag,
]);
