import { AnyLineParser, EmptyLineParser, ContentLineParser } from '../source';
import { line, isBlank } from '../../combinator';

export const anyline: AnyLineParser = line(() => [[]]);
export const emptyline: EmptyLineParser = line(({ context: { source } }) => isBlank(source) ? [[]] : undefined);
export const contentline: ContentLineParser = line(({ context: { source } }) => !isBlank(source) ? [[]] : undefined);
