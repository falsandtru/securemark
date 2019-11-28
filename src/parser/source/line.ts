import { AnyLineParser, EmptyLineParser, BlankLineParser, ContentLineParser } from '../source';
import { line } from '../../combinator';

export const anyline: AnyLineParser = line(() => [[], ''], false);
export const emptyline: EmptyLineParser = line(s => s.trim() === '' ? [[], ''] : undefined, false);

const invisible = /^(?:\\?\s)*$/;
export const blankline: BlankLineParser = line(s => invisible.test(s) ? [[], ''] : undefined, false);
export const contentline: ContentLineParser = line(s => !invisible.test(s) ? [[], ''] : undefined, false);
