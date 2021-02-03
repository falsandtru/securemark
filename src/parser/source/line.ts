import { undefined } from 'spica/global';
import { AnyLineParser, EmptyLineParser, ContentLineParser } from '../source';
import { line, isEmpty } from '../../combinator';

export const anyline: AnyLineParser = line(() => [[], '']);
export const emptyline: EmptyLineParser = line(s => isEmpty(s) ? [[], ''] : undefined);
export const contentline: ContentLineParser = line(s => !isEmpty(s) ? [[], ''] : undefined);
