import { AnyLineParser, EmptyLineParser, ContentLineParser } from '../source';
import { line, isEmpty } from '../../combinator';

export const anyline: AnyLineParser = line(() => [[], '']);
export const emptyline: EmptyLineParser = line(i => isEmpty(i.source) ? [[], ''] : undefined);
export const contentline: ContentLineParser = line(i => !isEmpty(i.source) ? [[], ''] : undefined);
