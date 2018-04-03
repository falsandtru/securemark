import { CommentParser } from '../inline';
import { match } from '../../combinator';

const syntax = /^<(#+)\s+(?:\S+\s+)*?\1>/;

export const comment: CommentParser = match(syntax, (_, r) => [[], r]);
