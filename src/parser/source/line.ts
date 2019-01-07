import { AnyLineParser, EmptyLineParser, BlankLineParser, ContentLineParser } from '../source';
import { line } from '../../combinator';

export const anyline: AnyLineParser = line(_ => [[], ''], false);
export const emptyline: EmptyLineParser = line(s => s.trim() === '' ? [[], ''] : undefined, false);

const invisible = /^(?:\\?\s)*$/;
export const blankline: BlankLineParser = line(s => s.search(invisible) === 0 ? [[], ''] : undefined, false);
export const contentline: ContentLineParser = line(s => s.search(invisible) !== 0 ? [[], ''] : undefined, false);
