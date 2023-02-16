import { AnyLineParser, EmptyLineParser, ContentLineParser } from '../source';
import { line, isBlank } from '../../combinator';

export const anyline: AnyLineParser = line(() => [[], '']);
export const emptyline: EmptyLineParser = line(i => isBlank(i.source) ? [[], ''] : undefined);
export const contentline: ContentLineParser = line(i => !isBlank(i.source) ? [[], ''] : undefined);
