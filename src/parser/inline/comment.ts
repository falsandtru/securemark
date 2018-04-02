import { CommentParser } from '../inline';
import { surround } from '../../combinator';

const syntax = /^<(#+)\s+(?:\S+\s+)*?\1>/;

export const comment: CommentParser = surround<CommentParser>(syntax, s => [[], s], '', false);
