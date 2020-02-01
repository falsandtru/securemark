import { AnyLineParser, EmptyLineParser, ContentLineParser } from '../source';
import { line, isEmpty } from '../../combinator';

export const anyline: AnyLineParser = line(() => [[], ''], false);
export const emptyline: EmptyLineParser = line(s => isEmpty(s) ? [[], ''] : void 0, false);
export const contentline: ContentLineParser = line(s => !isEmpty(s) ? [[], ''] : void 0, false);
