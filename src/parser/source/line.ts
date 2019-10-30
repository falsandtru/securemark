import { AnyLineParser, EmptyLineParser, BlankLineParser, ContentLineParser } from '../source';
import { line } from '../../combinator';

export const anyline: AnyLineParser = line((_, c) => [[], '', c], false);
export const emptyline: EmptyLineParser = line((s, c) => s.trim() === '' ? [[], '', c] : undefined, false);

const invisible = /^(?:\\?\s)*$/;
export const blankline: BlankLineParser = line((s, c) => invisible.test(s) ? [[], '', c] : undefined, false);
export const contentline: ContentLineParser = line((s, c) => !invisible.test(s) ? [[], '', c] : undefined, false);
