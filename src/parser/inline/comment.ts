import { CommentParser } from '../inline';
import { union, focus } from '../../combinator';
import '../source/unescapable';

export const comment: CommentParser = union<CommentParser>([
  focus(
    /^<(#+)\s+(?:\S+\s+)*?\1>/,
    _ => [[], '']),
  focus(
    /^<!-{2,}\s+(?:\S+\s+)*?-{2,}>/,
    _ => [[], '']),
]);
