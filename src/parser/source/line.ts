import { AnyLineParser, EmptyLineParser, ContentLineParser } from '../source';
import { line } from '../../combinator';

export const anyline: AnyLineParser = line(() => [[], ''], false);
export const emptyline: EmptyLineParser = line(s => s.trim() === '' ? [[], ''] : undefined, false);
export const contentline: ContentLineParser = line(s => s.trim() !== '' ? [[], ''] : undefined, false);
