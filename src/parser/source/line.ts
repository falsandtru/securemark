import { AnyLineParser, EmptyLineParser, BlankLineParser, ContentLineParser } from '../source';
import { line } from '../../combinator';

export const anyline: AnyLineParser = line((_, state) => [[], '', state], false);
export const emptyline: EmptyLineParser = line((s, state) => s.trim() === '' ? [[], '', state] : undefined, false);

const invisible = /^(?:\\?\s)*$/;
export const blankline: BlankLineParser = line((s, state) => invisible.test(s) ? [[], '', state] : undefined, false);
export const contentline: ContentLineParser = line((s, state) => !invisible.test(s) ? [[], '', state] : undefined, false);
