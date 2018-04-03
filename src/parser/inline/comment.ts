import { CommentParser } from '../inline';
import { match } from '../../combinator';

const syntax = /^<(#+)\s+(?:\S+\s+)*?\1>/;

export const comment: CommentParser = match(syntax, ([m], s) => [[], s.slice(m.length)]);
